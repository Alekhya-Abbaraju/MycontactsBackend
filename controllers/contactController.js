//contactController.js
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

// GET /api/contacts
const getContacts = asyncHandler(async (req, res) => {
    console.log("in get contacts")
    const contacts = await Contact.find();
    res.status(200).json(contacts);
});

// GET /api/contacts/:id
const getContact = asyncHandler(async (req, res) => {
    console.log("In get contact");
    const id=req.params.id;
    const contact = await Contact.findById(id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

// PUT /api/contacts/:id
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission to update other user's contacts");
    }
    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body
    );
    res.status(200).json(updatedContact);
});

// POST /api/contacts
const createContact = asyncHandler(async (req, res) => {
    try{
        console.log("user",await req.user);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
        res.status(400);
        res.json({ error: "All fields are mandatory!" });
        return;
    }
    const userid=await req.user.id;
    const contact = await Contact.create({ name, email, phone, user_id:userid });
    res.status(201).json(contact);
}catch(error){
    res.status(500).json({error:error.message});
}
});

// DELETE /api/contacts/:id
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }
    if (contact.user_id.toString() !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission to delete other user's contacts");
    }
    await Contact.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: `Deleted contact ${req.params.id}` });
});

module.exports = { getContacts, getContact, updateContact, createContact, deleteContact };
