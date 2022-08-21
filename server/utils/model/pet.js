/**
 * function to create unique pet ID
 *
 * @params { String, String } function takes first name and last name as parameter.
 *
 * @return { String } function returns new unique user ID.
 */

 function uniqueIdGenerator(name) {
    const prefix = 'pet'

    // if first name and last name both are undefined
    if (name == undefined)
        throw 'Name cannot be undefined'

    // generate a 6 digit random number
    const randomNumber = '_' + Math.floor(100000 + Math.random() * 900000)

    return prefix + name + randomNumber
}


module.exports = {
    uniqueIdGenerator
}