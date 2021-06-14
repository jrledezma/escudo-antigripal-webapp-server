import { injectable, inject } from 'inversify';
import { CommonFunctions } from '../common/commonFunctions';
import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ApiGatewayServiceInterface } from '../interfaces/services/api-gateway.service.interface';
import { MailInfoInterface } from '../interfaces/models/mailInfo';
import { ApiService } from './api.service';
import { ApiTypes } from '../apiTypes';
import { Method } from 'axios';
import * as FormData from 'form-data';

@injectable()
export class ApiGatewayService implements ApiGatewayServiceInterface {
  //#region Public Properties

  public Post = this.post;
  public Put = this.put;
  public Get = this.get;
  public Delete = this.delete;

  //#endregion

  protected apiSrv: ApiService;

  public constructor(@inject(ApiTypes.apiService) apiSrv: ApiService) {
    this.apiSrv = apiSrv;
  }

  /*headers: {
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
        'Authorization': process.env.S3_FILE_UPLOADER_AUTH_CODE
      },
      maxContentLength: Infinity */

  private async post(
    authCode: string,
    payload: any,
    redirectTo: string,
    files?: any[]
  ): Promise<ServiceResultInterface> {
    try {
      const url = `${process.env.BACKEND_API_URL}${redirectTo}`;
      console.log(url);
      if (files) {
        return await this.sendFormData(authCode, payload, files, 'POST', url);
      }
      return await this.apiSrv.PerformAction(
        'POST',
        url,
        {
          Authorization: authCode
        },
        payload
      );
    } catch (ex) {
      throw ex;
    }
  }

  private async put(
    authCode: string,
    payload: any,
    redirectTo: string,
    files?: any[]
  ): Promise<ServiceResultInterface> {
    try {
      const url = `${process.env.BACKEND_API_URL}${redirectTo}`;
      if (files) {
        return await this.sendFormData(authCode, payload, files, 'PUT', url);
      }
      return await this.apiSrv.PerformAction(
        'PUT',
        url,
        {
          Authorization: authCode
        },
        payload
      );
    } catch (ex) {
      throw ex;
    }
  }

  private async get(
    authCode: string,
    redirectTo: string
  ): Promise<ServiceResultInterface> {
    try {
      const url = `${process.env.BACKEND_API_URL}${redirectTo}`;
      console.log(url)
      return await this.apiSrv.PerformAction('GET', url, {
        Authorization: authCode
      });
    } catch (ex) {
      throw ex;
    }
  }

  private async delete(
    authCode: string,
    redirectTo: string
  ): Promise<ServiceResultInterface> {
    try {
      const url = `${process.env.BACKEND_API_URL}${redirectTo}`;
      return await this.apiSrv.PerformAction('DELETE', url, {
        Authorization: authCode
      });
    } catch (ex) {
      throw ex;
    }
  }

  private async sendFormData(
    authCode: string,
    payload: any,
    files: any[],
    actionToPerform: Method,
    url: string
  ): Promise<ServiceResultInterface> {
    let formData = new FormData();
    const payloadKeys = Object.keys(payload);
    payloadKeys.forEach((key: string) => {
      formData.append(key, JSON.stringify(payload[key]));
    });
    files.forEach(file => {
      formData.append('files', file.buffer, file.originalname);
    });
    return await this.apiSrv.PerformAction(
      actionToPerform,
      url,
      {
        Authorization: authCode,
        'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`
      },
      formData
    );
  }

  //#endregion
}
