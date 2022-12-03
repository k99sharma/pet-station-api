/**
 * Available helper functions.
 */

// importing libraries

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