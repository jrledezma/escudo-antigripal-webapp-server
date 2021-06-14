import "reflect-metadata";
import { Container } from "inversify";
import { ApiTypes } from "./apiTypes"
import {
    ApiServiceInterface,
    ApiGatewayServiceInterface
} from './interfaces/services';
import {
    ApiService,
    ApiGatewayService
} from './services';

let ApiContainer = new Container();
ApiContainer.bind<ApiServiceInterface>(ApiTypes.apiService).to(ApiService);
ApiContainer.bind<ApiGatewayServiceInterface>(ApiTypes.apiGatewayService).to(ApiGatewayService);
export { ApiContainer }