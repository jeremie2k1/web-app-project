/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-async-promise-executor */
import bcrypt from 'bcryptjs';
import db from '../models/index';
const salt = bcrypt.genSaltSync(10);

const createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashPasswordFromBcryot = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBcryot,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        gender: data.gender === '1' ? true : false,
        roleId: data.roleId,
        phonenumber: data.phonenumber
      });
      resolve('Create a new user succeed');
    } catch (e) {
      reject(e);
    }
  });
};

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

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = db.User.findAll({
        raw: true
      });
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

const getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId },
        raw: true
      });

      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: data.id }
      });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;

        await user.save();

        const allUsers = await db.User.findAll();
        resolve(allUsers);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({
        where: { id: userId }
      });
      if (user) {
        await user.destroy();
        resolve();
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createNewUser: createNewUser,
  getAllUser: getAllUser,
  // hashUserPassword: hashUserPassword,
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById
  // deleteUserData: deleteUserData
};
