//contactRoutes.js
const express=require("express");
const router=express.Router();
const {getContacts,createContact,getContact,updateContact,deleteContact}=require("../controllers/contactController");
const validateToken=require("../middleware/validateTokenHandler");
//router.use(validateToken);
router.route("/:id").delete(validateToken,deleteContact).put(validateToken,updateContact).get(validateToken,getContact);
router.route("/").get(validateToken,getContacts).post(validateToken,createContact);


module.exports=router;