const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");
const db = require("../models/index.js");
const cloudinary = require("../config/cloudinary.js");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AppError = require("../errors/AppError");

const Video = db.Video;

const createVideo = async ({ title, url, filename, user_id }) => {
  try {
    user_id = Number(user_id);

    if (!title || !url || !filename || user_id === undefined) {
      throw new BadRequestError("Title, URL, filename, and user_id are required");
    }
    if (typeof user_id !== "number" || user_id <= 0) {
      throw new BadRequestError("Invalid user_id");
    }

    console.log("Saving video to the database...");
    const video = await Video.create({ title, url, filename, user_id });
    console.log("Video saved successfully.");

    return video;
  } catch (e) {
    if (e.statusCode) throw e;
    console.error("Error saving video:", e);
    throw new AppError("Failed to create video", 500);
  }
};

const uploadAndCompressVideo = async (file, title, user_id) => {
  console.log("uploadAndCompressVideo", file, title, user_id);

  const uploadsDir = path.join(__dirname, "../uploads");
  const compressedDir = path.join(uploadsDir, "compressed_videos");
  const localDir = path.join(uploadsDir, "temp_videos");
  const ext = path.extname(file.filename) || ".mp4";
  const cleanFilename = path.basename(file.filename, ext);
  // Tạo thư mục nếu chưa tồn tại
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  if (!fs.existsSync(compressedDir)) {
    fs.mkdirSync(compressedDir, { recursive: true });
  }
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }

  console.log("File:", file.filename, file.path);

  const localPath = path.join(localDir, cleanFilename + ext);
  const compressedPath = path.join(compressedDir, cleanFilename + "_compressed" + ext);

  console.log("localPath", localPath);
  console.log("compressedPath", compressedPath);

  try {
    // Step 1: Download the video file
    const response = await axios({
      url: file.path,
      method: "GET",
      responseType: "stream",
    });

    const writer = fs.createWriteStream(localPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Video downloaded:", localPath);

    // Step 2: Compress the video using FFmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(localPath)
        .output(compressedPath)
        .videoCodec("libx264")
        .size("1280x720")
        .on("start", (command) => console.log("FFmpeg command:", command))
        .on("progress", (progress) => console.log("FFmpeg progress:", progress))
        .on("end", resolve)
        .on("error", (err) => {
          console.error("FFmpeg error:", err);
          reject(err);
        })
        .run();
    });

    console.log("Video compressed:", compressedPath);

    // Step 3: Upload the compressed video to Cloudinary
    const result = await cloudinary.uploader.upload(compressedPath, {
      resource_type: "video",
      folder: "videos",
      allowed_formats: ["mp4", "avi", "mkv", "mov"],
    });

    console.log("Upload successful:", result.secure_url);

    // Step 4: Save video information to the database
    const videoData = {
      title,
      url: result.secure_url, // Public URL from Cloudinary
      filename: result.public_id,
      user_id,
    };

    await createVideo(videoData);

    // Step 5: Delete the local files after processing
    const allowedExtensions = ["mp4", "avi", "mkv", "mov"];
    const subDirs = ["compressed_videos", "temp_videos"]; // Chỉ xóa file trong 2 thư mục này

    subDirs.forEach((dir) => {
      const folderPath = path.join(uploadsDir, dir);

      fs.readdir(folderPath, (err, files) => {
        if (err) {
          console.error(`Error reading directory ${folderPath}:`, err);
          return;
        }

        files.forEach((file) => {
          const filePath = path.join(folderPath, file);
          const ext = path.extname(file).slice(1);

          if (allowedExtensions.includes(ext)) {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error("Error deleting file:", filePath, err);
              } else {
                console.log("Deleted file:", filePath);
              }
            });
          }
        });
      });
    });

    return videoData;
  } catch (error) {
    if (error.statusCode) throw error;
    console.error("Error:", error);
    throw new AppError("Video upload failed", 500);
  }
};

const getAllVideos = async () => {
  try {
    return await Video.findAll();
  } catch (e) {
    if (e.statusCode) throw e;
    throw new AppError("Failed to fetch videos", 500);
  }
};

const getVideoById = async (idUser, idVideo) => {
  try {
    if (!idUser) throw new BadRequestError("User ID is required");

    idUser = Number(idUser);
    idVideo = Number(idVideo);

    if (!Number.isInteger(idUser) || idUser <= 0) {
      throw new BadRequestError("Invalid User ID");
    }

    if (!Number.isInteger(idVideo) || idVideo <= 0) {
      idVideo = null;
    }

    const condition = idVideo ? { id: idVideo, user_id: idUser } : { user_id: idUser };

    const videos = await Video.findAll({ where: condition });

    if (!videos.length) throw new NotFoundError("No videos found");

    return videos;
  } catch (e) {
    if (e.statusCode) throw e;
    console.error("Error fetching video:", e.message);
    throw new AppError("Failed to fetch video", 500);
  }
};

const updateVideo = async (id, data) => {
  try {
    let { title, url, filename } = data;
    if (!id) throw new BadRequestError("Video ID is required");

    const video = await Video.findByPk(id);
    if (!video) throw new NotFoundError("Video not found");

    if (url && video.url) {
      const publicId = video.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`videos/${publicId}`, { resource_type: "video" });
    }

    const updatedFields = {};
    if (title) updatedFields.title = title;
    if (url) updatedFields.url = url;
    if (filename) updatedFields.filename = filename;

    await video.update(updatedFields);

    return video;
  } catch (error) {
    if (error.statusCode) throw error;
    throw new AppError(error.message || "Failed to update video", 500);
  }
};

const deleteVideo = async (idUser, idVideo) => {
  try {
    if (!idUser) throw new BadRequestError("User ID is required");
    idUser = Number(idUser);
    idVideo = Number(idVideo);

    if (!Number.isInteger(idUser) || idUser <= 0) {
      throw new BadRequestError("Invalid User ID");
    }

    const isValidIdVideo = Number.isInteger(idVideo) && idVideo > 0;
    const condition = isValidIdVideo ? { id: idVideo, user_id: idUser } : { user_id: idUser };

    const videos = isValidIdVideo
      ? [await Video.findOne({ where: condition })]
      : await Video.findAll({ where: condition });

    if (!videos || videos.length === 0 || videos[0] === null) {
      throw new NotFoundError("No videos found");
    }

    for (const video of videos) {
      if (video.videoUrl) {
        const publicId = video.videoUrl.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`videos/${publicId}`, { resource_type: "video" });
      }
    }

    await Video.destroy({ where: condition });

    return { message: `Deleted ${videos.length} video(s) successfully` };
  } catch (e) {
    if (e.statusCode) throw e;
    console.error("Error deleting video:", e.message);
    throw new AppError("Failed to delete video(s)", 500);
  }
};

module.exports = {
  uploadAndCompressVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
};
