const quizzController = require('../controllers/quizzController');

router.get('/ask', quizzController.question);
router.post('/answer', quizzController.answer);
router.post('/start', quizzController.start);

export default async (instance) => {
    instance.route(removeDemoRoute(instance));
    instance.register(adminRoutes);
};
