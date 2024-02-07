const express = require('express');
const router = express.Router();

const contactsController = require('../controllers/contacts');

router.get('/contacts', contactsController.getAll);

router.get('/getSingle/:id', contactsController.getSingle);

router.post('/newContact', contactsController.newContact);

router.put('/updateContact/:id', contactsController.updateContact);

router.delete('/deleteContact/:id', contactsController.deleteContact);

module.exports = router;