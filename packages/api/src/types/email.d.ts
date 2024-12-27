interface EmailParams {
  from: string;
  to: string;
  subject: string;
  message?: string;
  data?: {};
  template?: string;
  html?: string;
  text?: string;
}

export default EmailParams;
