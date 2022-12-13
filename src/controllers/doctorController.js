import doctorService from '../services/doctorService'

let getTopDoctorHome = async (req, res) => {
    //let limit = 10
    let limit = req.query.limit
    if (!limit) limit = 10
    //console.log(limit)
    try {
        let response = await doctorService.getTopDoctorHome(+limit)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server!!!'
        })
    }
}

let getAllDoctor = async (req, res) => {
    try {

        let doctor = await doctorService.getAllDoctor()
        //console.log(doctor)
        return res.status(200).json(doctor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let postInforDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveDetailInforDoctor(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getDetailDoctor(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let infor = await doctorService.bulkCreateSchedule(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let getScheduleByDate = async (req, res) => {
    try {
        let infor = await doctorService.getScheduleByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let getExtraInforDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctor(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}


let getInforDoctor = async (req, res) => {
    try {
        let infor = await doctorService.getInforDoctor(req.query.doctorId)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let getDoctorBookingByDate = async (req, res) => {
    try {
        let infor = await doctorService.getDoctorBookingByDate(req.query.doctorId, req.query.date)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let infor = await doctorService.sendRemedy(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}
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
}