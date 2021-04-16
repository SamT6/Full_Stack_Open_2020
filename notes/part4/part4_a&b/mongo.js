/*
Document databases like Mongo are schemaless, meaning that the 
database itself does not care about the structure of the data 
that is stored in the database. 
It is possible to store documents with completely 
different fields in the same collection.

The idea behind Mongoose is that the data stored in the database 
is given a schema at the level of the application that defines 
the shape of the documents stored in any given collection.
*/
const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://SamT:${password}@cluster0.ww3sn.mongodb.net/note-app?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true, 
    useUnifiedTopology:true,
    useFindAndModify: false,
    useCreateIndex: true
})


//The schema tells Mongoose how the note objects are to be stored in the database.
//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

//model definition, creates a collection named 'notes'
const Note = mongoose.model('Note', noteSchema) //Mongoose automatically looks for the plural, lowercased version of your model name, to use as collection name

//An instance of a model is called a document
// const note = new Note({
//     content: 'HTML is Hello',
//     date: new Date(),
//     important: true,
// })

// note.save().then(result => {
//     console.log('note saved!');
//     mongoose.connection.close()
// })

//find all notes stored in Note collection 
Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note);
    })
    mongoose.connection.close()
})