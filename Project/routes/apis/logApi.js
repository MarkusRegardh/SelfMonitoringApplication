import { executeQuery } from "../../database/database.js";
import * as logService from "../../services/logService.js";
import * as summaryService from "../../services/summaryService.js";


//appearently the checklist has been updated from "for each day over the last 7 days" to "averaged over the last 7 days"
// im going to stick with this, which gives data for each day

const last7days = async({response}) => {
    const document = (await summaryService.last7()).rowsOfObjects();
    response.body = document
}

const getDay = async({params,response}) => {
    const year = params.year
    const month = params.month
    const day = params.day
    const date = year+'-'+month+'-'+('0'+day).slice(-2)
    const document = (await summaryService.getDate(date)).rowsOfObjects()[0];
    response.body = document
}




export {last7days, getDay};