import { startQuizzRoute, askQuizzRoute, answerQuizzRoute } from "./methods.js";

export default async (instance) => {
    instance.route(startQuizzRoute(instance));
    instance.route(askQuizzRoute(instance));
    instance.route(answerQuizzRoute(instance));
};