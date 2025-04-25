const router = require("express").Router();

const { registerCompany } = require("../controllers/company/addCompany");
const { deleteCompany } = require("../controllers/company/deleteCompany");
const {updateCompany} = require("../controllers/company/editCompany");
const { getCompanies } = require("../controllers/company/getAllCompanies");
const {getCompanyById} = require ("../controllers/company/getCompanyById");

const auth = require('../middlewares/auth');
const authorizeRole = require('../middlewares/authorizeRoles');

router.post("/addCompany", registerCompany);
 router.delete("/deleteCompany/:id",auth,authorizeRole('admin', 'company'), deleteCompany);
 router.put("/editCompany/:id",auth,authorizeRole('admin', 'company'), updateCompany);
router.get("/getAllCompanies",auth, getCompanies);
router.get("/getCompanyById/:id",auth, getCompanyById);

// =========================================== vacancy routes ===============================================

 const { applyForVacancy } = require("../controllers/vacancy/applyToVacancy");
const { deleteVacancy } = require("../controllers/vacancy/deleteVacancy");
const { getAllVacancies } = require("../controllers/vacancy/getAllVacancies");
const { getVacancyById } = require("../controllers/vacancy/getVacancyById");
const { createVacancy } = require("../controllers/vacancy/postVacancy");
const {updateStudentStatusInVacancy} = require('../controllers/vacancy/updateStatus');
const {getVacanciesByCompany} = require('../controllers/vacancy/getVacancyByCompany');


router.post("/postVacancy" ,auth,authorizeRole('admin', 'company'), createVacancy);
router.post("/applyToVacancy/:id",auth,authorizeRole('student'), applyForVacancy);
router.get("/getAllVacancies",auth, getAllVacancies);
router.get("/getVacancy/:id",auth, getVacancyById);
router.delete("/deleteVacancy/:id",auth,authorizeRole('admin', 'company'), deleteVacancy);
router.put("/updateStatus", updateStudentStatusInVacancy);
router.get("/getVacancyByCompany/:id", auth, getVacanciesByCompany);

module.exports = router;
