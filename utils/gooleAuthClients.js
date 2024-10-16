const { google } = require("googleapis");
const path = require("path");

const accountId = "383084767";

const keyFile = path.join("service-account.json"); // Ensure correct path
const rtbAuth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/realtime-bidding"],
});
const adxAuth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/adexchangebuyer"],
});

// Get the auth client
const rtb = async () => {
  const rtbClient = await rtbAuth.getClient();
  return google.realtimebidding({
    version: "v1",
    auth: rtbClient,
  });
};
const adx = async () => {
  const adxClient = await adxAuth.getClient();
  return google.adexchangebuyer2({
    version: "v2beta1",
    auth: adxClient,
  });
};

module.exports = { rtb, adx, accountId };
