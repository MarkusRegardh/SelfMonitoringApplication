import * as summaryService from "../../services/summaryService.js";


let currentTime = new Date()

function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return [d.getUTCFullYear(), weekNo];
}

let curryearM = currentTime.getFullYear()
let curryearW = currentTime.getFullYear()

let currweek = getWeekNumber(currentTime)[1]


let currMonth = currentTime.getMonth()+1

const weeklyStats = async(id) => {
    const week = currweek
    const year =  curryearW
    const weekM = (await summaryService.getWeekM(id,week,year)).rowsOfObjects()[0];
    const weekE = (await summaryService.getWeekE(id,week,year)).rowsOfObjects()[0];
    const weekMood = (await summaryService.getWeekMood(id,week,year)).rowsOfObjects()[0];
    const data = {
    };
    data.errorW = null
    if (Number(weekMood.am) != 0){
    if (Number(weekM.asq) != 0){
        data.sleepQW = Number(weekM.asq).toFixed(2);
        data.sleepDW = Number(weekM.asd).toFixed(2);
    } else {
        data.sleepQW = "not enough data";
        data.sleepDW = "not enough data";
    }
    if (Number(weekE.ae)!=0){
        data.exerciseW = Number(weekE.aex).toFixed(2);
        data.studyW = Number(weekE.as).toFixed(2);
        data.eatingW = Number(weekE.ae).toFixed(2);
    } else {
        data.exerciseW = "not enough data";
        data.studyW = "not enough data";
        data.eatingW = "not enough data";
    }
        data.moodW = Number(weekMood.am).toFixed(2)
   
    } else {
        data.errorW = `no data for week number ${week} of ${year}`
    }
    data.week = week
    data.yearW = year
    
    return data;
}

const monthlyStats = async(id) => {
    const month = currMonth
    const year =  curryearM
    const MonthM = (await summaryService.getMonthM(id,month,year)).rowsOfObjects()[0];
    const MonthE = (await summaryService.getMonthE(id,month,year)).rowsOfObjects()[0];
    const monthMood = (await summaryService.getMonthMood(id,month,year)).rowsOfObjects()[0];
    const data = {
    };
    data.errorM = null
    if (Number(monthMood.am)!=0){
    if (Number(MonthM.asq)!=0){
        data.sleepQM = Number(MonthM.asq).toFixed(2);
        data.sleepDM = Number(MonthM.asd).toFixed(2);
    } else {
        data.sleepQM = "not enough data";
        data.sleepDM = "not enough data";
    }
    if (Number(MonthE.ae)!=0){
        data.exerciseM = Number(MonthE.aex).toFixed(2);
        data.studyM = Number(MonthE.as).toFixed(2);
        data.eatingM = Number(MonthE.ae).toFixed(2);
    } else {
        data.exerciseM = "not enough data";
        data.studyM = "not enough data";
        data.eatingM = "not enough data";
    }
        data.moodM = Number(monthMood.am).toFixed(2);
    } else {
        data.errorM = `No data from month number ${month} of ${year}`
    }
    data.month = month
    data.yearM = year
    
    return data;
}

//Stats are given for the current week/month


const stats = async({render, session}) => {
    
    const user = await session.get("user")
    const month = await monthlyStats(user.id);
    const week = await weeklyStats(user.id);
    const data = {...month,...week}
    data.email = user.email
    render('summary/stats.ejs',data)
    currweek = getWeekNumber(currentTime)[1]
      currMonth =currentTime.getMonth()+1
      curryearM = currentTime.getFullYear()
      curryearW = currentTime.getFullYear()
}

const statsPost = async({request, response}) => {
    const body = request.body();
    const params = await body.value;
    if (params.get("monthNR")){
        const res = params.get("monthNR").split('-')
        curryearM = res[0]
        currMonth = res[1]
        } 
    if (params.get("weekNR")){
        const res = params.get("weekNR").split('-')
        curryearW = res[0]
        currweek = res[1].substring(1)
    }
    response.redirect('/behavior/summary')
}



const lastTwoDays = async({render,session}) => {
    const yesterdayE = (await summaryService.yesterdayE()).rowsOfObjects()[0]
    const yesterdayM = (await summaryService.yesterdayM()).rowsOfObjects()[0]
    const todayE = (await summaryService.todayE()).rowsOfObjects()[0]
    const todayM = (await summaryService.todayM()).rowsOfObjects()[0]
    let today = 0
    let yesterday = 0
    const data = {};
    if (todayE && todayM){
        today = (Number(todayE.mood)+Number(todayM.mood))/2
        data.today = (Number(todayE.mood)+Number(todayM.mood))/2
    } else if (todayE){
        today = Number(todayE.mood)
        data.today = Number(todayE.mood)
    } else if (todayM){
        today = Number(todayM.mood)
        data.today = Number(todayM.mood)
    }else {
        today = -1
        data.today = "no data from today"
    }
    if (yesterdayE && yesterdayM){
        data.yesterday = (Number(yesterdayE.mood)+Number(yesterdayM.mood))/2
        yesterday = (Number(yesterdayE.mood)+Number(yesterdayM.mood))/2
    }else if (yesterdayE){
        data.yesterday = yesterdayE.mood
        yesterday = yesterdayE.mood
    } else if (yesterdayM){
        data.yesterday = yesterdayM.mood
        yesterday = yesterdayM.mood
    } else {
        yesterday = -1
        data.yesterday = "no data from yesterday"
    }
    if (today!=-1 && yesterday!=-1){
        if (today>yesterday){
            data.trend = "things are looking bright today"
        } else if (yesterday>today) {
            data.trend = "things are looking gloomy today"
        } else {
            data.trend = "things are looking ok"
        }
    } else {
        data.trend = "Not enogh data"
    }
    const user = await session.get("user")
    if (!user){
        data.email = "You are not logged in"
    } else {
    data.email = user.email
    }
    render('summary/landing.ejs',data)
}

export {lastTwoDays,stats,statsPost,currMonth,currentTime,currweek,curryearM,curryearW,weeklyStats,monthlyStats}