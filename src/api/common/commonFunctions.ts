import * as _ from "lodash";
import * as Moment from "moment";
const chalk = require("chalk");
const colorLogs = chalk;

import { PrintColorType } from "../enums/printColorType.enum"

export class CommonFunctions {

  public constructor() { }

  public static PrintConsoleColor(message: string, messageType: PrintColorType = null): void {
    if (messageType !== null) {
      switch (messageType) {
        case PrintColorType.info:
          console.log(colorLogs.blueBright(message));
          break;
        case PrintColorType.error:
          console.log(colorLogs.redBright(message));
          break;
        case PrintColorType.success:
          console.log(colorLogs.green(message));
          break;
        case PrintColorType.warning:
          console.log(colorLogs.cyan(message));
          break;
        default:
          console.log(colorLogs.grey(message));
          break;
      }
    } else {
      console.log(colorLogs.grey(message));
    }
  }


  // create the params list to make a search by proximity
  // params: 
  //  - params: array of paramaters to use
  // returns:
  // - json params list
  public static buildQueryParams(params: string): {} {
    try {
      let paramsObj = JSON.parse(params),
        paramObject: {} = new Object();
      if (paramsObj) {
        let keys = Object.keys(paramsObj);
        for (let i in keys) {
          switch (typeof (paramsObj[keys[i]])) {
            case "boolean":
              paramObject[keys[i]] = Boolean(new RegExp(paramsObj[keys[i]]));
              break;
            case "number": {
              paramObject[keys[i]] = Number(new RegExp(paramsObj[keys[i]]));
              break;
            }
            case "string": {
              paramObject[keys[i]] = { "$regex": paramsObj[keys[i]], "$options": "i" };
              break;
            }
            default: {
              if (paramsObj[keys[i]] instanceof Date) {
                paramObject[keys[i]] = new Date(new RegExp(paramsObj[keys[i]]).toString());
                break;
              }
              paramObject[keys[i]] = new RegExp(paramsObj[keys[i]]);
              break;
            }
          }
        }
      }
      return paramObject;
    } catch (ex) {
      throw Error(ex.message)
    }
  }

  // generate a UUID (universally unique identifier)
  // params: 
  //  - useDash: boolean value to indicate if must use a dash ("-") inside the UUID
  // returns:
  // - UUID string  
  public static generateUUID(useDash: boolean): string {
    var date = new Date().getTime();
    var uuid = useDash ? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx" : "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx"
      .replace(/[xy]/g, (c) => {
        var r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
      });
    return uuid;
  }

  // transforms a word"s first letter into a uppercase letter
  // params: 
  //  - word: string to transform
  // returns:
  // - string
  public static setCapitalLetter(word: string): string {
    return word[0].toUpperCase() + word.substring(1, (word.length));
  }

  public static mapMongooseErrorObject(mongooseError: any) {
    try {
      let errorObj = {
        code: "success",
        detail: {
          errors: []
        }
      };
      _.forEach(Object.keys(mongooseError), (key) => {
        if (key === "errors") {
          _.forEach(Object.keys(mongooseError[key]), (keyErrors) => {
            errorObj.detail.errors.push(mongooseError[key][keyErrors].message)
          });
        }
      });
      return errorObj;
    } catch (exception) {
      return {
        code: "error",
        detail: {
          technicalMessage: exception.message
        }
      }
    }
  }

  // converts a date/time string into milisecods using moment js
  // params: 
  //  - dateTimeString: date/time string
  //	-	dateTimeType: type of data string 
  //		*	date
  //		* time
  //		*	dateTime
  // returns:
  // - number
  public static convertTimeToMilliseconds(dateTimeString: string, dateTimeType: string): number {
    let momentObj: any;
    switch (dateTimeType) {
      case "date":
        momentObj = Moment(dateTimeString, "YYYY-MM-DD");
        break;
      case "time":
        if (dateTimeString.length === 5) {
          dateTimeString += ":00";
        }
        momentObj = Moment(dateTimeString, "HH:mm:ss")
        break;
      case "dateTime":
        momentObj = Moment(dateTimeString, "YYYY-MM-DD HH-mm Z");
        break;
    }
    return Number(momentObj.format("x"));
  }

  // converts a millisecods into date/time object using moment js
  // params: 
  //  - mls: milliseconds number
  //	-	dateFormat: type of data string 
  // returns:
  // - string
  public static convertMillisecondsToTime(mls: number, dateFormat: string) {
    return Moment(mls).format(dateFormat);
  }



}