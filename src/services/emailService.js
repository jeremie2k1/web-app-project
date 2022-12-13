require('dotenv').config()
import nodemailer from 'nodemailer'
import _ from 'lodash';
import moment from 'moment';
import localization from 'moment/locale/vi'


let contentMail = (data) => {
    let result = ''
    if (data.language === 'vi') {
        result = `
            <p>Xin chào, ${data.name}!</p>
            <p>Bạn đã đặt lịch khám bệnh thành công!</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Bác sĩ: ${data.lastName} ${data.firstName}</b></div>
            <div><b>Thời gian: ${buildTimeBooking(data)}</b></div>
            <p>Vui lòng xác click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
            <div>
            <a href=${data.verificationLink} target='_blank'>Click here</a>
            </div>

            <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (data.language === 'en') {
        result = `
            <p>Hello, ${data.name}!</p>
            <p>You have successfully booked a medical appointment!</p>
            <p>Information to book an appointment:</p>
            <div><b>Doctor: ${data.lastName} ${data.firstName}</b></div>
            <div><b>Time: ${buildTimeBooking(data)}</b></div>
            <p>Please click on the link below to confirm and complete the booking procedure</p>
            <div>
            <a href=${data.verificationLink} target='_blank'>Click here</a>
            </div>

            <div>Thank you very much!</div>
        `
    }
    if (data.language === 'ru') {
        result = `
            <p>Здравствуйте, ${data.name}!</p>
            <p>Вы успешно записались на прием к врачу!</p>
            <p>Информация для записи на прием:</p>
            <div><b>Врач: ${data.lastName} ${data.firstName}</b></div>
            <div><b>Время: ${buildTimeBooking(data)}</b></div>
            <p>Пожалуйста, нажмите на ссылку ниже, чтобы подтвердить и завершить процедуру бронирования</p>
            <div>
            <a href=${data.verificationLink} target='_blank'>Нажмите здесь</a>
            </div>

            <div>Большое спасибо!</div>
        `
    }
    return result
}

let buildTimeBooking = (data) => {
    let date = '', time = ''
    if (data.dataTime && !_.isEmpty(data.dataTime)) {

        if (data.language === 'vi') {
            date = moment.unix(+data.dataTime.date / 1000).format('dddd - DD/MM')
            time = data.dataTime.timeTypeData.valueVi
        }
        if (data.language === 'en') {
            date = moment.unix(+data.dataTime.date / 1000).locale('en').format('dd - DD/MM')
            time = data.dataTime.timeTypeData.valueEn
        }
        if (data.language === 'ru') {
            date = moment.unix(+data.dataTime.date / 1000).locale('ru').format('dd - DD/MM')
            time = data.dataTime.timeTypeData.valueRu
        }
    }
    time = `${time} - ${date}`
    return time
}

let sendMail = async (data) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.APP_GMAIL, // generated ethereal user
            pass: process.env.APP_GMAIL_PASSWORD, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"no-reply" <hoangk24aas@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: "Online Appointment Booking", // Subject line
        html: contentMail(data), // html body
    });
}

let sendAttachment = (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.APP_GMAIL, // generated ethereal user
                    pass: process.env.APP_GMAIL_PASSWORD, // generated ethereal password
                },
            });

            // send mail with defined transport object
            let info = await transporter.sendMail({
                from: '"no-reply" <hoangk24aas@gmail.com>', // sender address
                to: dataSend.email, // list of receivers
                subject: "Result of appointment booking", // Subject line
                html: contentMailRemedy(dataSend), // html body
                attachments: [
                    {
                        filename: `Remedy-${dataSend.namePatient}-doctor-${dataSend.lastNameDoctor}-${dataSend.firstNameDoctor}.png`,
                        content: dataSend.imageBase64.split('base64,')[1],
                        encoding: 'base64'
                    }
                ]
            });
            resolve({
                errCode: 0,
                errMessage: 'Send attachment successfully'
            })
        } catch (e) {
            console.log(e)
            reject(e)
        }
    })

}

let contentMailRemedy = (data) => {
    let result = ''
    if (data.language === 'vi') {
        result = `
            <p>Xin chào, ${data.namePatient}!</p>
            <p>Bạn nhận được email vì đã khám thành công!</p>
            <div><b>Bác sĩ: ${data.lastNameDoctor} ${data.firstNameDoctor}</b></div>
            <p>Thông tin đơn thuốc/hóa đơn được bác sĩ gửi trong file đính kèm</p>
            <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (data.language === 'en') {
        result = `
            <p>Hello, ${data.namePatient}!</p>
            <p>You received an email because your scan was successful!</p>
            <div><b>Doctor: ${data.lastNameDoctor} ${data.firstNameDoctor}</b></div>
            <p>Prescription/invoice information sent by the doctor in the attached file</p>
            <div>Thank you very much!</div>
        `
    }
    if (data.language === 'ru') {
        result = `
            <p>Здравствуйте, ${data.namePatient}!</p>
            <p>Вы получили электронное письмо, поскольку сканирование прошло успешно!</p>
            <div><b>Bác sĩ: ${data.lastNameDoctor} ${data.firstNameDoctor}</b></div>
            <p>Информация о рецепте/счете, отправленная врачом в прикрепленном файле</p>
            <div>Большое спасибо!</div>
        `
    }
    return result
}

module.exports = {
    sendMail,
    sendAttachment
}