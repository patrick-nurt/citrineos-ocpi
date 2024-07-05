import { LocationReferences } from './LocationReferences';
import { DisplayText } from './DisplayText';
import { OCPIToken } from './OCPIToken';
import { AuthorizationInfoAllowed } from './AuthorizationInfoAllowed';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Optional } from '../util/decorators/optional';
import { Enum } from '../util/decorators/enum';
import { OcpiResponse } from './ocpi.response';

export class AuthorizationInfo {
  @Enum(AuthorizationInfoAllowed, 'AuthorizationInfoAllowed')
  @IsNotEmpty()
  allowed!: AuthorizationInfoAllowed;

  @IsNotEmpty()
  @Type(() => OCPIToken)
  @ValidateNested()
  token!: OCPIToken;

  @IsString()
  authorizationReference!: string;

  @Optional()
  @Type(() => DisplayText)
  @ValidateNested()
  info?: DisplayText;

  @Optional()
  @Type(() => LocationReferences)
  @ValidateNested()
  location?: LocationReferences;
}

export class AuthorizationInfoResponse extends OcpiResponse<AuthorizationInfo> {
  @IsNotEmpty()
  @Type(() => AuthorizationInfo)
  @ValidateNested()
  data!: AuthorizationInfo;
}
