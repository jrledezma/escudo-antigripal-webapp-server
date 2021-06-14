import { Request, Response } from 'express';
import * as express from 'express';
import {
  controller,
  interfaces,
  httpGet,
  httpPost,
  httpPut,
  requestParam,
  queryParam
} from "inversify-express-utils";

@controller("")
export class ConfigDataController implements interfaces.Controller {

  public constructor() { }

  @httpGet("/envvariables")
  public async GetEnvVars(req: Request, res: Response): Promise<any> {
    try {
      return res.status(200)
        .send({
          ENCRIPTION_KEY: process.env.ENCRIPTION_KEY
        });
    } catch (ex) {
      res.status(500)
        .json({
          code: ex.code,
          detail: ex.detail.message
        });
    }
  }

}
