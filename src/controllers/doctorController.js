import doctorService from '../services/doctorService';

const getTopDoctorHome = async (req, res) => {
  // let limit = 10
  let limit = req.query.limit;
  if (!limit) limit = 5;
  // console.log(limit)
  try {
    const response = await doctorService.getTopDoctorHome(+limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from server!!!'
    });
  }
};

const getAllDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.getAllDoctor();
    // console.log(doctor)
    return res.status(200).json(doctor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const postInforDoctor = async (req, res) => {
  try {
    const response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getDetailDoctor = async (req, res) => {
  try {
    const infor = await doctorService.getDetailDoctor(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const bulkCreateSchedule = async (req, res) => {
  try {
    const infor = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getScheduleByDate = async (req, res) => {
  try {
    const infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getExtraInforDoctor = async (req, res) => {
  try {
    const infor = await doctorService.getExtraInforDoctor(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getInforDoctor = async (req, res) => {
  try {
    const infor = await doctorService.getInforDoctor(req.query.doctorId);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const getDoctorBookingByDate = async (req, res) => {
  try {
    const infor = await doctorService.getDoctorBookingByDate(req.query.doctorId, req.query.date);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const sendRemedy = async (req, res) => {
  try {
    const infor = await doctorService.sendRemedy(req.body);
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
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  postInforDoctor: postInforDoctor,
  getDetailDoctor: getDetailDoctor,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleByDate: getScheduleByDate,
  getExtraInforDoctor: getExtraInforDoctor,
  getInforDoctor: getInforDoctor,
  getDoctorBookingByDate: getDoctorBookingByDate,
  sendRemedy: sendRemedy
};
