/**
 * Available helper functions.
 */

// importing libraries
import CryptoJS from "crypto-js";

// importing configuration
import CONFIG from '../configs/config.js';

// function to create UID
export function generateUID(key) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return key + randomNumber;
}

// function to generate default username
export function generateDefaultUsername(firstName) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return firstName + randomNumber;
}

// function to encrypt string
export function encrypt(str) {
    const encJson = CryptoJS.AES.encrypt(
        JSON.stringify(str),
        CONFIG.CRYPTO_ENCRYPT_KEY
    ).toString()
    const encData = CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(encJson)
    )

    return encData;
}

// function to decrypt string
export function decrypt(encryptedString) {
    const decData = CryptoJS.enc.Base64.parse(encryptedString).toString(
        CryptoJS.enc.Utf8
    )
    const bytes = CryptoJS.AES.decrypt(decData, CONFIG.CRYPTO_ENCRYPT_KEY).toString(
        CryptoJS.enc.Utf8
    )

    return JSON.parse(bytes);
}

// function to generate random id
export function generateSameID(key) {
    const hash = CryptoJS.SHA256(key).toString();
    return hash;
}