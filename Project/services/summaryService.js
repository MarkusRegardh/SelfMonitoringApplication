import { executeQuery } from "../database/database.js";


const getWeekM = async(id,week,year) => {
    return await executeQuery("SELECT AVG(mood) as AM, AVG(sleep_duration) as ASD, AVG(sleep_quality) as ASQ from morninglogs where user_id=($1) AND date_part('week',date)=($2) AND date_part('year',date)=($3);",id,week,year)
}

const getWeekE = async(id,week,year) => {
    return await executeQuery("SELECT AVG(exercise) as AEX,AVG(study) as AS,AVG(eating) as AE,AVG(mood) as AM FROM eveninglogs WHERE user_id=($1) AND date_part('week',date)=($2) AND date_part('year',date)=($3);",id,week,year)
}

const getWeekMood = async(id,week,year) => {
    return await executeQuery("select AVG(mood) as AM FROM(select mood,date,user_id from eveninglogs UNION ALL select mood,date,user_id from morninglogs) as sub WHERE user_id=($1) AND date_part('week',date)=($2) AND date_part('year',date)=($3);",id,week,year)
}

const getDate = async(date) => {
    return await executeQuery("select AVG(sub.mood) as avarage_mood, AVG(sleep_duration) as avarage_sleep, AVG(sleep_quality) as avarage_sleep_quality,AVG(exercise) as avarage_exercise, AVG(study) as avarage_studytime, AVG(eating) as eatingquality FROM(select mood,date from eveninglogs UNION ALL select mood,date from morninglogs) as sub FULL JOIN morninglogs ON morninglogs.date=sub.date FULL JOIN eveninglogs ON eveninglogs.date=sub.date where sub.date=($1)",date)
}

const last7 = async() => {
    return await executeQuery("select sub.date,AVG(sub.mood) as avarage_mood, AVG(sleep_duration) as avarage_sleep, AVG(sleep_quality) as avarage_sleep_quality,AVG(exercise) as avarage_exercise, AVG(study) as avarage_studytime, AVG(eating) as eatingquality FROM(select mood,date from eveninglogs UNION ALL select mood,date from morninglogs) as sub FULL JOIN morninglogs ON morninglogs.date=sub.date FULL JOIN eveninglogs ON eveninglogs.date=sub.date where sub.date > current_date - interval '7 day' AND sub.date<= current_date group by sub.date order by sub.date   ;")
}



const getMonthMood = async(id,month,year) => {
    return await executeQuery("select AVG(mood) as AM FROM(select mood,date,user_id from eveninglogs UNION ALL select mood,date,user_id from morninglogs) as sub  WHERE user_id=($1) AND date_part('month',date)=($2) AND date_part('year',date)=($3);",id,month,year)
}

const getMonthM = async(id,month,year) => {
    return await executeQuery("SELECT AVG(mood) as AM, AVG(sleep_duration) as ASD, AVG(sleep_quality) as ASQ from morninglogs WHERE user_id=($1) AND date_part('month',date)=($2) AND date_part('year',date)=($3);",id,month,year)
}

const getMonthE = async(id,month,year) => {
    return await executeQuery("SELECT AVG(exercise) as AEX,AVG(study) as AS,AVG(eating) as AE,AVG(mood) as AM FROM eveninglogs WHERE user_id=($1) AND date_part('month',date)=($2) AND date_part('year',date)=($3);",id,month,year)
}

const yesterdayM = async() => {
    return await executeQuery("SELECT mood FROM morninglogs WHERE date= current_date - interval '1 day';")
}
const yesterdayE = async() => {
    return await executeQuery("SELECT mood FROM morninglogs WHERE  date= current_date - interval '1 day';")
}


const todayM = async() => {
    return await executeQuery("SELECT mood FROM morninglogs WHERE date= current_date;")
}

const todayE = async() => {
        return await executeQuery("SELECT mood FROM eveninglogs WHERE date= current_date;")
}

export {last7,getDate,todayE, todayM, yesterdayE,yesterdayM, getMonthE,getMonthM,getMonthMood,getWeekE,getWeekMood,getWeekM}