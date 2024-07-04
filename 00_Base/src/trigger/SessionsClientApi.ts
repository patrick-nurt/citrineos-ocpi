import { GetSessionParams } from './param/sessions/get.session.params';
import { PatchSessionParams } from './param/sessions/patch.session.params';
import { PutSessionParams } from './param/sessions/put.session.params';
import { IHeaders } from 'typed-rest-client/Interfaces';
import { BaseClientApi } from './BaseClientApi';
import { OcpiResponse } from '../model/ocpi.response';
import { Session } from '../model/Session';
import { Service } from 'typedi';

@Service()
export class SessionsClientApi extends BaseClientApi {
  async getSession(params: GetSessionParams): Promise<OcpiResponse<Session>> {
    this.validateOcpiParams(params);
    this.validateRequiredParam(params, 'countryCode', 'partyId', 'sessionId');
    const additionalHeaders: IHeaders = this.getOcpiHeaders(params);
    return await this.get({
      version: params.version,
      path: '{countryCode}/{partyId}/{sessionId}'
        .replace('countryCode', encodeURIComponent(params.fromCountryCode))
        .replace('partyId', encodeURIComponent(params.fromPartyId))
        .replace('sessionId', encodeURIComponent(params.sessionId)),
      additionalHeaders,
    });
  }

  async patchSession(params: PatchSessionParams): Promise<OcpiResponse<void>> {
    this.validateOcpiParams(params);
    this.validateRequiredParam(
      params,
      'countryCode',
      'partyId',
      'sessionId',
      'requestBody',
    );
    const additionalHeaders: IHeaders = this.getOcpiHeaders(params);
    return await this.update<OcpiResponse<void>>(
      {
        version: params.version,
        path: '{countryCode}/{partyId}/{sessionId}'
          .replace('countryCode', encodeURIComponent(params.fromCountryCode))
          .replace('partyId', encodeURIComponent(params.fromPartyId))
          .replace('sessionId', encodeURIComponent(params.sessionId)),
        additionalHeaders,
      },
      params.requestBody,
    );
  }

  async putSession(params: PutSessionParams): Promise<OcpiResponse<void>> {
    this.validateOcpiParams(params);
    this.validateRequiredParam(
      params,
      'countryCode',
      'partyId',
      'sessionId',
      'session',
    );
    const additionalHeaders: IHeaders = this.getOcpiHeaders(params);
    return await this.update<OcpiResponse<void>>(
      {
        version: params.version,
        path: '{countryCode}/{partyId}/{sessionId}'
          .replace('countryCode', encodeURIComponent(params.fromCountryCode))
          .replace('partyId', encodeURIComponent(params.fromPartyId))
          .replace('sessionId', encodeURIComponent(params.sessionId)),
        additionalHeaders,
      },
      params.session,
    );
  }
}
