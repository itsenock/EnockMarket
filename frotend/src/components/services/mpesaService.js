// services/mpesaService.js
import axios from 'axios';

const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';
const shortCode = 'YOUR_SHORT_CODE';
const passkey = 'YOUR_PASSKEY';
const lipaNaMpesaOnlineUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const authUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

const getToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
  const response = await axios.get(authUrl, {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  return response.data.access_token;
};

const lipaNaMpesaOnline = async (amount, phoneNumber, accountReference, transactionDesc) => {
  const token = await getToken();
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');

  const response = await axios.post(
    lipaNaMpesaOnlineUrl,
    {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: shortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: 'https://your-callback-url.com/callback',
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export { lipaNaMpesaOnline };
