const router = require("express").Router();
const areaCtrl = require("../controllers/areaCtrl");

router.get("/get-provinces", areaCtrl.getProvince);
router.get("/get-districts/:provinceId", areaCtrl.getDistrict);
router.get("/get-wards/:districtId", areaCtrl.getWard);

module.exports = router;
