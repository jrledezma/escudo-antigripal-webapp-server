import { ServiceResultInterface } from '../service-result.interface';

export interface ApiGatewayServiceInterface {
  Post(
    authCode: string,
    payload: any,
    redirectTo: string,
    files?: any[]
  ): Promise<ServiceResultInterface>;
  Put(
    authCode: string,
    payload: any,
    redirectTo: string,
    files?: any[]
  ): Promise<ServiceResultInterface>;
  Get(authCode: string, redirectTo: string): Promise<ServiceResultInterface>;
  Delete(authCode: string, redirectTo: string): Promise<ServiceResultInterface>;
}
