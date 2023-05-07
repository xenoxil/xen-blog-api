import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import swaggerAutogen from 'swagger-autogen';
const _dirname = dirname(fileURLToPath(import.meta.url));

const doc = {
  // общая информация
  info: {
    title: 'xen-blog-api',
    description: 'Blog API',
  },

  host: 'localhost:3000',
  schemes: ['http'],
};

// путь и название генерируемого файла
const outputFile = join(_dirname, 'output.json');
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../app.js')];

swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(({ success }) => {
  console.log(`Generated: ${success}`);
});
