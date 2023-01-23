import clinicService from '../services/clinicService';

const createNewClinic = async (req, res) => {
  try {
    const infor = await clinicService.createNewClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getAllClinic = async (req, res) => {
  try {
    const infor = await clinicService.getAllClinic(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getDetailClinicById = async (req, res) => {
  try {
    const infor = await clinicService.getDetailClinicById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

module.exports = {
  createNewClinic: createNewClinic,
  getAllClinic: getAllClinic,
  getDetailClinicById: getDetailClinicById
};
