const {
  registerUser,
  loginUser,
  getUserById
} = require("./auth.service");

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required"
      });
    }

    const result =
      await registerUser({
        name,
        email,
        password
      });

    return res.status(201).json({
      success: true,
      message:
        "User registered successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

const login = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required"
      });
    }

    const result =
      await loginUser({
        email,
        password
      });

    return res.status(200).json({
      success: true,
      message:
        "Login successful",
      data: result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

/*
|--------------------------------------------------------------------------
| Current User
|--------------------------------------------------------------------------
*/

const getMe = async (req, res) => {
  try {
    const user =
      await getUserById(req.user.id);

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};
