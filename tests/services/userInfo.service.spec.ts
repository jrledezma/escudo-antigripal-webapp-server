import "reflect-metadata";
import { expect } from "chai";
import "mocha";
import * as Chalk from "chalk"

import { UserInfoServiceInterface } from "../../src/api/interfaces/services/userInfoServiceInterface";
import { UserInfoModelInterface } from "../../src/api/interfaces/models/userInfoModelInterface";
import { ServiceResultInterface } from "../../src/api/interfaces/serviceResultInterface";
import { ApiContainer } from "../../src/api/apiConfig"
import { ApiTypes } from "../../src/api/apiTypes"
import UserInfoSchema, { UserInfoDocumentInterface } from "../../src/api/models/userInfoModel";
import { MongoTestingConfig } from "./mongoConfig";

describe("UserInfo Unit Test",
  () => {

    let userInfo: UserInfoDocumentInterface;
    before((done: MochaDone) => {
      MongoTestingConfig.ConnectToDB();
      done();
    });

    describe("Create user", () => {

      it("Should create an UserInfo Object", () => {
        ApiContainer.get<UserInfoServiceInterface>(ApiTypes.userInfoService).Create({
          firstName: "UnitTest",
          lastName: "User",
          email: "unittestuser@testing.com",
          status: "Active"
        })
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let userInfo: UserInfoModelInterface = serviceResult.detail as UserInfoModelInterface;
              expect(userInfo._id).is.not.null
            } else {
              return false;
            }
          })
          .catch((reason: any) => {
            throw Error(reason);
          });
      });
    })

    describe("Modify user", () => {

      before(async () => {
        let dbResult: UserInfoDocumentInterface = await UserInfoSchema.findOne();
        if (!dbResult) {
          console.log(Chalk.default.redBright("Not data found to modify"));
          return false;
        }
        userInfo = dbResult;
        userInfo.firstName = "Unit Test";
        userInfo.lastName = "User Updated";
        userInfo.email = "unit_testuser@testing.com";
      });

      it("Should modify an UserInfo Object", () => {
        ApiContainer.get<UserInfoServiceInterface>(ApiTypes.userInfoService)
          .Modify(userInfo)
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let userId = serviceResult.detail;
              expect(userId).is.not.null
            } else {
              return false;
            }
          })
          .catch((reason: any) => {
            throw Error(reason);
          });
      });
    });

    describe("Get user", () => {
      it("Should get an UserInfo array", () => {
        ApiContainer.get<UserInfoServiceInterface>(ApiTypes.userInfoService)
          .GetAll()
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let userInfoArray: UserInfoModelInterface[] = serviceResult.detail as UserInfoModelInterface[];
              expect(userInfoArray.length).greaterThan(0)
            } else {
              return false;
            }
          });
      });

      it("Should get an UserInfo object", () => {
        ApiContainer.get<UserInfoServiceInterface>(ApiTypes.userInfoService)
          .GetByID(userInfo._id)
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let userResult: UserInfoModelInterface = serviceResult.detail as UserInfoModelInterface;
              expect(userResult._id).not.null;
            } else {
              return false;
            }
          });
      });
      
      it("Should search UserInfo object", () => {
        ApiContainer.get<UserInfoServiceInterface>(ApiTypes.userInfoService)
          .Search({ firstName: "Unit"})
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let userInfoArray: UserInfoModelInterface[] = serviceResult.detail as UserInfoModelInterface[];
              expect(userInfoArray.length).greaterThan(0)
            } else {
              return false;
            }
          });
      });
    });
  });

after((done: MochaDone) => {
  MongoTestingConfig.CloseDBConnection();
  done();
});