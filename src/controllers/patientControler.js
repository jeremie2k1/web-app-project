import patientService from '../services/patientService';

const postBookingAppoiment = async (req, res) => {
  try {
    const infor = await patientService.postBookingAppoiment(req.body);
    return res.status(200).json(infor);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      message: 'Error from sever'
    });
  }
};

const postVerifyBookingAppoiment = async (req, res) => {
  try {
    const infor = await patientService.postVerifyBookingAppoiment(req.body);
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
  postBookingAppoiment: postBookingAppoiment,
  postVerifyBookingAppoiment: postVerifyBookingAppoiment
};
