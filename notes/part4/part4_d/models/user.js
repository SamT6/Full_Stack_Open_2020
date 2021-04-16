const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String, //never wise to store unencrypted plain text passwords in the database!
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
})

userSchema.plugin(uniqueValidator)

//below is to format the objects returned by Mongoose
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash //the paswordhash should not be revealed 
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User