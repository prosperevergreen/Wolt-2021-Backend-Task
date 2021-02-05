import http from "http";
import * as reqUtils from "../utils/requestUtils";
import * as resUtils from "../utils/responseUtils";
import * as discoveryUtils from "../utils/discoveryUtils";
import Restaurant from "../model/Restaurant";
import Discovery from "../model/Discovery";
import Section from "../model/Section";
import restaurantsJson from "../restaurant.json";

/**
 * Handles route path - "/discovery"
 *
 * @param request - Client request sent from the browser
 * @param response - Server response to be sent to the client
 */
const discoveryHandler = (
	request: http.IncomingMessage,
	response: http.ServerResponse
): void => {
	const { url, method, headers } = request;

	if (method?.toUpperCase() === "GET") {

		// Verify client accepts JSON
		if (!reqUtils.acceptsJson(request))
			return resUtils.acceptTypeNotFound(response);

		// Verify url and header host exists
		if (!url || !headers.host) return resUtils.badRequest(response, "Bad URL");

		const userCoordinate = reqUtils.getQueryParams(url, headers.host);

		// Verify proper query params is provided
		if (!userCoordinate) return resUtils.badRequest(response, "Bad query params");

		const restaurants: Array<Restaurant> = restaurantsJson.restaurants.map(
			(restaurant) => ({ ...restaurant })
		);
		
		// Filter valid restauranst (distance < 1.5km from user) 
		const validRestaurants = discoveryUtils.filterByDistance(
			restaurants,
			userCoordinate
		);
		
		// Get popular restaurants list
		const popularRestaurants = discoveryUtils.popularRestaurants(
			validRestaurants
		);

		// Get new restaurants list
		const newRestaurants = discoveryUtils.newRestaurants(validRestaurants);

		// Get nearby restaurants list
		const nearbyRestaurants = discoveryUtils.nearbyRestaurant(
			validRestaurants,
			userCoordinate
		);
		
		const payload: Discovery = { sections: [] };
		
		// Optionally add sections to payload if they exist.

		if (popularRestaurants.length > 0) {
			const popular: Section = {
				title: "Popular Restaurants",
				restaurants: [...popularRestaurants],
			};
			payload.sections.push(popular);
		}

		if (newRestaurants.length > 0) {
			const latest: Section = {
				title: "New Restaurants",
				restaurants: [...newRestaurants],
			};
			payload.sections.push(latest);
		}

		if (nearbyRestaurants.length > 0) {
			const nearby: Section = {
				title: "Nearby Restaurants",
				restaurants: [...nearbyRestaurants],
			};
			payload.sections.push(nearby);
		}

		return resUtils.sendJson(response, payload );
	}

	resUtils.methodNotAllowed(response);
};

export default discoveryHandler;
