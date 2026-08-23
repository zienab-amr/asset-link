const axios = require("axios");
const crypto = require("crypto");

const PAYMOB_BASE_URL = "https://accept.paymob.com/api";

const {
    PAYMOB_API_KEY,
    PAYMOB_INTEGRATION_ID,
    PAYMOB_IFRAME_ID,
    PAYMOB_HMAC_SECRET,
} = process.env;

// ================= Step 1: Auth =================
const getAuthToken = async () => {
    const { data } = await axios.post(`${PAYMOB_BASE_URL}/auth/tokens`, {
        api_key: PAYMOB_API_KEY,
    });
    return data.token;
};

// ================= Step 2: Order Registration =================
const registerOrder = async (authToken, amountCents, merchantOrderId) => {
    const { data } = await axios.post(`${PAYMOB_BASE_URL}/ecommerce/orders`, {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: amountCents,
        currency: "EGP",
        merchant_order_id: merchantOrderId,
        items: [],
    });
    return data;
};

// ================= Step 3: Payment Key =================
const getPaymentKey = async ({ authToken, orderId, amountCents, billingData }) => {
    const { data } = await axios.post(`${PAYMOB_BASE_URL}/acceptance/payment_keys`, {
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency: "EGP",
        integration_id: PAYMOB_INTEGRATION_ID,
    });
    return data.token;
};

const initiatePaymobPayment = async ({ amount, merchantOrderId, billingData }) => {
    const amountCents = Math.round(amount * 100);

    console.log("🔷 Starting Paymob payment. amountCents:", amountCents, "merchantOrderId:", merchantOrderId);
    console.log("🔷 ENV CHECK:", {
        hasApiKey: !!PAYMOB_API_KEY,
        integrationId: PAYMOB_INTEGRATION_ID,
        iframeId: PAYMOB_IFRAME_ID,
        hasHmac: !!PAYMOB_HMAC_SECRET,
    });

    let authToken;
    try {
        authToken = await getAuthToken();
        console.log("✅ Auth token OK");
    } catch (err) {
        console.log("❌ AUTH FAILED:", JSON.stringify(err.response?.data || err.message));
        throw err;
    }

    let order;
    try {
        order = await registerOrder(authToken, amountCents, merchantOrderId);
        console.log("✅ Order OK:", order.id);
    } catch (err) {
        console.log("❌ ORDER FAILED:", JSON.stringify(err.response?.data || err.message));
        throw err;
    }

    let paymentKey;
    try {
        console.log("🔷 billingData being sent:", JSON.stringify(billingData));
        paymentKey = await getPaymentKey({
            authToken,
            orderId: order.id,
            amountCents,
            billingData,
        });
        console.log("✅ Payment key OK");
    } catch (err) {
        console.log("❌ PAYMENT KEY FAILED:", JSON.stringify(err.response?.data || err.message));
        throw err;
    }

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

    return {
        paymobOrderId: order.id,
        paymentKey,
        iframeUrl,
    };
};

// ================= HMAC Verification =================
const HMAC_FIELDS_ORDER = [
    "amount_cents", "created_at", "currency", "error_occured",
    "has_parent_transaction", "id", "integration_id", "is_3d_secure",
    "is_auth", "is_capture", "is_refunded", "is_standalone_payment",
    "is_voided", "order.id", "owner", "pending",
    "source_data.pan", "source_data.sub_type", "source_data.type", "success",
];

const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const verifyHmac = (transactionObj, receivedHmac) => {
    const concatenated = HMAC_FIELDS_ORDER.map((field) => {
        const value = getNestedValue(transactionObj, field);
        return value === undefined || value === null ? "" : String(value);
    }).join("");

    const calculated = crypto
        .createHmac("sha512", PAYMOB_HMAC_SECRET)
        .update(concatenated)
        .digest("hex");

    const a = Buffer.from(calculated);
    const b = Buffer.from(receivedHmac || "");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
};

module.exports = {
    initiatePaymobPayment,
    verifyHmac,
};