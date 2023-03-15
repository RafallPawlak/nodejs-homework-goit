const fs = require("fs").promises;
const Joi = require("joi");

const listContacts = async () => {
  const data = await fs.readFile("./models/contacts.json");
  const contacts = JSON.parse(data);
  return contacts;
}

const getContactById = async (id) => {
  const contacts = await listContacts();
  const contactById = contacts.find(
    (contactId) => contactId.id === id);
  return contactById;
};

const removeContact = async (id) => {
  const contacts = await listContacts();
  const removeById = contacts.findIndex((contactId) => contactId.id === id);
  contacts.splice(removeById, 1);
  if (removeById === -1) {
    return null;
  }
  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const contact = { id: `${contacts.length + 2}`, ...body };
  contacts.push(contact);
  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
  return contact;
}

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const contactId = contacts.findIndex((contactId) => contactId.id === id);
  if (contactId === -1) {
    return null;
  }
  contacts[contactId] = { ...contacts[contactId], ...body };
  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
  return contacts[contactId];
}

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required()
});


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  contactSchema
}
