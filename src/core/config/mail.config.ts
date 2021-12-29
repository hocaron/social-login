import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => {
  return {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  };
});
