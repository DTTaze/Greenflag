import { ENV_KEY } from '@shared/constants';
import { SOCIAL_PROVIDER } from '@shared/enums';

export const SOCIAL_CONFIG = {
  [SOCIAL_PROVIDER.GOOGLE]: {
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v3/userinfo',
    clientId: ENV_KEY.GOOGLE_CLIENT_ID,
    clientSecret: ENV_KEY.GOOGLE_CLIENT_SECRET,
    redirectUri: ENV_KEY.GOOGLE_CALLBACK_URL,
    scope: ['email', 'profile'],
    responseType: 'code',
    extraParams: { access_type: 'offline' },
  },
};
