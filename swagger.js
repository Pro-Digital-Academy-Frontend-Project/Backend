const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const options = {
  info: {
    title: 'Stockey API DOCS',
    description: 'Stockey API',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },
};
const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // Swagger 문서화할 라우터 파일 경로
swaggerAutogen(outputFile, endpointsFiles, options);

