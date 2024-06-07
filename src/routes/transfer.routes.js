const { Router } = require("express");
const { authUser } = require("../middlewares/auth.middleware.js");
const {
	requestTransfer,
	getTransferRequestById,
	getAllTransferRequest,
	getSingleTransfer,
	processRequest,
	requestAwardTransfer,
	processAwardRequest,
} = require("../controllers/transfer.controller.js");
const router = Router();

// !! secured routes --------------------------------
router.route("/request/withdrawal").post(authUser, requestTransfer);
router.route("/request/award/withdrawal").post(authUser, requestAwardTransfer);
router.route("/get/withdrawal/request").get(authUser, getTransferRequestById);
router.route("/get/withdrawal/requests").get(authUser, getAllTransferRequest);
router.route("/get/withdrawal/request/single").get(authUser, getSingleTransfer);
router.route("/process/request").post(authUser, processRequest);
router.route("/process/award/request").post(authUser, processAwardRequest);

module.exports = router;
