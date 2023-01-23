import userService from '../services/userSercive';

const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  // console.log(email)

  if (!email || !password) {
    return res.status(500).json({
      errCode: 1,
      message: 'Missing inputs parameter'
    });
  }

  const userData = await userService.handleUserLogin(email, password);

  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? userData.user : {}
    // userData
  });
};

const handleGetAllUsers = async (req, res) => {
  const id = req.query.id; // All, id
  // console.log(id);
  if (!id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Missing required parameters',
      users: []
    });
  }
  // console.log(id)
  const users = await userService.getAllUsers(id);
  // console.log(users)
  return res.status(200).json({
    errCode: 0,
    errMessage: 'OK',
    users
  });
};

const handleCreateNewUser = async (req, res) => {
  const message = await userService.createNewUser(req.body);
  console.log(message);
  return res.status(200).json(message);
};

const handleDeleteUser = async (req, res) => {
  if (!req.body.id) {
    return res.status(200).json({
      errCode: 1,
      errMessage: 'Missing required parameters!'
    });
  }
  const message = await userService.deleteUser(req.body.id);
  console.log(message);
  return res.status(200).json(message);
};

const handleEditUser = async (req, res) => {
  const data = req.body;
  // console.log(data)
  const message = await userService.updateUserData(data);
  return res.status(200).json(message);
};

const getAllCode = async (req, res) => {
  try {
    const data = await userService.getAllCodeService(req.query.type);
    // console.log(data)
    return res.status(200).json(data);
  } catch (e) {
    console.log('Get all code error: ', e);
    return res.status(200).json({
      errCode: -1,
      errMessage: 'Error from sever'
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
  handleGetAllUsers: handleGetAllUsers,
  handleCreateNewUser: handleCreateNewUser,
  handleEditUser: handleEditUser,
  handleDeleteUser: handleDeleteUser,
  getAllCode: getAllCode
};
