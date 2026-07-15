# Register Company + OTP + Memory Cache

## Feature Overview

تمكن هذه الخاصية الشركات من إنشاء حساب جديد على منصة **AssetLink** مع التحقق من البريد الإلكتروني باستخدام **OTP**، بالإضافة إلى استخدام **Memory Cache** لتخزين رمز التحقق مؤقتًا قبل تفعيل الحساب.

---

# User Story

**As a Company Owner**

I want to register my company using my business information and verify my email with an OTP

So that I can securely create and activate my company account.

---

# Functional Requirements

## Register Company

يقوم المستخدم بإدخال البيانات التالية:

- Company Name
- Company Email
- Phone Number
- Password
- Confirm Password
- Commercial Registration Number (Optional)
- Company Address (Optional)

بعد التحقق من صحة البيانات:

- التأكد من عدم وجود البريد الإلكتروني مسبقًا.
- تشفير كلمة المرور.
- إنشاء رمز OTP عشوائي.
- تخزين بيانات التسجيل مؤقتًا داخل Memory Cache.
- إرسال OTP إلى البريد الإلكتروني.

---

## OTP Verification

يقوم المستخدم بإدخال:

- Email
- OTP Code

يقوم النظام بالتحقق من:

- صحة الكود.
- عدم انتهاء صلاحيته.

في حالة النجاح:

- إنشاء الشركة داخل قاعدة البيانات.
- حذف البيانات من Memory Cache.
- تفعيل الحساب.

---

## Memory Cache

يتم استخدام Memory Cache لتخزين بيانات التسجيل مؤقتًا مثل:

```text
Key
Email

Value
Company Registration Data
OTP
Expiration Time
```

مدة صلاحية البيانات:

- 5 دقائق

بعد انتهاء الوقت:

- يتم حذف البيانات تلقائيًا.

---

# Business Rules

- لا يسمح باستخدام بريد إلكتروني مسجل مسبقًا.
- OTP صالح لمدة 5 دقائق فقط.
- يتم حذف OTP بعد نجاح عملية التحقق.
- لا يتم إنشاء الشركة في قاعدة البيانات قبل التحقق من OTP.
- في حالة انتهاء صلاحية OTP يجب إرسال رمز جديد.
- كلمة المرور يتم تشفيرها قبل التخزين.

---

# Flow

```text
Open Register Page
        ↓
Enter Company Information
        ↓
Validate Input
        ↓
Generate OTP
        ↓
Store Data in Memory Cache
        ↓
Send OTP Email
        ↓
Open OTP Page
        ↓
Enter OTP
        ↓
Verify OTP
      ↙          ↘
 Invalid       Valid
    ↓             ↓
Error       Create Company
                  ↓
          Activate Account
                  ↓
              Login
```

---

# Register Page Fields

| Field | Required |
|--------|----------|
| Company Name | ✅ |
| Company Email | ✅ |
| Phone Number | ✅ |
| Password | ✅ |
| Confirm Password | ✅ |
| Commercial Registration | Optional |
| Company Address | Optional |

---

# OTP Page

## Inputs

- Email
- OTP Code

## Actions

- Verify OTP
- Resend OTP

---

# Validation

## Email

- Required
- Valid Email Format
- Must Be Unique

## Password

- Minimum 8 Characters
- Contains Uppercase Letter
- Contains Lowercase Letter
- Contains Number
- Contains Special Character

## Phone

- Required
- Valid Phone Format

## OTP

- Required
- 6 Digits
- Expires After 5 Minutes

---

# API Endpoints

## Register Company

```http
POST /api/auth/register-company
```

## Verify OTP

```http
POST /api/auth/verify-otp
```

## Resend OTP

```http
POST /api/auth/resend-otp
```

---

# Demo Scenario

1. Company Owner opens the Register page.
2. Fills in company information.
3. Clicks **Register**.
4. System validates the data.
5. OTP is generated and stored in Memory Cache.
6. OTP is sent to the company email.
7. User enters the OTP.
8. System verifies the OTP.
9. Company account is created.
10. User can log in successfully.
