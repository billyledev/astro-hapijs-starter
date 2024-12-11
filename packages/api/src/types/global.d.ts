import type Hapi from '@hapi/hapi';
import type Boom from '@hapi/boom';

declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;

    HOST: string;
    PORT: string;

    BASE_URL: string;

    MONGODB_URL: string;

    MAIL_HOST: string;
    MAIL_PORT: string;
    MAIL_USER: string;
    MAIL_PASS: string;

    NOREPLY_ADDR: string;

    BETTER_AUTH_SECRET: string;
  }
}

declare global {
  type APIResponse = Hapi.ResponseObject | Boom.Boom;
}
