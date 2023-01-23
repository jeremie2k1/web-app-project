import db from '../models/index';
import CRUDSercive from '../services/CRUDSercive';

const getHomePage = async (req, res) => {
  try {
    const data = await db.User.findAll();
    return res.render('homepage.ejs', {
      data: JSON.stringify(data)
    });
  } catch (e) {
    console.log(e);
  }
};

const getAboutPage = (req, res) => {
  return res.render('./test/about.ejs');
};

const getCRUD = (req, res) => {
  return res.render('crud.ejs');
};

const postCRUD = async (req, res) => {
  //   let message = await CRUDSercive.createNewUser(req.body);
  // console.log(message)
  return res.send('post crud from sever');
};

const displayGetCRUD = async (req, res) => {
  const data = await CRUDSercive.getAllUser();
  return res.render('displayCRUD.ejs', {
    dataTable: data
  });
};

const getEditCrud = async (req, res) => {
  // console.log(req.query.id)
  const userId = req.query.id;
  if (userId) {
    const userData = await CRUDSercive.getUserInfoById(userId);
    // check user data not found
    return res.render('editCRUD.ejs', {
      user: userData
    });
  } else {
    return res.send('User not found');
  }
};

const putCRUD = async (req, res) => {
  const data = req.body;
  // console.log(data)
  const allUsers = await CRUDSercive.updateUserData(data);
  return res.render('displayCRUD.ejs', {
    dataTable: allUsers
  });
};

const deleteCRUD = async (req, res) => {
  console.log(req.query.id);
  const id = req.query.id;
  if (id) {
    await CRUDSercive.deleteUserById(id);
    return res.send('Delete done');
  } else {
    return res.send('User not found');
  }
};
// Object: {
//     key:'',
//     value: ''
// }
module.exports = {
  getHomePage: getHomePage,
  getAboutPage: getAboutPage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCrud: getEditCrud,
  putCRUD: putCRUD,
  // getDeleteCrud : getDeleteCrud,
  deleteCRUD: deleteCRUD
};
