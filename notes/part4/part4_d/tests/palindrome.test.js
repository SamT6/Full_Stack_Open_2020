const palindrome = require('../utils/for_testing').palindrome


//The first parameter of the function is the test description as a string. 
//The second parameter is a function, that defines the functionality for the test case.
test('palindrome of a', () => {
    const result = palindrome('a')

    expect(result).toBe('a')
})

test('palindrome of react', () => {
    const result = palindrome('react')

    expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
    const result = palindrome('releveler')

    expect(result).toBe('releveler')
})