const Contact  = require("../models/contact");

const listContacts = async () => {
 return await Contact.find();
};

const getContactById = async (_id) => {
  return await Contact.findOne({ _id });
};

const removeContact = async (_id) => {
   try {
    return Contact.findByIdAndDelete({ _id });
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (body) => {
    const contact = new Contact({ ...body });
    contact.save();
    return contact;
}

const updateContact = async (_id, body) => {
  const updateContact = await Contact.findByIdAndUpdate(_id, body);
  return updateContact;
};

const updateFavorite = async (_id, body) => {
  const updateFavorite = await Contact.findByIdAndUpdate(_id, body);
   updateFavorite.favorite = body;
  return getContactById(_id);
};


module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateFavorite
}
