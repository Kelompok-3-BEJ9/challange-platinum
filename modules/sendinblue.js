const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();

async function sendEmail (to, details) {
  const { SENDINBLUE_EMAIL, SENDINBLUE_NAME, SENDINBLUE_APIKEY } = process.env;

  const sender = {
    email: SENDINBLUE_EMAIL,
    name: SENDINBLUE_NAME,
  };

  const receivers = [
    {
      email: to,
    },
  ];

  const smtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  smtpEmail.subject = details.subject;
  smtpEmail.htmlContent = details.htmlContent;
  smtpEmail.sender = sender;
  smtpEmail.to = receivers;

  const client = new SibApiV3Sdk.TransactionalEmailsApi();

  var defaultClient = SibApiV3Sdk.ApiClient.instance;
  var apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = SENDINBLUE_APIKEY;

  const resp = await client.sendTransacEmail(smtpEmail);
  console.log(resp);
};

module.exports = { sendEmail };
