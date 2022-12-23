const { Schema, model, SchemaType, SchemaTypes } = require('mongoose')

const notificationSchema = new Schema({
    userOne: SchemaTypes.ObjectId,
    userTwo: SchemaTypes.ObjectId,
    text: {
        type: String
    }
}, {
    timestamps: true
})

const Notification = model('Notification', notificationSchema)

module.exports = { Notification }