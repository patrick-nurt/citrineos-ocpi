import {OcpiParams} from './util/ocpi.params';
import {IRequestOptions, IRestResponse, RestClient} from 'typed-rest-client';
import {UnsuccessfulRequestException} from '../exception/unsuccessful.request.exception';
import {VersionNumber} from '../model/VersionNumber';
import {IRequestQueryParams} from 'typed-rest-client/Interfaces';

export enum OcpiModules {
  Credentials = 'credentials',
  Cdrs = 'cdrs',
  Tariffs = 'tariffs',
  ChargingProfiles = 'chargingprofiles',
  Commands = 'commands',
  Locations = 'locations',
  Sessions = 'sessions',
  Versions = 'versions',
  Tokens = 'tokens',
}

export class MissingRequiredParamException extends Error {
  override name = 'MissingRequiredParamException' as const;

  constructor(
    public field: string,
    msg?: string,
  ) {
    super(msg);
  }
}

export interface TriggerRequestOptions extends IRequestOptions {
  version: VersionNumber;
  path?: string;
}

export class BaseApi {

  CONTROLLER_PATH = 'null';
  private restClient: RestClient;

  constructor(readonly baseUrl: string = 'http://localhost:3000') {
    this.restClient = new RestClient('CitrineOS OCPI', baseUrl);
  }

  async optionsRaw<T>(url: string, options?: IRequestOptions): Promise<IRestResponse<T>> {
    return this.restClient.options<T>(url, options);
  }

  async options<T>(options: TriggerRequestOptions): Promise<T> {
    return this.optionsRaw<T>(this.getPath(options!.version!, options!.path!), options)
      .then((response) => this.handleResponse<T>(response));
  }

  async getRaw<T>(url: string, options?: IRequestOptions): Promise<IRestResponse<T>> {
    return this.restClient.get<T>(url, options);
  }

  async get<T>(options: TriggerRequestOptions): Promise<T> {
    return this.getRaw<T>(this.getPath(options!.version!, options!.path!), options)
      .then((response) => this.handleResponse<T>(response));
  }

  async delRaw<T>(url: string, options?: IRequestOptions): Promise<IRestResponse<T>> {
    return this.restClient.del<T>(url, options);
  }


  async del<T>(options: TriggerRequestOptions): Promise<T> {
    return this.delRaw<T>(this.getPath(options!.version!, options!.path!), options)
      .then((response) => this.handleResponse<T>(response));
  }

  async createRaw<T>(url: string, body: any, options?: IRequestOptions): Promise<IRestResponse<T>> {
    return this.restClient.create<T>(url, body, options);
  }

  async create<T>(options: TriggerRequestOptions, body: any): Promise<T> {
    return this.createRaw<T>(this.getPath(options!.version!, options!.path!), body, options)
      .then((response) => this.handleResponse<T>(response));
  }

  async updateRaw<T>(url: string, body: any, options?: IRequestOptions): Promise<IRestResponse<T>> {
    return this.restClient.update<T>(url, body, options);
  }

  async update<T>(options: TriggerRequestOptions, body: any): Promise<T> {
    return this.updateRaw<T>(this.getPath(options!.version!, options!.path!), body, options)
      .then((response) => this.handleResponse<T>(response));
  }

  async replaceRaw<T>(url: string, body: any, options?: IRequestOptions): Promise<IRestResponse<T>> {
    return this.restClient.replace<T>(url, body, options);
  }

  async replace<T>(options: TriggerRequestOptions, body: any): Promise<T> {
    return this.replaceRaw<T>(this.getPath(options!.version!, options!.path!), body, options)
      .then((response) => this.handleResponse<T>(response));
  }

  validateRequiredParam(
    params: any,
    ...paramNameList: string[]
  ) {
    for (let i = 0; i < paramNameList.length; i++) {
      const paramName = paramNameList[i];
      if (!(params as any)[paramName]) {
        throw new MissingRequiredParamException(
          paramName,
          this.getRequiredParametersErrorMsgString(paramName)
        );
      }
    }
  }

  validateOcpiParams(
    params: OcpiParams,
  ) {
    if (!params.fromCountryCode || !params.fromCountryCode.length || params.fromCountryCode.length !== 2) {
      throw new MissingRequiredParamException(
        params.fromCountryCode,
        'Required parameter fromCountryCode must be a 2 character string',
      );
    }
    if (!params.toCountryCode || !params.toCountryCode.length || params.toCountryCode.length !== 2) {
      throw new MissingRequiredParamException(
        params.toCountryCode,
        'Required parameter toCountryCode must be a 2 character string',
      );
    }
    if (!params.fromPartyId || !params.fromPartyId.length || params.fromPartyId.length !== 3) {
      throw new MissingRequiredParamException(
        params.fromPartyId,
        'Required parameter fromPartyId must be a 3 character string',
      );
    }
    if (!params.toPartyId || !params.toPartyId.length || params.toPartyId.length !== 3) {
      throw new MissingRequiredParamException(
        params.toPartyId,
        'Required parameter toPartyId must be a 3 character string',
      );
    }
  }

  getRequiredParametersErrorMsgString(...params: string[]): string {
    return `Required parameters [${params.join(',')}] are null or undefined`;
  }

  protected getPathForVersion(version: VersionNumber) {
    return `/ocpi/${version}/${this.CONTROLLER_PATH}`;
  }

  protected getBasePath(params: OcpiParams) {
    return this.getPathForVersion(params.version);
  }

  protected getPath(version: VersionNumber, path: string = '') {
    return `${this.getPathForVersion(version)}/${path}`;
  }

  protected newQueryParams(): IRequestQueryParams {
    return {
      options: {},
      params: {}
    };
  }

  protected handleResponse<T>(response: IRestResponse<T>): T {
    if (response.statusCode >= 200 && response.statusCode <= 299) {
      return response.result as T;
    } else {
      throw new UnsuccessfulRequestException('Request did not return a successful status code', response);
    }
  }
}
