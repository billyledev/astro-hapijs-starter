import { betterAuth, type BetterAuthOptions } from 'better-auth';
import Database from 'better-sqlite3';
import { encode } from 'html-entities';

const FRONTEND_URL = process.env.FRONTEND_URL ?? '';
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? '';
const NOREPLY_ADDR = process.env.NOREPLY_ADDR ?? '';

if (FRONTEND_URL === '') {
  throw new Error('FRONTEND_URL is empty!');
}

if (BETTER_AUTH_SECRET === '') {
  throw new Error('BETTER_AUTH_SECRET is empty!');
}

if (NOREPLY_ADDR === '') {
  throw new Error('NOREPLY_ADDR is empty!');
}

const baseOptions: BetterAuthOptions = {
  appName: 'Astro HapiJS starter',
  database: new Database('./auth.db'),
  baseURL: FRONTEND_URL,
  basePath: '/auth',
  trustedOrigins: [
    FRONTEND_URL,
  ],
  secret: BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
};

const getAuth = (sendEmail: EmailSenderFunction): ReturnType<typeof betterAuth> => {
  const options: BetterAuthOptions = {};

  Object.assign(options, baseOptions);
  options.emailVerification = {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const name = encode(user.name, { level: 'xml' });
      sendEmail({
        from: NOREPLY_ADDR,
        to: user.email,
        subject: 'Astro HapiJS starter account verification',
        template: 'welcome',
        data: {
          name,
          link: url,
        },
      });
    },
  };

  return betterAuth(options);
};

const auth = betterAuth(baseOptions);

export {
  auth,
  getAuth,
};
