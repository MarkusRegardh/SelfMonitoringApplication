import * as logService from "../../services/logService.js";
import {validate, required, isNumber, numberBetween,minNumber} from "../../deps.js"

let currentTime = new Date()

 
const morning = async({render,session}) => {
    const user = await session.get("user")
    const data = {
        mood: 3,
        sleepQuality: 3,
        sleep: "",
        errors: null,
        date: null,
        email: user.email
    }
  render('reporting/morning.ejs',data);
};

const evening = async({render,session}) => {
    const user = await session.get("user")
    const data = {
        mood: 3,
        exercise: "",
        eating: 3,
        study: "",
        date: null,
        errors: null,
        email: user.email
    }
    render('reporting/evening.ejs',data);
  };
  



  const addMorning = async({request, response, session, render}) => {
      const validationRules = {
        sleep: [isNumber,minNumber(0),required],
        sleepQuality: [numberBetween(0,5)],
        mood: [numberBetween(0,5)]
      }
    
    const user = await session.get("user")
    const id = user.id
    const email = user.email
    const body = request.body();
    const params = await body.value;
    const sleep = params.get("sleep")
    const date = params.get("date")
    const sleepQuality = params.get("sleepQuality")
    const mood = params.get("mood")
    const data = {
        date: date,
        errors: null,
        sleep: Number(sleep),
        sleepQuality: Number(sleepQuality),
        mood: Number(mood),
        email: email
    }
    const [passes, errors] = await validate(data, validationRules);
    if (passes){
    const check = await logService.checkM(id,date)
    if (check.rowCount>0){
        await logService.updateM(date,sleep,sleepQuality,mood,id)
    }else  {
    await logService.addMorningLog(date,sleep,sleepQuality,mood,id)
    }
    response.redirect('/')
} else {
    data.errors = errors
    render('reporting/morning.ejs',data)
}
};

const addEvening = async({request, response, session,render}) => {
    
    const validationRules = {
        exercise: [isNumber,minNumber(0),required],
        study: [isNumber,minNumber(0),required],
        eating: [numberBetween(0,5)],
        mood: [numberBetween(0,5)]
      }

    const user = await session.get("user")
    const id = user.id
    const email = user.email
    const body = request.body();
    const params = await body.value;
    const exercise = params.get("exercise")
    const date = params.get("date")
    const study = params.get("study")
    const eating = params.get("eating")
    const mood = params.get("mood")
    const data = {
        mood: Number(mood),
        date: date,
        eating: Number(eating),
        study: Number(study),
        exercise: Number(exercise),
        errors: null,
        email: email
    }
    const [passes, errors] = await validate(data, validationRules);
    if (passes){
    const check = await logService.checkE(id,date)
    if (check.rowCount>0){
        await logService.updateE(date,exercise,study,eating,mood,id)
    }else  {
    await logService.addEveningLog(date,exercise,study,eating,mood,id)
    }
    response.redirect('/')
} else {
    data.errors = errors
    render('reporting/evening.ejs',data)
}
};



const reporting = async({session,render}) => {
    const data = {};
    const user = await session.get("user")
    const morning = await logService.checkM(user.id,currentTime);
    const evening = await logService.checkE(user.id,currentTime);
    data.morning = ""
    data.evening = ""
    if (morning.rowCount > 0){
        data.morning = "You have reported this morning"
    }
    if (evening.rowCount > 0){
        data.evening = "You have reported this evening"
    }
    data.email = user.email
    render('reporting/reporting.ejs',data)
}


export { reporting, addMorning, addEvening, morning, evening};