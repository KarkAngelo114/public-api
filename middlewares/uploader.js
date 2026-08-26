
const multer = require('multer');
const path = require('path');

const tempUploadPath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, tempUploadPath),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

/**
 * @function uploadSinglea allows you to upload a single file
 * @param {String} field_name - name of the field that contains file
 */
const uploadSingle = (field_name) => upload.single(field_name);

/**
 * 
 * @param {String} field_name - name of the field that contains file
 * @param {Number} limit - number of files to be uploaded
 * @returns 
 */
const uploadMultiple = (field_name, limit) => upload.array(field_name, limit);

module.exports = {
    uploadSingle,
    uploadMultiple
};
