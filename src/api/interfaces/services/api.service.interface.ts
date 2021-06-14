import { ServiceResultInterface } from "../service-result.interface";

export interface ApiServiceInterface {
    PerformAction(url: string, action: string, headers: any, payload: any): Promise<ServiceResultInterface>;
}