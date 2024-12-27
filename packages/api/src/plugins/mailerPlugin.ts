import type Hapi from '@hapi/hapi';

import { sendEmail } from '@/utils/mailer';

interface MailerPluginData {
  name: string;
  version: string;
}

const internals: MailerPluginData = {
  name: 'mailer',
  version: '1.0.0',
};

interface MailerPluginOptions {}

const mailerPlugin: Hapi.Plugin<MailerPluginOptions> = {
  name: internals.name,
  version: internals.version,
  register: async (server: Hapi.Server) => {
    server.app.sendEmail = sendEmail;
  },
};

export {
  internals as MailerPluginInfos,
};

export default mailerPlugin;
