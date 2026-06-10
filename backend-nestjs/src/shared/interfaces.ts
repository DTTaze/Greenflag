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
  role: string;
  email?: string;
  fullName?: string;
  phoneNumber?: string;
  streak?: number;
  lastCompletedTask?: Date;
  avatarUrl?: string;
  googleId?: string;
  companyId?: string;
  status?: string;
  phone?: string;
}

export interface UserAuthSocialProfile {
  provider: string;
  providerUserId: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
  avatarUrl?: string;
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

export interface GHNConfig {
  token?: string;
  shop_id?: string;
}

export type DeliveryCarrierConfig = GHNConfig;
