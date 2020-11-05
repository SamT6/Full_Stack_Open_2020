
//let -> The scope of a variable defined with let is block scope.
//var -> The scope of a variable defined with var is function scope or declared outside any function, global.
//const -> constant value 
/*var vs let : 
https://www.jstips.co/en/javascript/keyword-var-vs-let/
https://medium.com/podiihq/javascript-variables-should-you-use-let-var-or-const-394f7645c88f
*/
const x = 1
let y = 5

console.log(x, y)   // 1, 5 are printed
y += 10
console.log(x, y)   // 1, 15 are printed
y = 'sometext'
console.log(x, y)   // 1, sometext are printed
//x = 4               // causes an error


//Arrays
const t = [1, -1, 3] //the array is an object the variable always points to the same object. However, the content of the array changes as new items are added to it.
t.push(5) //t.pop()

console.log(t.length)
console.log(t[1])

t.forEach(value => {
    console.log(value)
})


//best practices in react
/*
In React code, it is preferable to use the method concat, 
which does not add the item to the array, 
but creates a new array in which the content of the old array and the new item are both included.
*/
const t_1 = [1, -1, 3]
const t2 = t_1.concat(5)
console.log(t_1)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed

//map method
const t_2 = [1, 2, 3]
const m1 = t_2.map(value => value * 2)
//same as 
/*
const m1 = t_2.map(function(value){
    return value * 2
})
*/
console.log(m1)

const m2 = t_2.map(value => '<li>' + value + '</li>')
console.log(m2)



// destructuring assignment
const t_3 = [1, 2, 3, 4, 5]
const [first, second, ...rest] = t_3
console.log(first, second)
console.log(rest)


//objects using object literals
const object1 = {
    name: "Arto Hellas",
    age: 35,
    education: "PhD",
}
const object2 = {
    name: 'Full Stack web application development',
    level: 'intermediate studies',
    size: 5,
}
const object3 = {
    name: {
      first: 'Dan',
      last: 'Abramov',
    },
    grades: [2, 3, 5, 3],
    department: 'Stanford University',
}
// The properties of an object are referenced by using the "dot" notation, or by using brackets:
console.log(object1.name)
console.log(object2["name"])

//adding properties to object 
object1.address = 'Helsinki'
object1['secret number'] = 12341


//functions
const sum = (p1, p2) => {
    console.log(p1)
    console.log(p2)
    return p1 + p2
}

console.log(sum(1, 5))

//If there is just a single parameter, we can exclude the parentheses from the definition:
const square_v1 = p => {
    console.log(p)
    return p * p
}

const square = p => p*p;


// two ways by which the function can be referenced
function product(a, b) {
    return a * b
  }
  
const result = product(2, 6)  // result is now 12
//and
const average = function(a, b) {
    return (a + b) / 2
}
  
const result_2 = average(2, 5) // result is now 3.5


const arto = {
    name: 'Arto Hellas',
    age: 35,
    education: 'PhD',
    greet: function() {
      console.log('hello, my name is ' + this.name)
    },
    doAddition: function(a, b){
        console.log(a + b)
    },
}
arto.greet()  // "hello, my name is Arto Hellas" gets printed

arto.growOlder = function(){
    this.age += 1
}
console.log(arto.age)   // 35 is printed
arto.growOlder()
console.log(arto.age)   // 36 is printed
  
arto.doAddition(1, 4)
//method reference 
const referenceToAddition = arto.doAddition
referenceToAddition(9, 4)


//"disappearance of this"
setTimeout(arto.greet, 1000)

//solution
setTimeout(arto.greet.bind(arto), 1000)



//class
class Person{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
    greet(){
        console.log("hello, my name is " + this.name);
    }
}

const adam = new Person("Adam Ondra", 35);
adam.greet();

const janja = new Person("Janja Garnbret", 22);
janja.greet();