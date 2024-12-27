import type Hapi from '@hapi/hapi';
import type Boom from '@hapi/boom';
import { betterAuth } from 'better-auth';
import type EmailParams from '@/types/email';
import type { SentMessageInfo } from 'nodemailer';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;

      HOST: string;
      PORT: string;

      HMAC_KEY: string;

      MAIL_HOST: string;
      MAIL_PORT: string;
      MAIL_USER: string;
      MAIL_PASS: string;

      NOREPLY_ADDR: string;
      CONTACT_ADDR: string;

      FRONTEND_URL: string;
      BETTER_AUTH_SECRET: string;
    }
  }

  type APIResponse = Hapi.ResponseObject | Boom.Boom;

  type EmailSenderFunction = (params: EmailParams) => Promise<SentMessageInfo>;
}

declare module '@hapi/hapi' {
  interface ServerApplicationState {
    auth: ReturnType<typeof betterAuth>;
    sendEmail: EmailSenderFunction;
  }
}
