const axios = require('axios');
require('dotenv').config();

// let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0b2tlbiIsImF1ZCI6ImM0MWIzMzEyLTg0MTMtNDZmZi1hYzM1LWI2NTRhYjYyZDQ2MSIsInByZHRfY2QiOiIiLCJpc3MiOiJ1bm9ndyIsImV4cCI6MTczNDY1MDM5MiwiaWF0IjoxNzM0NTYzOTkyLCJqdGkiOiJQU0lvaXVTUDAyNU40VkpRMzBzWm96eE5sS0hOaFFPV2RzNGEifQ.HtjY5ic4vOsiAORnk6CYsuTvKy9OZu7DBdl9PoEPoML0bHH2CLDuYK2nUi6J2_u2E7V6zXISn4CqckVkBaMRvA"
let token = null;

// 토큰을 갱신하는 함수
const renewToken = async () => {
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
        
        const response = await axios.post(baseUrl, bodyData, { headers });

        if (response.data && response.data.access_token) {
            token = response.data.access_token;
            console.log('토큰 갱신 성공:', token);
        } else {
            throw new Error('토큰 데이터가 유효하지 않습니다.');
        }
       
    } catch (error) {
        console.error('토큰 갱신 중 오류 발생:', error.message);
        throw error;
    }
};

// 현재 토큰 반환 함수
const getToken = () => token;

module.exports = { renewToken, getToken }
// module.exports = {getToken}