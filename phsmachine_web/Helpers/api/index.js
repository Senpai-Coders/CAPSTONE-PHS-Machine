// Type definitions for PHS API Helper
// Project: https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine
// Definitions by: Jerbee Paragas <https://github.com/Jervx/>
// Definitions: 

const bcrypt = require("bcryptjs")


/**
 * Generates a encrpyted password.
 * 
 * ! use await when calling this function
 * 
 * ? This function utilizes bcryptjs library
 * @param {*} PASSWORD a readable string
 * @returns a encrypted version of the readable string provided
 */
export const HASH_PASSWORD = async(PASSWORD) => {
    const HASHED = await bcrypt.hash(PASSWORD, 10);
    return HASHED
}

/**
 * Identifies if an encrpyted string & a provided string are thesame.
 * 
 * ! use await when calling this function
 * 
 * ? This function utilizes bcryptjs library
 * @param HASHED_PASSWORD an encrypted(Hashed) string
 * @param PASSWORD a readable string
 * @returns true or false, true if matched, otherwise false if not matched
 */
export const COMPARE_PASSWORD = async(HASH_PASSWORD, PASSWORD) => {
    let matched = false
    matched = await bcrypt.compare(PASSWORD, HASH_PASSWORD)
    return matched
}


export default { }