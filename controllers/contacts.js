const mongodb = require("../db/connect");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res, next) => {
  console.log("getAll running");
  const result = await mongodb.getDb().db().collection("contacts").find();
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  });
};

const getSingle = async (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  const result = await mongodb
    .getDb()
    .db()
    .collection("contacts")
    .find({ _id: userId });
  result.toArray().then((lists) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists[0]);
  });
};

const newContact = async (req, res, next) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  const response = await mongodb
    .getDb()
    .db()
    .collection("contacts")
    .insertOne(contact);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res
      .status(500)
      .json(
        response.error || "Some error occurred while creating the contact."
      );
  }
};

const updateContact = async (req, res) => {
  const contactId = req.params.id;

  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection("contacts")
      .updateOne(
        { _id: new ObjectId(contactId) },
        {
          $set: {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            favoriteColor: req.body.favoriteColor,
            birthday: req.body.birthday,
          },
        }
      );
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Contact updated successfully" });
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    console.error("Error updating contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  try {
    const result = await mongodb
      .getDb()
      .db()
      .collection("contacts")
      .deleteOne({ _id: new ObjectId(contactId) });
    if (result.deletedCount > 0) {
      res.status(200).json({ message: "Contact deleted successfully" });
    } else {
      res.status(404).json({ error: "Contact not found" });
    }
  } catch (error) {
    console.error("Error deleting contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getAll,
  getSingle,
  newContact,
  updateContact,
  deleteContact,
};
