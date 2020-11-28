import axios from 'axios'


//fulfilled or resolved 
const promise = axios.get("http://localhost:3001/notes")
console.log(promise);


//rejected 
const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2);


//access the result of the operation
promise.then(response => {
  console.log(response);
})


//more generally,
axios.get("http://localhost:3001/notes")  
     .then(response => {
        const notes = response.data;
        console.log(notes);
      })