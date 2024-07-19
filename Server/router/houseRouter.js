const router = require("express").Router();
const houseCtrl = require("../controllers/houseCtrl");
const auth = require("../middleware/auth");

router.get("/get-houses", houseCtrl.getHouse);
router.get("/get-detail/:id", houseCtrl.getDetail);
router.post("/", auth, houseCtrl.createHouse);
router.put("/change-state/:id/:state", auth, houseCtrl.changeStateHouse);
router.put("/:id", auth, houseCtrl.updateHouse);
router.delete("/:id", auth, houseCtrl.deleteHouse);

module.exports = router;
