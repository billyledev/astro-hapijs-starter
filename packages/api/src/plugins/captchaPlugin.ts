import type Hapi from '@hapi/hapi';

import { StatusCodes } from 'http-status-codes';
import { createChallenge } from 'altcha-lib';

const HMAC_KEY = process.env.HMAC_KEY ?? '';

async function requestChallengeHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<APIResponse> {
  const challenge = await createChallenge({ hmacKey: HMAC_KEY });
  return h.response(challenge).code(StatusCodes.OK);
}

interface CaptchaPluginData {
  name: string;
  version: string;
}

const internals: CaptchaPluginData = {
  name: 'app/captcha',
  version: '1.0.0',
};

interface CaptchaPluginOptions {}

const captchaPlugin: Hapi.Plugin<CaptchaPluginOptions> = {
  name: internals.name,
  version: internals.version,
  dependencies: [],
  register: async (server: Hapi.Server) => {
    if (HMAC_KEY === '') {
      throw new Error('HMAC_KEY is empty');
    }

    server.route([
      {
        method: 'GET',
        path: '/challenge',
        handler: requestChallengeHandler,
      },
    ]);
  },
};

export {
  internals as CaptchaPluginInfos,
};

export default captchaPlugin;
