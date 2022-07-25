/**
 * function to create unique user ID
 * 
 * @params { String, String } function takes first name and last name as parameter
 * 
 * @return { String } function returns new unique user ID 
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
    const randomNumber = '_' + Math.floor(100000 + Math.random() * 900000);

    return prefix + joinedName + randomNumber;
}

module.exports = {
    uniqueIdGenerator
}