const Aws = require("aws-sdk")

const s3 = new Aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

exports.s3Bucket = s3;