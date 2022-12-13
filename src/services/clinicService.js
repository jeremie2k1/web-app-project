import db from '../models/index';
require('dotenv').config()

let createNewClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.address || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: data.name,
                    address: data.address,
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
            console.log(e)
            reject(e)
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                raw: true,
                // attributes: {
                //     exclude: ['image']
                // },
            })
            if (data && data.length > 0) {
                data = data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary')
                    return item
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'get all clinic successful',
                data
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getDetailClinicById = async (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = {}
                data = await db.Clinic.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: ['name', 'descriptionHTML', 'descriptionMarkdown'],
                    include: [
                        { model: db.Doctor_Infor, attributes: ['doctorId'] }
                    ],
                })
                resolve({
                    errCode: 0,
                    data,
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}
module.exports = {
    createNewClinic,
    getAllClinic,
    getDetailClinicById
}