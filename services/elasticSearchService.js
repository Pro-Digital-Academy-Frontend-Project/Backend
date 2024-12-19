const { client } = require('../elasticSearch')

// 키워드 검색 함수
exports.searchKeywordsByES = async (keywordName) => {
    const response = await client.search({
        index: 'keywords',
        query: {
            wildcard: {
                keyword: {
                    value: `*${keywordName}*`
                },
            }
        },
        aggs: {
            grouped_keywords: {
                terms: {
                    field: 'keyword.keyword',
                    size: 10,
                    order: { "totalWeight" : "desc"}
                },
                aggs: {
                    totalWeight: {
                        sum: {
                            field: 'weight'
                        }
                    },
                    first_id: {
                        top_hits: {
                            size: 1,
                            _source: []
                        }
                    }
                }
            }
        },
        size: 0
    })

    const results = response.aggregations.grouped_keywords.buckets.map(bucket => ({
        keyword: bucket.key,
        totalWeight: bucket.totalWeight.value,
        id: bucket.first_id.hits.hits[0]._id
    }))

    console.log(results)
    return results
}

// 상위 키워드 반환
exports.topKeywordByES = async () => {
    const response = await client.search({
        index: 'keywords',
        query: {
            match_all: {}
        },
        aggs: {
            top_keyword: {
                terms: {
                    field: 'keyword.keyword',
                    size: 1,
                    order: {"totalWeight": "desc"}
                },
                aggs: {
                    totalWeight: {
                        sum: {
                            field: "weight"
                        }
                    },
                    first_id: {
                        top_hits: {
                            size: 1,
                            _source: []
                        }
                    }
                }
            }
        },
        size: 0
    })

    const topKeyword = response.aggregations.top_keyword.buckets[0];

    const result = [{
        keyword: topKeyword.key,
        keyword_id: topKeyword.first_id.hits.hits[0]._id,
        totalWeight: topKeyword.totalWeight.value, 
    }]
    return result;
}

// 전체 키워드 랭킹
exports.getTotalRankingByES = async () => {
    const response = await client.search({
        index: 'keywords',
        query: {
            match_all: {}
        },
        aggs: {
            keywordRankings: {
                terms: {
                    field: 'keyword.keyword',
                    size: 10,
                    order: {"totalWeight": "desc"}
                },
                aggs: {
                    totalWeight: {
                        sum: {
                            field: "weight"
                        }
                    },
                    first_id: {
                        top_hits: {
                            size: 1,
                            _source: []
                        }
                    }
                }
            }
        },
        size: 0
    });

    const results = response.aggregations.keywordRankings.buckets.map(bucket => ({
        keyword_id: bucket.first_id.hits.hits[0]._id,
        keyword: bucket.key,
        totalWeight: bucket.totalWeight.value,
    }));

    console.log(results);

    return results;
}
