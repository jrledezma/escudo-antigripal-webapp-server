import { CommonFunctions } from "../../src/api/common/commonFunctions";
import * as mongoose from "mongoose";
import * as Chalk from "chalk"
import { MongoError } from "mongodb";
import { DBConnectionState } from "../../src/api/enums/dbConnectionState.enum";

export class MongoTestingConfig {
  public static async ConnectToDB(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== DBConnectionState.connected) {
        const MongoUrl: string = "mongodb://".concat(CommonFunctions.AppConfiguration.db.server, ":",
          CommonFunctions.AppConfiguration.db.port.toString(), "/", CommonFunctions.AppConfiguration.db.dbName);

        mongoose.connect(MongoUrl, {}, (error: MongoError) => {
          if (error) {
            console.log(Chalk.default.red("Error connecting to DB ->").concat(error.message));
            return Promise.reject(error);
          }
          console.log(Chalk.default.green("Connected to DB " + CommonFunctions.AppConfiguration.unitTestConfig.db.dbName));
          Promise.resolve();
        });
      }
    } catch (exception) {
      Promise.reject(exception.message)
    }
  }

  public static async CloseDBConnection(): Promise<void> {
    try {
      if (mongoose.connection.readyState === DBConnectionState.connected) {
        mongoose.connection.close();
        console.log(Chalk.default.green("DB connection was successfully closed"));
        Promise.resolve();
      }
    } catch (exception) {
      Promise.reject(exception.message)
    }
  }
}