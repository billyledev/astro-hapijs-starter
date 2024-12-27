import 'dotenv/config';
import 'dotenv-expand/config';

import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import HapiPino from 'hapi-pino';

import betterAuthPlugin from '@/plugins/betterAuthPlugin';
import mailerPlugin from '@/plugins/mailerPlugin';
import captchaPlugin from '@/plugins/captchaPlugin';
import contactPlugin from '@/plugins/contactPlugin';

const isProduction = process.env.NODE_ENV === 'production';
const FRONTEND_URL = process.env.FRONTEND_URL ?? '';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT ?? 3000,
  host: process.env.HOST ?? '0.0.0.0',
  routes: {
    cors: {
      origin: [FRONTEND_URL],
    },
    validate: {
      failAction: async (request, h, err) => {
        if (isProduction) {
          request.logger.error(`ValidationError: ${err?.message}`);
          throw Boom.badRequest('Invalid input');
        } else {
          request.logger.error(err);
          throw err ?? new Error('Unknown error');
        }
      },
    },
  },
});

export async function createServer(): Promise<Hapi.Server> {
  await server.register({
    plugin: HapiPino,
    options: {
      logEvents: process.env.TEST === 'true' ? false : undefined,
      redact: ['req.headers.authorization'],
      ...(isProduction ? {} : { transport: { target: 'pino-pretty' } }),
    },
  });

  await server.register([
    mailerPlugin,
    betterAuthPlugin,
    contactPlugin,
  ]);

  await server.register(captchaPlugin, {
    routes: {
      prefix: '/captcha',
    },
  });

  await server.initialize();
  return server;
}

export async function startServer(s: Hapi.Server): Promise<Hapi.Server> {
  await s.start();
  s.log('info', `Server running on ${s.info.uri}`);
  return s;
}

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});
