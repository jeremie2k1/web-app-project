import handbookService from '../services/handbookService';

const createNewHandBook = async (req, res) => {
  try {
    const infor = await handbookService.createNewHandBook(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getAllHandBook = async (req, res) => {
  try {
    const infor = await handbookService.getAllHandBook();
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from sever'
    });
  }
};

const getHandBookById = async (req, res) => {
  try {
    const infor = await handbookService.getHandBookById(req.query.id);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from sever'
    });
  }
};

module.exports = {
  createNewHandBook: createNewHandBook,
  getAllHandBook: getAllHandBook,
  getHandBookById: getHandBookById
};
