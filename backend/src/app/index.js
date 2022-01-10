import dotenv from 'dotenv';
dotenv.config();
import fastify from 'fastify';
import plugins from '../plugins/index.js';
import routes from '../routes/index.js';

export default () => {
    const app = fastify({
        ignoreTrailingSlash: true,
        disableRequestLogging: true,
    });
    app.register(plugins);
    app.register(routes);
      
  return app;
};