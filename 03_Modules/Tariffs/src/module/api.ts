// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import { ITariffsModuleApi } from './interface';

import {
  JsonController,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete
} from 'routing-controllers';

import { HttpStatus } from '@citrineos/base';
import {
  AsOcpiFunctionalEndpoint,
  BaseController,
  FunctionalEndpointParams,
  generateMockOcpiResponse,
  ModuleId,
  OcpiEmptyResponse,
  OcpiHeaders,
  OcpiResponse,
  OcpiResponseStatusCode,
  Paginated,
  PaginatedParams,
  PaginatedTariffResponse,
  ResponseSchema,
  TariffKey,
  TariffsBroadcaster,
  TariffsService,
  versionIdParam,
  VersionNumber,
  VersionNumberParam,
} from '@citrineos/ocpi-base';

import { Service } from 'typedi';
import { TariffDTO } from '@citrineos/ocpi-base/dist/model/DTO/TariffDTO';
import { buildOcpiResponse } from '@citrineos/ocpi-base/dist/model/ocpi.response';
import { buildOcpiErrorResponse, OcpiErrorResponse } from '@citrineos/ocpi-base/dist/model/ocpi.error.response';
import { AdminTariffDTO } from '@citrineos/ocpi-base/dist/model/DTO/AdminTariffDTO';

@Service()
@JsonController(`/:${versionIdParam}/${ModuleId.Tariffs}`)
export class TariffsModuleApi
  extends BaseController
  implements ITariffsModuleApi
{
  constructor(
    readonly tariffService: TariffsService,
    readonly tariffsPublisher: TariffsBroadcaster,
  ) {
    super();
  }

  @Get()
  @AsOcpiFunctionalEndpoint()
  @ResponseSchema(PaginatedTariffResponse, {
    statusCode: HttpStatus.OK,
    description: 'Successful response',
    examples: {
      success: generateMockOcpiResponse(OcpiResponse<PaginatedTariffResponse>),
    },
  })
  async getTariffs(
    @VersionNumberParam() version: VersionNumber,
    @FunctionalEndpointParams() ocpiHeaders: OcpiHeaders,
    @Paginated() paginationParams?: PaginatedParams,
  ): Promise<PaginatedTariffResponse> {
    console.log(
      `GET /tariffs ${JSON.stringify(paginationParams)}, ${JSON.stringify(ocpiHeaders)}`,
    );
    const { data, count } = await this.tariffService.getTariffs(
      ocpiHeaders,
      paginationParams,
    );

    return {
      data: data,
      total: count,
      offset: paginationParams?.offset,
      limit: paginationParams?.limit,
      status_code: OcpiResponseStatusCode.GenericSuccessCode,
      timestamp: new Date(),
    };
  }

  // TODO: auth & reorganize
  @Post(`/tariff-broadcasts`)
  async broadcastTariff(
    @Body()
    broadcastRequest: TariffKey & {
      eventType: 'created' | 'updated' | 'deleted';
    },
  ): Promise<void> {
    console.log(`POST /tariff-broadcasts ${JSON.stringify(broadcastRequest)}`);

    switch (broadcastRequest.eventType) {
      case 'deleted':
        return this.tariffsPublisher.broadcastDeletionByKey(broadcastRequest);
      case 'updated':
        return this.tariffsPublisher.broadcastByKey(broadcastRequest);
      case 'created':
        return this.tariffsPublisher.broadcastByKey(broadcastRequest);
      default:
        throw new Error(`Unsupported event type ${broadcastRequest.eventType}`);
    }
  }

  /**
   * Admin Endpoints
   */

  @Post('/')
  async createTariff(
    @Body() tariffDto: AdminTariffDTO
  ): Promise<OcpiEmptyResponse> {
    await this.tariffService.createTariff(tariffDto);
    return OcpiEmptyResponse.build(OcpiResponseStatusCode.GenericSuccessCode);
  }

  @Put('/:tariffId')
  async updateTariff(
    @Param('tariffId') tariffId: number,
    @Body() tariffDto: AdminTariffDTO
  ): Promise<OcpiEmptyResponse | OcpiErrorResponse> {
    if (!tariffId) {
      return buildOcpiErrorResponse(OcpiResponseStatusCode.ClientInvalidOrMissingParameters, 'No tariff id provided');
    }

    await this.tariffService.updateTariff(tariffDto);
    return OcpiEmptyResponse.build(OcpiResponseStatusCode.GenericSuccessCode);
  }

  @Delete('/:tariffId')
  async deleteTariff(
    @Param('tariffId') tariffId: number
  ): Promise<OcpiEmptyResponse | OcpiErrorResponse> {
    if (!tariffId) {
      return buildOcpiErrorResponse(OcpiResponseStatusCode.ClientInvalidOrMissingParameters, 'No tariff id provided');
    }

    await this.tariffService.deleteTariff(tariffId);
    return OcpiEmptyResponse.build(OcpiResponseStatusCode.GenericSuccessCode);
  }
}
