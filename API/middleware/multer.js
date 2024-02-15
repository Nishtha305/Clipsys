const multer = require("multer");

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const videofileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/trash");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const moviefileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/trash");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: fileStorageEngine, limits: 1024 * 1024 * 5 });
const videoupload = multer({ storage: videofileStorageEngine, limits: 1024 * 1024 * 100000 });
const movieupload = multer({ storage: moviefileStorageEngine, limits: 1024 * 1024 * 100000 });

module.exports = {
    fileStorageEngine,
    upload,
    videofileStorageEngine,
    videoupload,
    moviefileStorageEngine,
    movieupload
}