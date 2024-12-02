const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

let newsList = [];
const BASE_URL = `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=%EA%B8%B0%EC%97%85+%EC%8B%A0%ED%95%9C%EC%A7%80%EC%A3%BC`;

// 뉴스를 가져오는 함수
const fetchNews = async () => {
    try {
        const res = await axios.get(BASE_URL);
        const $ = cheerio.load(res.data);
    
        // console.log(res.data);
    
        newsList = $('.group_news .bx')
          .map((i, elem) => {

            const newsCompanyThumbUrl = $(elem).find('.thumb_box img').prop('data-lazysrc');
            const newsCompany = $(elem).find('.info.press').text();
            const title = $(elem).find('.news_contents .news_tit').prop('title');
            const newsUrl = $(elem).find('.news_contents .dsc_thumb').prop('href');
            const newsThumbUrl = $(elem).find('.news_contents .thumb').prop('data-lazysrc');
    
            return {
                newsCompanyThumbUrl,
                newsCompany,
                title,
                newsUrl,
                newsThumbUrl,
            };
          })
          .get()
        
        if (newsList) console.log("뉴스 크롤링 성공.");
          
      } catch (err) {
        console.error('뉴스 크롤링에 실패했습니다.', err);
      }
};

// 현재 뉴스를 반환 함수
const getNews = () => newsList;

module.exports = { fetchNews, getNews }