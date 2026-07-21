const contractService = require("../services/contract.service");

const generateContractPDF = async (req, res) => {
  try {
    const contract = await contractService.generateContractPDF(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Contract PDF generated successfully",
      data: contract,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const downloadContractPDF = async (req, res) => {
  try {

    const filePath = await contractService.downloadContractPDF(
      req.params.id
    );

    return res.download(filePath);

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

const viewContractPDF = async (req, res) => {
  try {

    const filePath = await contractService.viewContractPDF(
      req.params.id
    );

    return res.sendFile(filePath);

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message,
    });

  }
};

module.exports = {
  generateContractPDF,
  downloadContractPDF,
  viewContractPDF,
};