import {getOcpiHeaders, } from './util';
import {BaseApi, OcpiModules} from './BaseApi';
import {CdrResponse} from '../model/Cdr';
import {GetCdrParams} from './param/cdrs/get.cdr.params';
import {PostCdrParams} from './param/cdrs/post.cdr.params';
import {IHeaders} from 'typed-rest-client/Interfaces';
import {NotFoundException} from '../exception/not.found.exception';

interface PostCdrResponseHeaders {
  Location: string;
}

export class CdrsControllerApi extends BaseApi {

  CONTROLLER_PATH = OcpiModules.Cdrs;

  async getCdr(
    params: GetCdrParams
  ): Promise<CdrResponse> {
    this.validateOcpiParams(params);
    const additionalHeaders: IHeaders = getOcpiHeaders(params);
    return await this.get<CdrResponse>({
      version: params.version,
      additionalHeaders
    });
  }

  async postCdr(
    params: PostCdrParams,
  ): Promise<string> {
    this.validateOcpiParams(params);
    this.validateRequiredParam(params, 'cdr');
    const additionalHeaders: IHeaders = getOcpiHeaders(params);
    const response = await this.createRaw<void>(this.getPath(params.version), params.cdr, {
      additionalHeaders
    });
    const headers = response.headers as PostCdrResponseHeaders;
    const cdrLocationUrl = headers.Location;
    if (!cdrLocationUrl) {
      throw new NotFoundException('No Location header in OCPI response');
    }
    return cdrLocationUrl;
  }
}
