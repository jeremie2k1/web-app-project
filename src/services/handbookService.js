/* eslint-disable n/no-deprecated-api */
/* eslint-disable no-async-promise-executor */
import db from '../models/index';
require('dotenv').config();

const createNewHandBook = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.title || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
        resolve({
          errCode: 1,
          errMessage: 'Missing parameter'
        });
      } else {
        await db.HandBook.create({
          title: data.title,
          image: data.imageBase64,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown
        });
      }
      resolve({
        errCode: 0,
        errMessage: 'Create success'
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllHandBook = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.HandBook.findAll({
        raw: true
      });
      if (data && data.length > 0) {
        data = data.map((item) => {
          item.image = Buffer.from(item.image, 'base64').toString('binary');
          return item;
        });
      }
      resolve({
        errCode: 0,
        message: 'get handbook successfully',
        data
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

const getHandBookById = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: -1,
          errMessage: 'Missing required parameter'
        });
      } else {
        const data = await db.HandBook.findOne({
          where: { id },
          attributes: ['title', 'descriptionHTML', 'descriptionMarkdown', 'image']
          // raw: true
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, 'base64').toString('binary');
        }
        resolve({
          errCode: 0,
          data
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  createNewHandBook: createNewHandBook,
  getAllHandBook: getAllHandBook,
  getHandBookById: getHandBookById
};
