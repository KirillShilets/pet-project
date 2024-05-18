const multer = require('multer');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        const filename = file.originalname;
        cb(null, filename);
    },
});

const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

module.exports = multer({ storage, fileFilter });
