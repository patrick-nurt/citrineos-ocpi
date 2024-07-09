import {
  IsDateString,
  IsNotEmpty,
  IsObject,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { OcpiToken } from './OcpiToken';
import { Type } from 'class-transformer';
import { Optional } from '../util/decorators/optional';
import { ResponseUrl } from './ResponseUrl';

export class ReserveNow extends ResponseUrl {
  @IsObject()
  @IsNotEmpty()
  @Type(() => OcpiToken)
  @ValidateNested()
  token!: OcpiToken;

  @IsString()
  @IsDateString()
  @IsNotEmpty()
  @Type(() => Date)
  expiry_date!: Date;

  @MaxLength(36)
  @IsString()
  @IsNotEmpty()
  reservation_id!: string;

  @MaxLength(36)
  @IsString()
  @IsNotEmpty()
  location_id!: string;

  @MaxLength(36)
  @IsString()
  @Optional()
  evse_uid?: string | null;

  @MaxLength(36)
  @IsString()
  @Optional()
  authorization_reference?: string | null;
}
