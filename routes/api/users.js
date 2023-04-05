const express = require("express");
const {
  createUser,
  getUserByEmail,
  getCurrentUser,
  logIn,
  logOut,
} = require("../../controllers/users");
const { userSchema } = require("../../models/user");
const auth = require("../../auth/auth");
const loginHandler = require("../../auth/loginHandler");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
 try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }
    const newUser = await createUser(email, password);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res, next) => {
  const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
  }
  try {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
    const token = await loginHandler(email, password);
    await logIn(email, token);
    res.status(200).json( token );
  } catch (error) {
    next(error);
    return res.status(401).json({ message: "Email or password is wrong" });
  }
});

router.post("/logout", auth, async (req, res, next) => {
  const id = req.user.id;
  try {
  const user = await logOut(id);
    if (!user) {
      return res.status(400).json({ message: "Not authorized" });
    }
    return res.status(204).json({ message: "Sucess logout" });
  } catch {
    return res.status(401).json({ message: "Not authorized" });
  }
});

router.get("/current", auth, async (req, res) => {
  const id = req.user.id;
  try {
    const user = await getCurrentUser(id);
    if (!user) {
      return res.status(400).json({ message: "Not authorized" });
    }
    res.status(200).json(user);
  } catch {
    return res.status(500).send("Something went wrong");
  }
});

module.exports = router;