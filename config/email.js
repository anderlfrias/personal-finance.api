// module.exports.email = {
//   service: 'Gmail',
//   auth: {
//     user: 'anderson.frias@cmsiglo21.com',
//     pass: 'cmsiglo21@031601'
//   },
//   templateDir: 'views/emailTemplates',
//   testMode: false,
//   ssl: true
// };
module.exports.email = {
  transporter: {
    host: 'webmail.cmsiglo21.com',
    port: 587,
    secure: false,
    auth: {
      user: 'anderson.frias@cmsiglo21.com',
      pass: 'cmsiglo21@031601'
    },
    tls: {
      rejectUnauthorized: false
    }
  },
  templateDir: 'views/emailTemplates',
  from: 'anderson.frias@cmsiglo21.com',
  testMode: false
};
