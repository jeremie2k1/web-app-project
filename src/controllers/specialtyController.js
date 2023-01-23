import specialtyService from '../services/specialtyService';

const createNewSpecialty = async (req, res) => {
  try {
    const infor = await specialtyService.createNewSpecialty(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getAllSpecialty = async (req, res) => {
  try {
    const infor = await specialtyService.getAllSpecialty();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getDetailSpecialtyById = async (req, res) => {
  try {
    const infor = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
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
  createNewSpecialty: createNewSpecialty,
  getAllSpecialty: getAllSpecialty,
  getDetailSpecialtyById: getDetailSpecialtyById
};
