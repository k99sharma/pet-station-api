// Common helper functions

// importing modules
const cryptoJS = require('crypto-js')

// importing constant values
const { ENCRYPT_KEY } = require('../configs/index')

/**
 * function to encrypt string.
 *
 * @params { String } parameter to be encrypted.
 * @returns { String } returns encrypted string.
 */

function encrypt(str) {
    let encJson = cryptoJS.AES.encrypt(
        JSON.stringify(str),
        ENCRYPT_KEY
    ).toString()
    let encData = cryptoJS.enc.Base64.stringify(
        cryptoJS.enc.Utf8.parse(encJson)
    )

    return encData
}

/**
 * function to decrypt the encrypted string from encrypt function.
 *
 * @params { String } encrypted string as parameter.
 * @returns { String } return decrypted string.
 */

function decrypt(encryptedString) {
    let decData = cryptoJS.enc.Base64.parse(encryptedString).toString(
        cryptoJS.enc.Utf8
    )
    let bytes = cryptoJS.AES.decrypt(decData, ENCRYPT_KEY).toString(
        cryptoJS.enc.Utf8
    )

    return JSON.parse(bytes)
}

module.exports = {
    encrypt,
    decrypt,
}
