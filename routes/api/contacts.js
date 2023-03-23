const express = require('express')
const { listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact } = require('../../controllers/contacts');

const router = express.Router();

router.get("/", async (req, res, next) => {
  const response = await listContacts();
  return res.status(200).json(response);
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await getContactById(id);
    if (!response) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(response);
  } catch {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const contact = await addContact(req.body);
    console.log(contact);
    return res.status(201).json(contact);
  } catch {
    return res.status(500).json({"message": "Something went wrong"});
  }
})

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ "message": "Not found"});
  }
  try {
    await removeContact(id);
    return res.status(200).json({"message": "contact deleted"});
  } catch {
    return res.status(500).json({ "message": "Something went wrong" });
  }
})

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(404).json({ "message": "Not found" });
  }
try {
    const contactUpdate = await updateContact( id, req.body);
    return res.status(200).json(contactUpdate);
  } catch (error) {
    next(error);
    return res.status(500).json({ "message": "Something went wrong" });
  }
});

router.patch("/:id/favorite", async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(404).json({ "message": "Not found" });
  }
  try {
    if (typeof req.body.favorite !== "boolean") {
      return res.status(400).send({ "message": "missing field favorite" });
    }
    const favoritetUpdate = await updateContact( id, req.body);
    return res.status(200).json(favoritetUpdate);
  } catch (error) {
    next(error);
    return res.status(500).json({ "message": "Something went wrong" });
  }
});

module.exports = router
