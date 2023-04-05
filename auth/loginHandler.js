const bcrypt = require("bcrypt");

const { getUserByEmail } = require("../controllers/users");
const issueToken = require("./issueToken");

const loginHandler = async  ( email, incomingPassword) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found!")
  }
  const userPassword = user.password;
  const result = bcrypt.compareSync(incomingPassword, userPassword);
  if (result) {
    return issueToken(user);
  } else {
   throw new Error("Invalid credentials");
  }
};

module.exports = loginHandler;