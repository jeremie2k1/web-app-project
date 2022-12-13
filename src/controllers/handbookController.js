import handbookService from '../services/handbookService'

let createNewHandBook = async (req, res) => {
    try {
        let infor = await handbookService.createNewHandBook(req.body)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from sever'
        })
    }
}

let getAllHandBook = async (req, res) => {
    try {
        let infor = await handbookService.getAllHandBook()
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever'
        })
    }
}

let getHandBookById = async (req, res) => {
    try {
        let infor = await handbookService.getHandBookById(req.query.id)
        return res.status(200).json(infor)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from sever'
        })
    }
}

module.exports = {
    createNewHandBook,
    getAllHandBook,
    getHandBookById
}