import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator';
import { Enum } from '../util/decorators/enum';
import { OcpiResponse } from './ocpi.response';
import { Type } from 'class-transformer';

export enum ChargingProfileResultType {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  UNKNOWN = 'UNKNOWN',
}

export class ChargingProfileResult {
  @Enum(ChargingProfileResultType, 'ChargingProfileResultType')
  @IsNotEmpty()
  result!: ChargingProfileResultType;
}

export class ChargingProfileResultResponse extends OcpiResponse<ChargingProfileResult> {
  @IsObject()
  @IsNotEmpty()
  @Type(() => ChargingProfileResult)
  @ValidateNested()
  data!: ChargingProfileResult;
}
