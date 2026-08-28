const damageReportService = require("../services/damageReport.service");

const createDamageReport = async (req, res) => {
  try {
    const damageReport = await damageReportService.createDamageReport(req.body);
    return res.status(201).send(damageReport);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getDamageReportByBooking = async (req, res) => {
  try {
    const damageReport = await damageReportService.getDamageReportByBooking(
      req.params.bookingId
    );
    if (!damageReport) {
      return res.status(404).send("Damage report not found");
    }
    return res.status(200).send(damageReport);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getAllDamageReports = async (req, res) => {
  try {
    const damageReports = await damageReportService.getAllDamageReports();
    return res.status(200).send(damageReports);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const updateDamageReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const damageReport = await damageReportService.updateDamageReportStatus(
      req.params.id,
      status
    );
    if (!damageReport) {
      return res.status(404).send("Damage report not found");
    }
    return res.status(200).send(damageReport);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

module.exports = {
  createDamageReport,
  getDamageReportByBooking,
  getAllDamageReports,
  updateDamageReportStatus,
};