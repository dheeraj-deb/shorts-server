const asyncHandler = require("express-async-handler");
const { User } = require('../model/User');
const { obj } = require('../config/database')

const fileUpload = asyncHandler(async (req, res) => {
    const response = await User.findOneAndUpdate(
        { _id: req.user.id },
        {
            $push: {
                posts: req.file.id,
            },
        }
    );

    res.status(201).json({
        message: "post uploaded successfully",
    });
});


const getPosts = asyncHandler(async (req, res) => {
    const { gfs } = obj
    console.log(obj)
    if (!gfs) {
        res.status(500).json({ message: "some error occurred" })
        process.exit(0)
    }

    gfs.find().toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(203).json({ message: 'no files found' })
        } else {
            const f = files.sort((a, b) => {
                return (
                    new Date(b["uploadDate"]).getTime() - new Date(a["uploadDate"]).getTime()
                )
            })


            res.status(200).json({
                message: "success",
                post: f
            })

        }
    })
})


const getPost = (req, res) => {
    const { gfs } = obj
    const file = gfs.uploads.find({ filename: req.params.filename }).toArray((err, files) => {
        if (!files || files.length === 0) {
            return res.status(404).json({
                message: "Could not find file"
            });
        }
        var readstream = gfs.createReadStream({
            filename: files[0].filename
        })
        res.set('Content-Type', files[0].contentType);
        return
    });
}

module.exports = {
    fileUpload,
    getPosts,
    getPost
};