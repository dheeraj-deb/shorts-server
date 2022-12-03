const multer = require('multer');
const asyncHandler = require('express-async-handler')


// storage engine
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/videos/uploads')
    }
})

const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/uploads')
    }
})

// file validation

const fileFilterVideo = (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
        cb(null, true)
    } else {
        cb({ message: "Unsupported File Formate" }, false)
    }
}

const fileFilterImage = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb({ message: "Unsupported File Formate" }, false)
    }
}


const uploadVideo = multer({
    storage: videoStorage,
    fileFilter: fileFilterVideo
})

const uploadImage = multer({
    storage: imageStorage,
    fileFilter: fileFilterImage
})


module.exports = { uploadVideo, uploadImage }

// module.exports = multer({
//     storage: multer.diskStorage({
//         destination: '/home/dheeraj/Videos/uploads'
//     }),
//     fileFilter: (req, file, cb) => {
//         const mimetype = file.mimetype.split('/')[0]
//         if (mimetype !== 'video') {
//             new Error("File type is not supported")
//         }
//         cb(null, true)
//     }
// })




