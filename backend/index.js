import dotenv from 'dotenv';

import fastify from 'fastify';
import plugins from './plugins/index.js';

const app = fastify({
  ignoreTrailingSlash: true,
  disableRequestLogging: true,
});

dotenv.config();

app.register(plugins);

// Declare a route
app.get('/', function (request, reply) {
  reply.send({ hello: 'world' })
})


const start = async () => {
  try {
    console.log(process.env.PORT);
    await app.listen(process.env.PORT, process.env.LOCALHOST);
  } catch (err) {
    console.log(err);
    app.log.error(err);
    process.exit(1);
  }
}
start();