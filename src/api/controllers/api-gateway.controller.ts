import { Request, Response } from 'express';
import * as express from 'express';
import {
  controller,
  interfaces,
  httpGet,
  httpPost,
  httpPut,
  requestParam,
  queryParam,
  httpDelete
} from 'inversify-express-utils';
import * as jwt from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { ApiGatewayService } from '../services/api-gateway.service';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ApiTypes } from '../apiTypes';

@controller('')
export class ApiGatewayController implements interfaces.Controller {
  private ApiGatewaySrv: ApiGatewayService;

  public constructor(
    @inject(ApiTypes.apiGatewayService) ApiGatewaySrv: ApiGatewayService
  ) {
    this.ApiGatewaySrv = ApiGatewaySrv;
  }

  @httpPost('/*')
  public async Post(req: Request, res: Response): Promise<any> {
    try {
      const serviceResult: ServiceResultInterface = await this.ApiGatewaySrv.Post(
        await this.getAuthCode(req.headers['authorization']),
        req.body,
        req.url,
        req.files as any
      );
      return res.status(200).send(serviceResult);
    } catch (ex) {
      let exception: any;
      if (ex.status) {
        exception = ex.detail;
      }
      exception = ex;
      res
        .status(ex.status ? ex.status : 500)
        .send(exception.detail ? exception.detail : ex);
    }
  }

  @httpPut('/*')
  public async Put(req: Request, res: Response): Promise<any> {
    try {
      const serviceResult: ServiceResultInterface = await this.ApiGatewaySrv.Put(
        await this.getAuthCode(req.headers['authorization']),
        req.body,
        req.url,
        req.files as any
      );
      return res.status(200).send(serviceResult);
    } catch (ex) {
      let exception: any;
      if (ex.status) {
        exception = ex.detail;
      }
      exception = ex;
      res.status(ex.status ? ex.status : 500).send(exception);
    }
  }

  @httpGet('/*')
  public async Get(req: express.Request, res: express.Response): Promise<any> {
    try {
      const serviceResult: ServiceResultInterface = await this.ApiGatewaySrv.Get(
        await this.getAuthCode(req.headers['authorization']),
        req.url
      );
      return res.status(200).send(serviceResult);
    } catch (ex) {
      let exception: any;
      if (ex.status) {
        exception = ex.detail;
      }
      exception = ex;
      res.status(ex.status ? ex.status : 500).send(exception);
    }
  }

  @httpDelete('/*')
  public async Delete(req: express.Request, res: express.Response): Promise<any> {
    try {
      const serviceResult: ServiceResultInterface = await this.ApiGatewaySrv.Delete(
        await this.getAuthCode(req.headers['authorization']),
        req.url
      );
      return res.status(200).send(serviceResult);
    } catch (ex) {
      let exception: any;
      if (ex.status) {
        exception = ex.detail;
      }
      exception = ex;
      res.status(ex.status ? ex.status : 500).send(exception);
    }
  }

  private async getAuthCode(authorizationHeader: string): Promise<string> {
    try {
      if (authorizationHeader) {
        return authorizationHeader;
      }
      console.log(process.env.API_TOKEN, process.env.API_SECRET_KEY);
      return await this.generateToken(
        { token: process.env.API_TOKEN },
        process.env.API_SECRET_KEY,
        Number(process.env.API_TOKEN_DURATION_MS)
      );
    } catch (ex) {
      throw ex;
    }
  }

  private async generateToken(
    payload: any,
    secretKey: string,
    durationTimeIn_ms: number = null
  ) {
    try {
      if (durationTimeIn_ms) {
        return jwt.sign(payload, secretKey, {
          expiresIn: durationTimeIn_ms.toString()
        });
      }
      return jwt.sign(payload, secretKey);
    } catch (ex) {
      return ex.message;
    }
  }
}
