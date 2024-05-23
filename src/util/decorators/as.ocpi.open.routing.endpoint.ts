// Copyright (c) 2023 S44, LLC
// Copyright Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache 2.0

import {HeaderParam, UseBefore} from 'routing-controllers';
import {ParamOptions} from 'routing-controllers/types/decorator-options/ParamOptions';
import {AuthMiddleware} from '../middleware/auth.middleware';
import {UniqueMessageIdsMiddleware} from "../middleware/unique.message.ids.middleware";
import {HttpHeader} from "@citrineos/base";
import {uniqueMessageIdHeaders} from "./as.ocpi.endpoint";

function applyHeaders(headers: { [key: string]: ParamOptions }) {
  return function (object: any, methodName: string) {
    for (const [key, options] of Object.entries(headers)) {
      HeaderParam(key, options)(object, methodName);
    }
    UseBefore(AuthMiddleware)(object, methodName);
    UseBefore(UniqueMessageIdsMiddleware)(object, methodName);
  };
}

/**
 * Decorator for to inject OCPI headers and apply {@link AuthMiddleware} and {@link UniqueMessageIdsMiddleware}
 * on the endpoint
 */
export const AsOcpiOpenRoutingEndpoint = function () {
  const headers: { [key: string]: ParamOptions } = {
    [HttpHeader.Authorization]: {required: true},
    ...uniqueMessageIdHeaders
  };
  return applyHeaders(headers);
};
