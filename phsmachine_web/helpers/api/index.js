// Type definitions for PHS API Helper
// Project: https://github.com/Senpai-Coders/CAPSTONE-PHS-Machine
// Definitions by: Jerbee Paragas <https://github.com/Jervx/>
// Definitions: 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

/**
 * Generates a encrpyted password.
 * 
 * ! use await when calling this function
 * 
 * ? This function utilizes bcryptjs library
 * @param {*} PASSWORD a readable string
 * @returns a encrypted version of the readable string provided
 */
export const HASH_PASSWORD = async (PASSWORD) => {
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
export const COMPARE_PASSWORD = async (HASH_PASSWORD, PASSWORD) => {
    let matched = false
    matched = await bcrypt.compare(PASSWORD, HASH_PASSWORD)
    return matched
}

/**
 * Generates JWT.
 * 
 * ? This function utilizes jsonwebtoken library
 * @param DATA any data/payload to include in jwt
 * @returns true a jwt token
 */
export const GENERATE_JWT = (DATA) => {
    //May expiration
    //return jwt.sign(DATA, process.env.JWT_SCRT, { expiresIn: process.env.JWT_EXP_TIME, });
    return jwt.sign(DATA, process.env.JWT_SCRT);
};
  

export const VERIFY_AUTHORIZATION = (JWT) => {
    try{
        const DATA = jwt.verify(JWT, process.env.JWT_SCRT);
        return DATA
    }catch(e){
        return false
    }
}

export default {}