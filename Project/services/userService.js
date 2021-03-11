import { executeQuery } from "../database/database.js";

const getEmail = async(email) => {
    return await executeQuery("SELECT * FROM users WHERE email = $1;", email);
}

const addUser = async(email,password) => {
    return await executeQuery("INSERT INTO users (email,password) VALUES ($1, $2);",email,password)
}


export {addUser,getEmail}