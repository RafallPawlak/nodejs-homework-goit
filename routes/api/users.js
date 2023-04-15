const express = require("express");
const {
  createUser,
  getUserByEmail,
  updateAvatar,
  getCurrentUser,
  logIn,
  logOut,
} = require("../../controllers/users");
const { userSchema } = require("../../models/user");
const auth = require("../../auth/auth");
const loginHandler = require("../../auth/loginHandler");
const gravatar = require('gravatar');
const multer = require("multer");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const storeAvatar = path.join(process.cwd(), "tmp");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storeAvatar);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: 1048576,
});

const upload = multer({ storage });

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
    const avatarURL = gravatar.url(email, {s: '100', r: 'x', d: 'retro'}, false);
    const newUser = await createUser(email, password, avatarURL);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/avatars", auth, upload.single("avatar"), async (req, res, next) => {
  try {
    const { email } = req.user;
    const { path: tempName, originalname } = req.file;
    const fileName = path.join(storeAvatar, originalname);
    await fs.rename(tempName, fileName);
    const img = await Jimp.read(fileName);
    await img.autocrop().cover(250, 250).quality(60).writeAsync(fileName);
    await fs.rename(fileName, path.join(process.cwd(), "public/avatars", originalname));
    const avatarURL = path.join(process.cwd(), "public/avatars", originalname);
    const cleanAvatarURL = avatarURL.replace(/\\/g, "/");
    const user = await updateAvatar(email, cleanAvatarURL);
    res.status(200).json(user);
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
  const url = gravatar.url('emerleite@gmail.com', { s: '200', r: 'pg', d: '404' });
  console.log(url);
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