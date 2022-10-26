const {GridFsStorage} = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const multer = require('multer');

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        console.log(req.user)
        return new Promise(async(resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err)
                }

                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename: filename,
                    bucketName: "uploads"
                };

                resolve(fileInfo)
            })
        })
    }
})

const upload = multer({
    storage
})

module.exports = upload