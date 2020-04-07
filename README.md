# AWS lambda SMTP & ReCAPTCHA
Might be helpfully on fast start SMTP mailing protected with Google ReCaptcha v3

Before sending mail, script verify `token` from POST params and then send a message

- copy `.env.dist` to `.env`
- fill your creds
- zip your project and upload it to AWS
