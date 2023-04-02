const { User, hashPassword } = require("../models/user");

const createUser = async (email, password) => {
  const hashedPassword = hashPassword(password);
  try {
    const user = new User({ email, password: hashedPassword });
    user.save();
    return user;
  } catch (error) {
    throw Error("Error");
  }
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
}

const getCurrentUser = async (_id) => {
  const user = await User.findOne({ _id });
  const currentUser = {
    email: user.email,
    subscription:  user.subscription
  }
  return currentUser;
}

const logIn = async (email, token) => {
  const user = await User.findOneAndUpdate({ email }, { token: token });
  return user;
};

const logOut = async (_id) => {
  const user = await User.findByIdAndUpdate({ _id }, { token: null });
  return user;
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  getCurrentUser,
  logIn,
  logOut
};
