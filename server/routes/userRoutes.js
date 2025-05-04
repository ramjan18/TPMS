const router = require('express').Router()

const { loginUser } = require("../controllers/user/login");
const { registerAdmin } = require("../controllers/user/signUp");
const {getStudentById} = require("../controllers/user/getStudentById");
const {getTPOById} = require("../controllers/user/getTpoById");
const { updateStudent } = require("../controllers/admin/editStudent");
const { updateTPO } = require("../controllers/admin/editTpo");
const auth = require('../middlewares/auth');

const { upload } = require("../config/multer");


router.post("/login", loginUser);
router.post("/signUp", registerAdmin);
router.get('/getStudent/:id',auth,getStudentById);
router.get('/getTpo/:id',auth ,getTPOById);
router.put('/editStudent/:id',auth , upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePic", maxCount: 1 }
]),updateStudent);
 router.put('/editTpo/:id',auth , updateTPO);

module.exports=router