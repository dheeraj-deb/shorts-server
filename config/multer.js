const multer = require('multer');
const asyncHandler = require('express-async-handler')

module.exports = multer({
    storage: multer.diskStorage({
        destination:'/home/dheeraj/Videos/uploads'
    }),
    fileFilter: (req, file, cb) => {
        const mimetype = file.mimetype.split('/')[0]
        if (mimetype !== 'video') {
            new Error("File type is not supported")
        }
        cb(null, true)
    }
})
