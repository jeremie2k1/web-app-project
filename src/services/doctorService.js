
import db from '../models/index';
require('dotenv').config()
import _, { flatMap } from 'lodash'
import emailService from './emailService'

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE

let getTopDoctorHome = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                    {
                        model: db.Doctor_Infor, attributes: ['doctorId'],
                        include: [
                            { model: db.Specialty, attributes: ['name'] }
                        ]
                    }
                ],
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e)
        }
    })
}

let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi', 'valueRu'] }
                ],
                raw: true,
                nest: true
            })
            doctors.map((item, index) => {
                let nameVi = `${item.positionData.valueVi} ${item.lastName} ${item.firstName}`
                let nameEn = ''
                if (item.positionData.valueEn === 'None') {
                    nameEn = `Doctor ${item.lastName} ${item.firstName}`
                }
                else {
                    nameEn = `${item.positionData.valueEn} ${item.lastName} ${item.firstName}`
                }
                let nameRu = `${item.positionData.valueRu} ${item.lastName} ${item.firstName}`
                item.nameVi = nameVi
                item.nameEn = nameEn
                item.nameRu = nameRu
            })
            resolve({
                errCode: 0,
                data: doctors
            })
        } catch (e) {
            reject(e)
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arr = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice',
        'selectedPayment', 'selectedProvince', 'nameClinic', 'addressClinic', 'note', 'specialtyId', 'clinicId']
    let isValid = true
    let element = ''
    for (let i = 0; i < arr.length; i++) {
        if (!inputData[arr[i]]) {
            isValid = false
            element = arr[i]
            break
        }
    }
    return {
        isValid: isValid,
        element: element
    }
}

let saveDetailInforDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            let checkObj = checkRequiredFields(inputData)
            if (checkObj.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element}`
                })
            } else {
                if (inputData.action === 'CREATE') {
                    await db.MarkDown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctor = await db.MarkDown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false
                    })
                    if (doctor) {
                        doctor.contentHTML = inputData.contentHTML
                        doctor.contentMarkdown = inputData.contentMarkdown
                        doctor.description = inputData.description
                        // doctor.updateAt = new Date()
                        await doctor.save()
                    }
                }

                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,

                    },
                    raw: false
                })

                if (doctorInfor) {
                    doctorInfor.doctorId = inputData.doctorId
                    doctorInfor.priceId = inputData.selectedPrice
                    doctorInfor.provinceId = inputData.selectedProvince
                    doctorInfor.paymentId = inputData.selectedPayment
                    doctorInfor.nameClinic = inputData.nameClinic
                    doctorInfor.addressClinic = inputData.addressClinic
                    doctorInfor.note = inputData.note,
                        doctorInfor.specialtyId = inputData.specialtyId,
                        doctorInfor.clinicId = inputData.clinicId
                    await doctorInfor.save()
                }
                else {
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }
            }
            resolve({
                errCode: 0,
                errMessage: 'Save infor doctor succeed'
            })
        }

        catch (e) {
            reject(e)
        }
    })
}

let getDetailDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.MarkDown, attributes: ['description', 'contentHTML', 'contentMarkdown'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId', 'count']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi', 'valueRu'] }
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter!'
                })
            } else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE
                        return item
                    })
                }
                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date
                })

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate)
                }

                //await db.Schedule.bulkCreate(schedule)
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getExtraInforDoctor = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Doctor_Infor.findOne({
                    where: { doctorId: doctorId },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                    ],
                    raw: false,
                    nest: true
                })

                if (!data) data = []
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getInforDoctor = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        { model: db.MarkDown, attributes: ['description'] },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ['id', 'doctorId', 'count']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi', 'valueRu'] }
                            ],
                        },
                    ],
                    raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary')
                }
                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getDoctorBookingByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        statusId: 'S2'
                    },
                    include: [
                        {
                            model: db.User, attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [
                                { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi', 'valueRu'] },
                            ],
                        },
                        {
                            model: db.Allcode, as: 'timeData', attributes: ['valueVi', 'valueEn', 'valueRu']
                        }
                    ],
                    raw: false,
                    nest: true
                })
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

let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.date || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        date: data.date,
                        timeType: data.timeType,
                        statusId: 'S2'
                    },
                    raw: false
                })
                if (appointment) {
                    appointment.statusId = 'S3'
                    await appointment.save()
                }

                await emailService.sendAttachment(data)

                resolve({
                    errCode: 0,
                    errMessage: 'Send remedy successfully'
                })
            }
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })
}

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctor: getAllDoctor,
    saveDetailInforDoctor: saveDetailInforDoctor,
    getDetailDoctor: getDetailDoctor,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctor: getExtraInforDoctor,
    getInforDoctor: getInforDoctor,
    getDoctorBookingByDate: getDoctorBookingByDate,
    sendRemedy: sendRemedy
}