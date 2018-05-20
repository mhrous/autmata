const { Router } = require("express");


const { addDfa,getDfa, getName } = require("../middlewares/dfa");



const router = Router();

router.post("/dfa",addDfa)
router.get("/dfa/:id",getDfa)
router.get("/dfaName",getName)

module.exports = router;
