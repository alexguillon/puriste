import plugin from 'fastify-plugin';

import routes from './modules/private.routes.js';

export default plugin(async (instance, config) => {
  instance.register(() => {
    instance.register(routes, config);
    return instance;
    }, 
    { prefix: '/api' },
  );
  return instance;
});
