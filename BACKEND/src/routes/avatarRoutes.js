const express = require("express");
const avatarController = require("../controllers/avatarController");
const middlewareAvatar = require("../middlewares/middlewareAvatar");
const router = express.Router();

router.post(
  "/upload/:user_id",
  middlewareAvatar.single("avatar"),
  avatarController.handleUploadAvatar,
);
router.get("/", avatarController.handleGetAllAvatars);
router.get("/:user_id", avatarController.handleGetAvatarByUserId);
router.put("/:user_id", middlewareAvatar.single("avatar"), avatarController.handleUpdateAvatar);
router.delete("/:user_id", avatarController.handleDeleteAvatar);

module.exports = router;
