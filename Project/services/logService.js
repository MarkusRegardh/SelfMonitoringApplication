import { executeQuery } from "../database/database.js";


const checkM = async(id,date) => {
    return await executeQuery("SELECT * FROM morninglogs WHERE user_id=($1) AND date=($2);",id,date)
}

const checkE = async(id,date) => {
    return await executeQuery("SELECT * FROM eveninglogs WHERE user_id=($1) AND date=($2);",id,date)
}

const updateM = async(date,sleep,sleepQuality,mood,id) => {
    await executeQuery("UPDATE morninglogs SET sleep_duration=($1), sleep_quality=($2),mood=($3) WHERE date=($4) AND user_id=($5);",sleep,sleepQuality,mood,date,id)
}
const updateE = async(date,exercise,study,eating,mood,id) => {
    await executeQuery("UPDATE eveninglogs SET exercise=($1), study=($2),eating=($3),mood=($4) WHERE date=($5) AND user_id=($6);",exercise,study,eating,mood,date,id)
}


const addMorningLog = async(date,sleep,sleepQuality,mood,id) => {
    await executeQuery("INSERT INTO morninglogs (date, sleep_duration, sleep_quality,mood, user_id) VALUES ($1, $2, $3, $4, $5)", date, sleep, sleepQuality, mood,id);
}

const addEveningLog = async(date,exercise,study,eating,mood,id) => {
    await executeQuery("INSERT INTO eveninglogs (date,exercise, study, eating, mood, user_id) VALUES ($1, $2, $3, $4, $5, $6)",date,exercise,study,eating,mood,id)
}






export { updateE,updateM,checkE, checkM,addMorningLog, addEveningLog};