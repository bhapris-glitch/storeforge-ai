const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./auth.model");

/*
|--------------------------------------------------------------------------
| Generate JWT Token
|--------------------------------------------------------------------------
*/

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

const registerUser = async ({
  name,
  email,
  password
}) => {
  const existingUser = await User.findOne({
    email: email.toLowerCase()
  });

  if (existingUser) {
    throw new Error(
      "User already exists with this email"
    );
  }

  const hashedPassword =
    await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword
  });

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan
    },
    token
  };
};

/*
|--------------------------------------------------------------------------
| Login User
|--------------------------------------------------------------------------
*/

const loginUser = async ({
  email,
  password
}) => {
  const user = await User.findOne({
    email: email.toLowerCase()
  }).select("+password");

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error(
      "Invalid email or password"
    );
  }

  user.lastLogin = new Date();

  await user.save();

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan
    },
    token
  };
};

/*
|--------------------------------------------------------------------------
| Get User By ID
|--------------------------------------------------------------------------
*/

const getUserById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserById,
  generateToken
};
