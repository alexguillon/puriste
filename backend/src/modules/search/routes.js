import { searchArtistRoute, searchTracksRoute } from "./methods.js";

export default async (instance) => {
    instance.route(searchArtistRoute(instance));
    instance.route(searchTracksRoute(instance));
};