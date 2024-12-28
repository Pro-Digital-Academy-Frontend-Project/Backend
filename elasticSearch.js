const { Client } = require('@elastic/elasticsearch');
const Keyword = require('./models/Keyword')
require('dotenv').config()

const client = new Client({
    node: `http://${process.env.ES_SERVER}:9200`
});

// 인덱스를 생성하는 함수 -> DB로 따지면 테이블 생성 + 컬럼
async function createIndex() {
    try {
        const exists = await client.indices.exists({ index: 'keywords'})
        if (!exists) {
            const response = await client.indices.create({
                index: 'keywords',
                body: {
                    settings: {
                        analysis: {
                            tokenizer: {
                                nori_tokenizer: {
                                    type: 'nori'
                                }
                            },
                            filter: {
                                nori_filter: {
                                    type: 'nori'
                                }
                            },
                            analyzer: {
                                nori_analyzer: {
                                    type: 'custom',
                                    tokenizer: 'nori_tokenizer',
                                    filter: ['nori_filter']
                                }
                            }
                        }
                    },
                    mappings: {
                        properties: {
                            keyword: {
                                type: 'text',
                                analyzer: 'nori_tokenizer'
                            },
                            weight: {type: 'float'},
                            stock_id: {type: 'long'}
                        }
                    }
                }
            })
            console.log("Elasticsearch 인덱스 생성 완료: ", response);
        } else {
            console.log("Elasticsearch 인덱스가 이미 존재합니다.")
        }
    } catch (error) {
        console.log("ElasticSearch 인덱스 생성 중 오류 발생: ", error.message)
    }
}

// 인덱싱하는 함수 -> DB로 따지면 테이블에 값을 주입
async function indexingKeywords() {
    const keywords = await Keyword.findAll();
    const BATCH_SIZE = 1000;
    const body = [];

    for (let i = 0; i < keywords.length; i++) {
        body.push({ index: {_index: 'keywords', _id: keywords[i].id}});
        body.push({stock_id: keywords[i].stock_id, keyword: keywords[i].keyword, weight: keywords[i].weight})

        if (body.length >= BATCH_SIZE * 2) {
            await sendBulkRequest(body);
            body.length = 0;
        }
    }

    if (body.length > 0) {
        await sendBulkRequest(body)
    }

    console.log("ElasticSearch 인덱싱 완료")
}

// bulk 요청을 보내는 함수
async function sendBulkRequest(body) {
    try {
        const response = await client.bulk({ body });

        const failedDocuments = response.items.filter(item => item.index.error);
        if (failedDocuments.length > 0) {
            console.log('실패한 문서:', failedDocuments);
        }
    } catch (error) {
        console.error("ElasticSearch 인덱싱 중 오류 발생:", error.message);
    }
}

async function init() {
    await createIndex();
    await indexingKeywords();
}

init();

module.exports = { 
    client,
    createIndex,
    indexingKeywords
};