import db from '../models/index';
require('dotenv').config()

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.imageBase64 || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: data.name,
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

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
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
                errMessage: 'get all specialty successful',
                data
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = {}
                if (location === 'ALL') {
                    data = await db.Specialty.findOne({
                        where: {
                            id: inputId,
                        },
                        attributes: ['name', 'descriptionHTML', 'descriptionMarkdown'],
                        include: [
                            { model: db.Doctor_Infor, attributes: ['doctorId', 'provinceId'] }
                        ],
                    })

                }
                else {
                    data = await db.Specialty.findOne({
                        where: {
                            id: inputId,
                        },
                        attributes: ['descriptionHTML', 'descriptionMarkdown'],
                        include: [
                            {
                                model: db.Doctor_Infor,
                                attributes: ['doctorId', 'provinceId'],
                                where: { provinceId: location },

                            }
                        ],
                    })

                }
                resolve({
                    errCode: 0,
                    data,
                    //doctorSpecialty
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

module.exports = {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}