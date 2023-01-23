/* eslint-disable no-async-promise-executor */
import db from '../models/index';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};

      const isExist = await checkUserEmail(email);
      if (isExist) {
        // user already exist
        const user = await db.User.findOne({
          where: { email },
          attributes: ['id', 'email', 'roleId', 'password', 'firstName', 'lastName'],
          raw: true
        });
        if (user) {
          // compare password
          const check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = 'Login successful';
            // console.log(user)
            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = 'Wrong password';
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User's not found";
        }
      } else {
        // return error
        userData.errCode = 1;
        userData.errMessage = 'Your email in not exist. Please try other email';
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

// check email cua nguoi dung da ton tai trong he thong hay chua
const checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { email: userEmail }
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = '';
      if (userId === 'ALL') {
        users = await db.User.findAll({
          attributes: {
            exclude: ['password']
          },
          raw: true
        });
      }
      if (userId && userId !== 'ALL') {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ['password']
          }
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: 'Email is already in used, try another email!'
        });
      } else {
        const hashPasswordFromBcryot = await hashUserPassword(data.password);
        await db.User.create({
          email: data.email,
          password: hashPasswordFromBcryot,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          gender: data.gender,
          roleId: data.roleId,
          phonenumber: data.phonenumber,
          positionId: data.positionId,
          image: data.avatar
          // image: data.image
        });
        resolve({
          errCode: 0,
          message: 'OK'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId }
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: 'User is not exist'
        });
      } else {
        await db.User.destroy({
          where: { id: userId }
        });
        resolve({
          errCode: 0,
          message: 'The user is deleted'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          message: 'Missing required parameters'
        });
      }
      const user = await db.User.findOne({
        where: { id: data.id },
        raw: false
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.roleId = data.roleId;
        user.positionId = data.positionId;
        user.gender = data.gender;
        user.phonenumber = data.phonenumber;
        user.image = data.avatar;
      }
      await user.save();
      resolve({
        errCode: 0,
        message: "Update user's data successfully!"
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters '
        });
      } else {
        const res = {};
        const allcode = await db.Allcode.findAll({
          where: { type: typeInput }
        });
        res.errCode = 0;
        res.data = allcode;
        // console.log(res)
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin: handleUserLogin,
  getAllUsers: getAllUsers,
  createNewUser: createNewUser,
  deleteUser: deleteUser,
  updateUserData: updateUserData,
  getAllCodeService: getAllCodeService
};
