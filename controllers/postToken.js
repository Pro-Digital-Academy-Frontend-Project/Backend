const axios = require('axios');
require('dotenv').config();

exports.postToken = async (req, res) => {
  try {
    const baseUrl = 'https://openapivts.koreainvestment.com:29443/oauth2/tokenP';

    const bodyData = {
      grant_type: 'client_credentials',
      appkey: process.env.APP_KEY,
      appsecret: process.env.APP_SECRET,
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    const resp = await axios.post(baseUrl, bodyData, { headers });

    console.log(resp.data);

    const data = resp.data;

    if (!data || !data.access_token) {
      return res.status(500).json({ error: '토큰 조회에 실패했습니다.' });
    }

    const token = {
      token: data.access_token,
      expires_in: data.expires_in,
      expired_at: data.access_token_token_expired,
    };

    res.json(token);
  } catch (error) {
    console.error('API 호출 중 오류 발생:', error.response?.data || error.message);
    res.status(500).json({ error: 'API 호출 중 오류가 발생했습니다.' });
  }
};
