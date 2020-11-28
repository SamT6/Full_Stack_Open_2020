// YouTube Playlist: https://www.youtube.com/playlist?list=PL0zVEGEvSaeEd9hlmCXrk5yUyqUag-n84
var fs = require('fs')
//new version style but doesn't work here: import fs from 'fs'


// Higher-order functions - Part 1 of Functional Programming in JavaScript
/* note: 
in javascript, functions are values 
 higher-order functions - functions that take other functions as arguments

 .find() - just like .filter() but it only find the first element that match 
*/
var animals = [
    {name: 'Fluffykins', species: 'rabbit'},
    {name: 'Caro', species: 'dog'},
    {name: 'Hamilton', species: 'dog'},
    {name: 'Harold', species: 'fish'},
    {name: 'Ursula', species: 'cat'},
    {name: 'Jimmy', species: 'fish'},
]

var isDog = function(animal){
    return animal.species === 'dog'
}

var dogs = animals.filter(isDog);
//shprt-hand
var dogs_short = animals.filter(animal => animal.species === 'dog')

console.log(dogs);
console.log(dogs_short);





// Map - Part 2 of Functional Programming in JavaScript
var names = animals.map(function(animal){
    return animal.name + ' is a ' + animal.species
})

//arrow function
var names_arrow = animals.map(animal => animal.name + " hi");

console.log(names);
console.log(names_arrow);






//Reduce basics - Part 3 of Functional Programming in JavaScript
// note: reduce can do ANY array transformation, including map and filter

var orders = [
    {amount: 250},
    {amount: 400},
    {amount: 100},
    {amount: 325},
]

var total = orders.reduce(function(sum, order){
    console.log('sum: ', sum, ' order: ', order.amount);
    return sum + order.amount
}, 0) // 0 is the starting value

console.log(total);







// Reduce Advanced - Part 4 of Functional Programming in JavaScript
// good funcational code is made up of small functions that do one thing and binds a lot of them together 

//trim removes the last line break
var output = fs.readFileSync('data.txt', 'utf8')
                .trim()
                .split('\n')
                .map(line => line.split('\t'))
                .reduce((customers, line) => {
                    customers[line[0]] = customers[line[0]] || [] // first time: { 'mark johansson': [], 'Nikita Smith': [] }
                    customers[line[0]].push({
                        name: line[1],
                        price: line[2],
                        quantiy: line[3]
                    })
                    return customers
                }, {})

console.log(JSON.stringify(output, null, 2)) //2 spaces for indentation







//Closures - Part 5 of Functional Programming in JavaScript
// in javascript, functions are also closure, they can access variables defiend outside the function
var me = "Sam";
function greetMe(){
    console.log('Hello, ' + me + "!");
}
greetMe();

//use cases:
/*
    function sendRequest(){
        var requestID = '123';
        $.ajax({
            url: "/myUrl",
            success: function(response){
                alert('Request ' + requestID + ' returned');
            }
        });
    }
*/









//Currying - Part 6 of Functional Programming in JavaScript
/* when a function doesn't take all of its arguments up front, 
instead it keeps returning functions passing with additional parameters until the last function return something p5.BandPass()p5.BandPass()p5.BandPass(). 
There're libraries that can make non-curry function curry
*/

let dragon = (name, size, element) => 
    name + " is a " + 
    size + " dragon that breathes " +
    element + "!"


console.log(dragon('fluffykins', 'tiny', 'lightning'));


let dragon_curry = 
    name =>
        size =>
            element =>
                name + " is a " + 
                size + " dragon that breathes " +
                element + "!"

console.log(dragon_curry('fluffykins')('tiny')('lightning'));              








//Recursion - Part 7 of Functional Programming in JavaScript
//when a function calls itself until it doesn't
let countDownFrom = (num) => {
    if(num === 0) return;
    console.log(num);
    countDownFrom(num-1)
}
countDownFrom(10)



let categories = [
    {id: 'animals', 'parent': null},
    {id: 'mammals', 'parent': 'animals'},
    {id: 'cats', 'parent': 'mammals'},
    {id: 'dogs', 'parent': 'mammals'},
    {id: 'chihuahua', 'parent': 'dogs'},
    {id: 'labrador', 'parent': 'dogs'},
    {id: 'persian', 'parent': 'cats'},
    {id: 'siamese', 'parent': 'cats'},
]

let makeTree = (categories, parent) =>{
    let node = {}
    categories
        .filter(c => c.parent === parent)
        .forEach(c => node[c.id] = makeTree(categories, c.id))

    return node;
}

console.log(
    JSON.stringify(makeTree(categories, null), null, 2)
);








//Promises - Part 8 of Functional Programming in JavaScript
// promise of a value 

