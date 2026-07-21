const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const contractModel = require("../models/contract.model");
const bookingModel = require("../models/booking.model");

const generateContractPDF = async (contractId) => {

  const contract = await contractModel.findById(contractId)
    .populate({
      path: "bookingId",
      populate: [
        { path: "assetId" },
        { path: "companyId" },
        { path: "ownerCompanyId" }
      ]
    });

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (contract.status !== "Approved") {
    throw new Error("Contract must be approved before generating PDF");
  }

  const latestContract = await contractModel
    .findOne({ bookingId: contract.bookingId._id })
    .sort({ version: -1 });

  if (latestContract._id.toString() !== contract._id.toString()) {
    throw new Error("PDF can only be generated for the latest contract version");
  }

  const uploadPath = path.join(__dirname, "../uploads/contracts");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const fileName = `contract-${contract._id}-v${contract.version}.pdf`;

  const filePath = path.join(uploadPath, fileName);

  const doc = new PDFDocument();

  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text("Rental Contract", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(12).text(`Contract ID: ${contract._id}`);
  doc.text(`Version: ${contract.version}`);

  doc.moveDown();

  // Company Information
  doc.fontSize(16).text("Company Information");

  doc.fontSize(12).text(
    `Renter Company: ${contract.bookingId.companyId.companyName}`
  );

  doc.text(
    `Owner Company: ${contract.bookingId.ownerCompanyId.companyName}`
  );

  doc.moveDown();

  // Asset Information
  doc.fontSize(16).text("Asset Information");

  doc.fontSize(12).text(
    `Asset Name: ${contract.bookingId.assetId.assetName}`
  );

  doc.text(
    `Asset Code: ${contract.bookingId.assetId.assetCode}`
  );

  doc.moveDown();

  // Rental Details
  doc.fontSize(16).text("Rental Details");

  doc.fontSize(12).text(
    `Start Date: ${contract.bookingId.startDate}`
  );

  doc.text(
    `End Date: ${contract.bookingId.endDate}`
  );

  doc.text(
    `Total Price: ${contract.bookingId.totalPrice}`
  );

  doc.moveDown();

  // Terms & Conditions
  doc.fontSize(16).text("Terms & Conditions");

  doc.fontSize(12).text(
    "1. The renter is responsible for using the asset properly."
  );

  doc.text(
    "2. Any damage caused during the rental period is the renter's responsibility."
  );

  doc.text(
    "3. The asset must be returned on the agreed end date."
  );

  doc.moveDown();

  // Signature Section
  doc.fontSize(16).text("Signatures");

  doc.moveDown();

  doc.text("Owner Company Signature: ____________________");

  doc.moveDown();

  doc.text("Renter Company Signature: ____________________");

  doc.moveDown();

  // Footer
  doc.text("----------------------------------------", {
    align: "center",
  });

  doc.text("AssetLink Rental Platform", {
    align: "center",
  });

  // Finish PDF
  doc.end();

  // Save PDF path
  contract.pdfPath = filePath;
  await contract.save();

  // Return contract
  return contract;
};

const downloadContractPDF = async (contractId) => {

  const contract = await contractModel.findById(contractId);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (!contract.pdfPath) {
    throw new Error("PDF not generated yet");
  }

  return contract.pdfPath;
};

const viewContractPDF = async (contractId) => {

  const contract = await contractModel.findById(contractId);

  if (!contract) {
    throw new Error("Contract not found");
  }

  if (!contract.pdfPath) {
    throw new Error("PDF not generated yet");
  }

  return contract.pdfPath;
};

module.exports = {
  generateContractPDF,
  downloadContractPDF,
  viewContractPDF,
};