const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean,
})

noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

/*
The public interface of the module is defined by setting a value to the module.exports variable. 
We will set the value to be the Note model. 
The other things defined inside of the module, like the variables mongoose and url will not be accessible or visible to users of the module.
*/
module.exports = mongoose.model('Note', noteSchema)

