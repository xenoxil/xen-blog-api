const { join, dirname } = require('path');
const { fileURLToPath } = require('url');
const swaggerAutogen = require('swagger-autogen');

const _dirname = dirname(fileURLToPath(import.meta.url));

const doc = {
  // общая информация
  info: {
    title: 'xen-blog-api',
    description: 'Blog API',
  },
  // что-то типа моделей
  definitions: {
    // модель задачи
    Posts: {
      id: '1',
      date: '23.04.15',
      message: 'askjdfaksdlkfaklsdfkjkjszdkf',
    },
    // модель массива задач
    Posts: [
      {
        // ссылка на модель задачи
        $ref: '#/definitions/Posts',
      },
    ],
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
};

// путь и название генерируемого файла
const outputFile = join(_dirname, 'output.json');
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../server.js')];

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`);
});
