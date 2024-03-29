/* eslint-disable no-async-promise-executor */
import db from '../models/index';
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config();

const buildURLverification = (doctorId, token) => {
  const result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

const postBookingAppoiment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.date || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        });
      } else {
        // console.log(data)
        const token = uuidv4();
        await emailService.sendMail({
          name: data.name,
          email: data.email,
          date: data.date,
          language: data.language,
          dataTime: data.dataTime,
          lastName: data.lastName,
          firstName: data.firstName,
          verificationLink: buildURLverification(data.doctorId, token)
        });
        const user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: 'R3',
            firstName: data.name,
            gender: data.gender,
            address: data.address,
            phonenumber: data.phone
          },
          raw: true
        });

        // console.log(user[0])
        if (user && user[0]) {
          await db.Booking.findOrCreate({
            where: {
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType
            },
            defaults: {
              statusId: 'S1',
              doctorId: data.doctorId,
              patientId: user[0].id,
              date: data.date,
              timeType: data.timeType,
              token
            }
          });
        }
      }

      resolve({
        errCode: 0,
        errMessage: 'Save infor doctor succeed'
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const postVerifyBookingAppoiment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data.token, data.doctorId);
      if (!data.token || !data.doctorId) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        });
      } else {
        const appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            token: data.token,
            statusId: 'S1'
          },
          raw: false
        });

        if (appointment) {
          appointment.statusId = 'S2';
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: 'Update the appoinment succeed!'
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: 'Appoinmnet has been activated or does not exist'
          });
        }
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  postBookingAppoiment: postBookingAppoiment,
  postVerifyBookingAppoiment: postVerifyBookingAppoiment
};
