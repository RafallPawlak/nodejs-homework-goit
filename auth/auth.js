const jwt = require("jsonwebtoken");
const { getUserById } = require("../controllers/users");

const jwtSecret = process.env.JWT_SECRET;

const auth = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("No token provided");
  }
  try {
    req.user = jwt.verify(token, jwtSecret);
    const id = req.user.id;
    const user = await getUserById(id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
      next();
    }
   catch {
    return res.status(401).json({ message: "Not authorized" });
  }
}

module.exports = auth;
