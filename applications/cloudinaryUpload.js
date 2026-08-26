
const cloudinary = require('cloudinary').v2;
const UUID = require('./UUID-generator');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
let port = Number(process.env.PORT);

const localUploadPath = path.join(__dirname, '../uploads');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});



/**
 * @async
 * @function cloudinaryUpload
 * @param {any} filePath - file to upload
 * @param {String} folder - target folder in your cloudinary
 * @returns {Object} - returns the following: url of the uploaded file, public_id and provider name (cloudinary) - if the upload is success, otherwise, the file will be save locally on "uploads" folder
 *
 * cloudinaryUpload() allows you to upload files to your cloudinary. Ensure that you have set up your cloudinary account and save your credentials on your .env file
 *
 */
const cloudinaryUpload = async (filePath, folder = 'fallback') => {
    const publicId = UUID.generate();
    try {
        const options = {
            folder: folder,
            public_id: publicId,
            resource_type: 'auto',
        };
        

        if (Buffer.isBuffer(filePath)) {
            // If the input is binary data, use upload_stream
            return await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(options, (error, result) => {
                    if (error) return reject(error);
                    resolve({
                        success: true,
                        url: result.secure_url,
                        provider: 'cloudinary',
                        public_id: publicId,
                    });
                }).end(filePath);
            });
        } else {
            // If the input is a file path, use the existing upload method
            const result = await cloudinary.uploader.upload(filePath, options);
            return {
                success: true,
                url: result.secure_url,
                provider: 'cloudinary',
                public_id: publicId,
            };
        }
    } catch (err) {
        console.warn('[WARN] Cloudinary upload failed. Saving locally...', err.message);

        const fileName = path.basename(filePath);
        const fallbackPath = path.join(localUploadPath, fileName);

        if (!fs.existsSync(localUploadPath)) fs.mkdirSync(localUploadPath, { recursive: true });

        fs.renameSync(filePath, fallbackPath);

        return {
            success: false,
            url: `http://localhost:${port}/uploads/${fileName}`,
            provider: 'local',
        };
    }
};

/**
 *
 *
 * @async
 * @function cloudinaryDelete
 * @param {any} identifier - unique identifier of the file to delete
 * @param {String} folder - target folder in your cloudinary
 * @returns {Object} - success results of deletion
 * @throws {Error}
 *
 * The cloudinaryDelete() function allows you to delete flles on your cloudinary storage. Ensure that you have setup your cloudinary, save the 
 * credentials on your .env file. The indentifier is the public ID generated when you upload files.
 */
const cloudinaryDelete = async (identifier, folder = 'fallback') => {
    const public_id = `${folder}/${identifier}`;

    try {
        const result = await cloudinary.uploader.destroy(public_id);

        return {
            success: result.result === 'ok',
            provider: 'cloudinary',
            result
        }
    }
    catch (error) {
        
        console.log(error); 

        return {
            success: false,
            error: error.message
        }
    }
};

/**
 * @async
 * @function cloudinaryListFolder
 * @param {String} folder - Folder name in Cloudinary
 * @returns {Object} - List of assets (public_id, url, etc.)
 *
 * cloudinaryListFolder() allows you to retrieve all assets inside a Cloudinary folder.
 */
const cloudinaryListFolder = async (folder = 'fallback') => {
    try {
        const result = await cloudinary.api.resources({
            type: "upload",
            prefix: `${folder}/`,
            max_results: 500
        });

        return {
            success: true,
            assets: result.resources.map(r => ({
                public_id: r.public_id,
                url: r.secure_url,
                format: r.format,
                bytes: r.bytes,
                created_at: r.created_at
            }))
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * 
 * @param {String} url - The URL path of the image uploaded to the cloudinary when using the cloudinaryUpload()
 * @returns object containing full result
 * 
 * Ensure that the asset in your cloudinary is not renamed/moved/modified/transformed 
 * 
 */
const cloudinaryDeleteByUrl = async (url) => {
    const public_id = getPublicIdFromCloudinaryUrl(url);
    if (!public_id) {
        return { success: false, error: 'Invalid Cloudinary URL' };
    }

    try {
        const result = await cloudinary.uploader.destroy(public_id);
        return {
            statusCode: result.result === 'ok' ? 200 : 400,
            provider: 'cloudinary',
            result: result
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
};


const getPublicIdFromCloudinaryUrl = (url) => {
    const parts = url.split('/upload/');
    if (parts.length !== 2) return null;

    const pathPart = parts[1].replace(/^v\d+\//, ''); // remove version
    const withoutExt = pathPart.replace(/\.[^/.]+$/, ''); // remove extension

    return withoutExt; // includes folder
};


module.exports = { 
    cloudinaryUpload,
    cloudinaryDelete,
    cloudinaryListFolder,
    cloudinaryDeleteByUrl
};
