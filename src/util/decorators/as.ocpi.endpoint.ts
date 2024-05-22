// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import {HeaderParam, UseBefore} from 'routing-controllers';
import {ParamOptions} from 'routing-controllers/types/decorator-options/ParamOptions';
import {AuthMiddleware} from '../middleware/auth.middleware';
import {OcpiHttpHeader} from '../ocpi.http.header';
import {OcpiHeaderMiddleware} from "../middleware/ocpi.header.middleware";

function applyHeaders(headers: { [key: string]: ParamOptions }) {
  return function (object: any, methodName: string) {
    for (const [key, options] of Object.entries(headers)) {
      HeaderParam(key, options)(object, methodName);
    }
    UseBefore(AuthMiddleware)(object, methodName);
    UseBefore(OcpiHeaderMiddleware)(object, methodName);
  };
}

/**
 * Decorator for to inject OCPI headers
 *
 */
export const AsOcpiEndpoint = function () {
  const headers: { [key: string]: ParamOptions } = {
    authorization: {required: true},
    [OcpiHttpHeader.OcpiFromCountryCode]: {required: true},
    [OcpiHttpHeader.OcpiFromPartyId]: {required: true},
    [OcpiHttpHeader.OcpiToCountryCode]: {required: true},
    [OcpiHttpHeader.OcpiToPartyId]: {required: true},
    [OcpiHttpHeader.XRequestId]: {required: false},
    [OcpiHttpHeader.XCorrelationId]: {required: false},
  };
  return applyHeaders(headers);
};
