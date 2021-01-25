const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://ST:${password}@partc.iwjcj.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})

const phonebookSchema = new mongoose.Schema({
    name: String,
    number: String
})

// collection automatically named "people"
const Person = mongoose.model("Person", phonebookSchema)

if(process.argv.length == 5){ 
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number
    })
    
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close()
    })
}
else { //password only, get all data in collection
    Person.find({}).then(result =>{
        console.log("phonebook:");
        result.forEach(person => {
            console.log(person.name + " " + person.number);
        })
        mongoose.connection.close()
    })

}
