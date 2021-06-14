import "reflect-metadata";
import { expect } from "chai";
import "mocha";
import * as Chalk from "chalk"

import { ClientServiceInterface } from "../../src/api/interfaces/services/clientServiceInterface";
import { ClientModelInterface } from "../../src/api/interfaces/models/clientModelInterface";
import { ServiceResultInterface } from "../../src/api/interfaces/serviceResultInterface";
import { ApiContainer } from "../../src/api/apiConfig"
import { ApiTypes } from "../../src/api/apiTypes"
import ClientSchema, { ClientDocumentInterface } from "../../src/api/models/clientModel";
import { MongoTestingConfig } from "./mongoConfig";
import { ContactTypes } from "../../src/api/interfaces/models/contactModelInterface";

describe("Client Unit Test",
  () => {

    let clientInfo: ClientDocumentInterface;
    before((done: MochaDone) => {
      MongoTestingConfig.ConnectToDB();
      done();
    });

    describe("Create client", () => {

      it("Should create an client Object", () => {
        ApiContainer.get<ClientServiceInterface>(ApiTypes.clientService).Create({
          idNumber: "0000TEST",
          name: "clientTest",
          contact: [{
            type: ContactTypes.address,
            value: "..."
          }],
          comments: "Test",
          status: "Active"
        })
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let clientInfo: ClientModelInterface = serviceResult.detail as ClientModelInterface;
              expect(clientInfo._id).is.not.null
            } else {
              return false;
            }
          })
          .catch((reason: any) => {
            throw Error(reason);
          });
      });
    })

    describe("Modify client", () => {

      before(async () => {
        let dbResult: ClientDocumentInterface = await ClientSchema.findOne();
        if (!dbResult) {
          console.log(Chalk.default.redBright("Not data found to modify"));
          return false;
        }
        clientInfo = dbResult;
        clientInfo.name = "Client Unit Test";
        clientInfo.contact = [{
          type: ContactTypes.address,
          value: "..."
        }, {
          type: ContactTypes.phone,
          value: "8888888"
        }]
      });

      it("Should modify an clientInfo Object", () => {
        ApiContainer.get<ClientServiceInterface>(ApiTypes.clientService)
          .Modify(clientInfo)
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let clientId = serviceResult.detail;
              expect(clientId).is.not.null
            } else {
              return false;
            }
          })
          .catch((reason: any) => {
            throw Error(reason);
          });
      });
    });

    describe("Get client", () => {
      it("Should get an clientInfo array", () => {
        ApiContainer.get<ClientServiceInterface>(ApiTypes.clientService)
          .GetAll()
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let clientInfoArray: ClientModelInterface[] = serviceResult.detail as ClientModelInterface[];
              expect(clientInfoArray.length).greaterThan(0)
            } else {
              return false;
            }
          });
      });

      it("Should get an clientInfo object", () => {
        ApiContainer.get<ClientServiceInterface>(ApiTypes.clientService)
          .GetByID(clientInfo._id)
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let clientResult: ClientModelInterface = serviceResult.detail as ClientModelInterface;
              expect(clientResult._id).not.null;
            } else {
              return false;
            }
          });
      });
      
      it("Should search clientInfo object", () => {
        ApiContainer.get<ClientServiceInterface>(ApiTypes.clientService)
          .Search({ firstName: "Unit"})
          .then((serviceResult: ServiceResultInterface) => {
            if (serviceResult.code === "success") {
              let clientInfoArray: ClientModelInterface[] = serviceResult.detail as ClientModelInterface[];
              expect(clientInfoArray.length).greaterThan(0)
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