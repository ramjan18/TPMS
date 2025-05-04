const router = require("express").Router();


const { upload } = require("../config/multer");
const {addStudent} = require('../controllers/admin/addStudent');
const { addTPO } = require("../controllers/admin/addTpo");
const {deleteStudent} = require('../controllers/admin/deleteStudent');
const { deleteTPO } = require("../controllers/admin/deleteTpo");
const {getAllStudents} = require("../controllers/admin/getAllStudents");
const { getAllTPOs } = require("../controllers/admin/getAllTpo");
const auth = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRoles');

router.post('/addStudent' ,auth,authorizeRole('admin','teacher'),upload.fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePic", maxCount: 1 }
]), addStudent);
router.post('/addTpo' ,upload.single("profilePic"), addTPO)
router.delete('/deleteStudent/:id' ,auth,authorizeRole('admin','teacher'), deleteStudent);
router.delete("/deleteTpo/:id",auth,authorizeRole('admin'), deleteTPO);
router.get('/getAllStudents' ,auth,authorizeRole('admin','teacher'), getAllStudents);
router.get("/getAllTpo",auth,authorizeRole('admin'), getAllTPOs);

module.exports = router 

