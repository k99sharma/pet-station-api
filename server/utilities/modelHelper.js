/**
 * function to create unique user ID
 * 
 * @params { String, String } function takes first name and last name as parameter
 * 
 * @return { String } function returns new unique user ID 
 */

function uniqueIdGenerator(firstName, lastName){
    const prefix = 'usr';
    const joinedName = lastName + firstName;
    const randomNumber = '_' + console.log(Math.floor(Math.random()*1000000));

    return prefix + joinedName + randomNumber;
}

module.exports = {
    uniqueIdGenerator
}