const axios = require('axios');
const cheerio = require('cheerio');
const sequelize = require('sequelize')
require('dotenv').config();

const { Keyword } = require('../models') // 모든 모델을 가져옴

let newsList = [];

// 키워드 1위 가져오기
const getFirstRanking = async () => {
    try {
       const firstKeyword = await Keyword.findAll({
        attributes: [
          'keyword',
          [sequelize.fn('SUM', sequelize.col('weight')), 'totalWeight'],
        ],
        group: ['keyword'],
        order: [
          [sequelize.literal('totalWeight'), 'DESC'],
          ['keyword', 'ASC'],
        ],
        limit: 1, // 상위 1개 키워드
      })
      return firstKeyword;

    } catch (error) {
      console.error('키워드 랭킹 1위 조회 오류:', error)
    }
}

const BASE_URL = `https://search.naver.com/search.naver?ssc=tab.news.all&where=news&sm=tab_jum&query=`;


// 뉴스를 가져오는 함수
const fetchNews = async () => {
    try {
        const firstKeyword = await getFirstRanking();
        const res = await axios.get(`${BASE_URL+firstKeyword[0].dataValues.keyword.trim()}`);
        const $ = cheerio.load(res.data);
    
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