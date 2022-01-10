// Routes
import searchRoutes from '../../modules/search/routes.js';
import quizzRoutes from '../../modules/quizz/routes.js';

export default async (instance) => {
  instance.register(searchRoutes, { prefix: '/search' });
  instance.register(quizzRoutes, { prefix: '/quizz' });
  instance.all('*', async () => {
    throw instance.httpErrors.notFound(`this route doesn't exist`);
  });
};
