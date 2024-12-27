import path from 'path';
import fs from 'fs';

import nodemailer from 'nodemailer';
import { template } from 'lodash';

import type EmailParams from '@/types/email';

const MAIL_HOST = process.env.MAIL_HOST ?? '';
const MAIL_PORT = parseInt(process.env.MAIL_PORT ?? '587', 10);
const MAIL_USER = process.env.MAIL_USER ?? '';
const MAIL_PASS = process.env.MAIL_PASS ?? '';

if (MAIL_HOST === '') {
  throw new Error('MAIL_HOST is empty!');
}

if (MAIL_USER === '') {
  throw new Error('MAIL_USER is empty!');
}

if (MAIL_PASS === '') {
  throw new Error('MAIL_PASS is empty!');
}

const transporter = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

async function sendEmail(params: EmailParams) {
  if (!params.from || !params.to || !params.subject) {
    throw Error('Missing email source, destination and/or subject!');
  }

  const opts = params;

  if (opts.template) {
    const tPath = path.resolve('./emails/', opts.template);

    opts.html = template(fs.readFileSync(`${tPath}.html`, 'utf8'))(opts.data);
    opts.text = template(fs.readFileSync(`${tPath}.txt`, 'utf8'))(opts.data);

    if (opts.data) {
      delete opts.data;
    }

    delete opts.template;
  } else if (opts.message) {
    opts.text = template(opts.message)(opts.data);
    opts.html = opts.text;

    delete opts.message;
  } else {
    throw Error('No email content given!');
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(
      opts,
      (error, reply) => (error ? reject(error) : resolve(reply)),
    );
  });
}

export {
  sendEmail,
};

export default sendEmail;
