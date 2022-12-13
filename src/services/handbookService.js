import db from '../models/index';
require('dotenv').config()

let createNewHandBook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.HandBook.create({
                    title: data.title,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'Create success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllHandBook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.HandBook.findAll({
                raw: true,
            })
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                message: 'get handbook successfully',
                data
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getHandBookById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.HandBook.findOne({
                    where: { id: id },
                    attributes: ['title', 'descriptionHTML', 'descriptionMarkdown', 'image'],
                    //raw: true
                })
                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                resolve({
                    errCode: 0,
                    data
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

module.exports = {
    createNewHandBook,
    getAllHandBook,
    getHandBookById
}