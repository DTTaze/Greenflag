const express = require("express");
const middlewareImage = require("../middlewares/middlewareImage.js");
const imageController = require("../controllers/imageController.js");

const router = express.Router();

router.post("/upload", middlewareImage.array("images", 5), imageController.handleUploadImage);

router.get("/", imageController.handleGetAllImages);
router.get("/:id", imageController.handleGetImageById);
router.put("/:id", middlewareImage.single("image"), imageController.handleUpdateImage);
router.delete("/:id", middlewareImage.single("image"), imageController.handleDeleteImage);
module.exports = router;
