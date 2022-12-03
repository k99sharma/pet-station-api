/**
 * Available helper functions.
 */

// importing libraries

// function to create UID
export function generateUID(key) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);

    return key + randomNumber;
}

export function fetchData() {

}