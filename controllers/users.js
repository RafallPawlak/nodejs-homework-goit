const { User, hashPassword } = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const sgMail = require('@sendgrid/mail');

const createUser = async (email, password, avatarURL) => {
  const hashedPassword = hashPassword(password);
  try {
    const user = new User({ email, password: hashedPassword, avatarURL, verify: false,
      verificationToken: uuidv4()
    });
    sendVerificationEmail(user.verificationToken);
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

const verificationUser = async (verificationToken) => {
  const user = await User.findOneAndUpdate(
    { verificationToken },
    { verify: true, verificationToken: null }
  );
  return user;
};

const sendVerificationEmail = async (verificationToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: 'example@example.pl',
    from: 'rafall.pawlak@gmail.com',
    subject: 'Verification email',
    text: 'Node.js',
    html: `<strong>This is your verification mail. Please click on the link and verify your acount <a href="http://localhost:3000/api/users/verify/${verificationToken}">LINK</a> </strong>`,
  }
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
};

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
  verificationUser,
  sendVerificationEmail,
  logIn,
  logOut
};
