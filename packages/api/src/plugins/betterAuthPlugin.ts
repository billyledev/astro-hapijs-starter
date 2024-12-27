import type Hapi from '@hapi/hapi';

import { getAuth } from '@/lib/auth';
import { toHapiHandler } from '@/lib/adapter/hapijs';

import { MailerPluginInfos } from '@/plugins/mailerPlugin';

interface BetterAuthPluginData {
  name: string;
  version: string;
}

const internals: BetterAuthPluginData = {
  name: 'app/better-auth',
  version: '1.0.0',
};

interface BetterAuthPluginOptions {}

const betterAuthPlugin: Hapi.Plugin<BetterAuthPluginOptions> = {
  name: internals.name,
  version: internals.version,
  dependencies: [MailerPluginInfos.name],
  register: async (server: Hapi.Server) => {
    const { sendEmail } = server.app;

    const auth = getAuth(sendEmail);
    server.app.auth = auth;

    server.route([
      {
        method: 'GET',
        path: '/auth/{any*}',
        handler: toHapiHandler(auth.handler),
      },
      {
        method: 'POST',
        path: '/auth/{any*}',
        handler: toHapiHandler(auth.handler),
        options: {
          payload: {
            output: 'stream',
            parse: false,
          },
        },
      },
    ]);
  },
};

export {
  internals as BetterAuthPluginInfos,
};

export default betterAuthPlugin;
