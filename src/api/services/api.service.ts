import { injectable, inject } from 'inversify';

import { ServiceResultInterface } from '../interfaces/service-result.interface';
import { ApiServiceInterface } from '../interfaces/services';
import Axios, { Method } from 'axios';

@injectable()
export class ApiService implements ApiServiceInterface {
  public PerformAction = this.performAction;

  private async performAction(
    action: Method,
    url: string,
    headers: any,
    payload?: any
  ): Promise<ServiceResultInterface> {
    try {
      return (await ((await Axios({
        method: action,
        url,
        data: payload,
        headers: headers
      })) as any).data) as ServiceResultInterface;
    } catch (ex) {
      if (ex.response) {
        throw {
          detail: ex.response.data,
          status: ex.response.status
        };
      } else {
        throw ex.message;
      }
    }
  }
}
