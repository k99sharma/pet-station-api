/**
 * function to create unique user ID
 * 
 * @params { String, String } function takes first name and last name as parameter.
 * 
 * @return { String } function returns new unique user ID.
 */

 function uniqueIdGenerator(firstName, lastName){
    const prefix = 'usr';

    // if first name and last name both are undefined
    if(firstName == undefined && lastName == undefined)
        throw "First name and Last name cannot be undefined";

    // check if first name or last name is undefined
    // if undefined returns empty string
    firstName = firstName != undefined ? firstName : '';
    lastName = lastName != undefined ? lastName : '';

    const joinedName = lastName + firstName;

    // generate a 6 digit random number
    const randomNumber = '_' + Math.floor(100000 + Math.random() * 900000);

    return prefix + joinedName + randomNumber;
}

/**
 * function to generate hash
 * 
 * @params { Number } function takes length as parameter.
 * 
 * @return { String } function returns hash string.
 */

function hashGenerator(length){
    // string containing [0-9, a-z, A-Z,_];
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_';
    let hash = '';

    for(let i=0; i<length; i++)
        hash += chars[Math.round(Math.random() * (chars.length-1))];

    return hash;
}

/**
 * function to generate username
 * 
 * @params { String } function takes first name as parameter.
 * 
 * @return { String } function returns username
 */

function usernameGenerator(firstName){
    // if first name is not given
    if(firstName == undefined)
        throw 'First name cannot be undefined';

    // generate 6-digit random number
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return firstName + randomNumber;
}

module.exports = {
    uniqueIdGenerator,
    hashGenerator,
    usernameGenerator,
}