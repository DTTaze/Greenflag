import { Request } from 'express';
import { FindOptionsRelations, FindOptionsSelect, QueryRunner } from 'typeorm';

import {
  ENTITY_STATUS,
  PARTNER_AUTH_TYPE,
  PARTNER_DIRECTION,
  PARTNER_TYPE,
} from './constants';

export interface RunnerUser {
  alias: string;
  runner: QueryRunner;
}

export interface UserAuthProfile {
  id: string;
  username: string;
  companyId: string;
  role: string;
  status: ENTITY_STATUS;
  email?: string;
  phone?: string;
  bankAccountName?: string;
  isPassCodeSet?: boolean;
  isTwoFactorEnabled?: boolean;
}

export interface SystemUserAuthProfile {
  id: string;
  username: string;
  fullName: string;
  role: string;
  isSuperAdmin: boolean;
  isPassCodeSet?: boolean;
  isTwoFactorEnabled?: boolean;
}

export interface PartnerAuthProfile {
  id: string;
  name: string;
  direction: PARTNER_DIRECTION;
  type: PARTNER_TYPE;
  authType: PARTNER_AUTH_TYPE;
  status: ENTITY_STATUS;
  baseUrl: string;
}

export interface RequestContextData {
  systemUser?: SystemUserAuthProfile;
  user?: UserAuthProfile;
  partner?: PartnerAuthProfile;
  trace: string;
  span: string;
  parentSpan?: string;
}

export interface AppRequest extends Request {
  context: RequestContextData;
}

export interface FindOptions {
  select?: FindOptionsSelect<any>;
  relations?: FindOptionsRelations<any>;
  withDeleted?: boolean;
}
