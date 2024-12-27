import type Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';

import { StatusCodes } from 'http-status-codes';
import { verifySolution } from 'altcha-lib';
import { encode } from 'html-entities';

import { MailerPluginInfos } from '@/plugins/mailerPlugin';

const HMAC_KEY = process.env.HMAC_KEY ?? '';
const NOREPLY_ADDR = process.env.NOREPLY_ADDR ?? '';
const CONTACT_ADDR = process.env.CONTACT_ADDR ?? '';

const SOLVED_CHALLENGES_BUF_SIZE = 10000;
const solvedChallenges: string[] = [];

enum Subject {
  infos = 'infos',
  enterprise = 'enterprise',
  issue = 'issue',
  other = 'other',
}

interface ContactInput {
  name: string;
  email: string;
  subject: Subject;
  message: string;
  validation: string;
}

async function contactHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<APIResponse> {
  const { sendEmail } = request.server.app;
  const {
    name,
    email,
    subject,
    message,
    validation,
  } = request.payload as ContactInput;
  const ip = request.headers['x-real-ip'];

  const encodedName = encode(name);
  const encodedMessage = encode(message);

  try {
    const decoded = JSON.parse(Buffer.from(validation, 'base64').toString());
    const { challenge } = decoded;

    if (solvedChallenges.includes(challenge)) {
      request.logger.warn(`Received solved challenge from ip ${ip}`);
      return Boom.badRequest('Challenge already solved');
    }

    const valid = await verifySolution(validation, HMAC_KEY);

    if (valid) {
      solvedChallenges.push(challenge);
      if (solvedChallenges.length > SOLVED_CHALLENGES_BUF_SIZE) {
        solvedChallenges.shift();
      }

      await sendEmail({
        from: NOREPLY_ADDR,
        to: CONTACT_ADDR,
        subject: 'Astro HapiJS starter contact form message',
        template: 'contact',
        data: {
          name: encodedName,
          email,
          subject,
          message: encodedMessage,
        },
      });

      request.logger.info(`Contact form message sent from ip ${ip}`);
      return h.response({}).code(StatusCodes.OK);
    }

    request.logger.warn(`Received invalid captcha from ip ${ip}`);
    return Boom.badRequest('Invalid captcha');
  } catch (err) {
    request.logger.error(err);
    return Boom.internal('Server error');
  }
}

interface ContactPluginData {
  name: string;
  version: string;
}

const internals: ContactPluginData = {
  name: 'app/contact',
  version: '1.0.0',
};

interface ContactPluginOptions {}

const contactPlugin: Hapi.Plugin<ContactPluginOptions> = {
  name: internals.name,
  version: internals.version,
  dependencies: [MailerPluginInfos.name],
  register: async (server: Hapi.Server) => {
    if (HMAC_KEY === '') {
      throw new Error('HMAC_KEY is empty!');
    }

    if (NOREPLY_ADDR === '') {
      throw new Error('NOREPLY_ADDR is empty!');
    }

    if (CONTACT_ADDR === '') {
      throw new Error('CONTACT_ADDR is empty!');
    }

    server.route([
      {
        method: 'POST',
        path: '/contact',
        handler: contactHandler,
        options: {
          validate: {
            payload: Joi.object({
              name: Joi.string().min(2).max(50).required(),
              email: Joi.string().email().required(),
              subject: Joi.string().valid(...Object.values(Subject)).required(),
              message: Joi.string().min(10).max(250).required(),
              validation: Joi.string().required(),
            }),
          },
        },
      },
    ]);
  },
};

export {
  internals as ContactPluginInfos,
};

export default contactPlugin;
