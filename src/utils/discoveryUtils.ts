import Restaurant from "../model/Restaurant";
import Location from "../model/Location";

/**
 * Filters a list of restaurants by thier distance from user i.e < 1.5 kilometers
 *
 * @param restaurants - List(Array) of restaurants to be filtered.
 * @param lat - latitude of user
 * @param lon - longitude of user
 *
 * @returns {Array<Restaurant>}
 */
function filterByDistance(
	restaurants: Array<Restaurant>,
	location: Location
): Array<Restaurant> {
	const maxDist = 1.5;
	const filteredArr = restaurants.filter((restaurant) => {
		const dist = getDistanceFromLatLonInKm(
			restaurant.location[0],
			restaurant.location[1],
			location.lon,
			location.lat
		);
		return dist < maxDist;
	});
	return filteredArr;
}

/**
 * Converts degree to radian
 *
 * @param deg - Degree value to be converted to radian
 *
 * @returns {number}
 */
function deg2rad(deg: number): number {
	return deg * (Math.PI / 180);
}

/**
 * Calculates the distance between two Latitude/Longitude points
 *
 * @param lon1 - Longitude of point A
 * @param lat1 - Latitude of point A
 * @param lon2 - Longitude of point B
 * @param lat2 - Latitude of point B
 *
 * @returns {number}
 */
function getDistanceFromLatLonInKm(
	lon1: number,
	lat1: number,
	lon2: number,
	lat2: number
): number {
	const R = 6371e3; // metres
	const φ1 = deg2rad(lat1); // φ, λ in radians
	const φ2 = deg2rad(lat2);
	const Δφ = deg2rad(lat2 - lat1);
	const Δλ = deg2rad(lon2 - lon1);

	const a =
		Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
		Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	const d = R * c; // in metres
	return d / 1000; // in kilometres
}

/**
 * Filters open or closed restaurants from a list of restaurants
 *
 * @param restaurants - List(Array) of restaurants to be filtered.
 * @param state - Desired type of resturant to be filtered out.
 *
 * @returns {Array<Restaurant>}
 */
function filterByOrderState(
	restaurants: Array<Restaurant>,
	state: "online" | "offline"
): Array<Restaurant> {
	const value = state === "online" ? true : false;
	return restaurants.filter((restaurant) => {
		return restaurant.online === value;
	});
}

/**
 * Sorts a list of restaurants by their popularity (descending order)
 *
 * @param restaurants - List(Array) of restaurants to be sorted by popularity
 *
 * @returns {Array<Restaurant>} sorted list
 */
function sortByPopularity(restaurants: Array<Restaurant>): Array<Restaurant> {
	return restaurants.sort(
		(restaurant1, restaurant2) =>
			restaurant2.popularity - restaurant1.popularity
	);
}

/**
 * Provides a list(Array) of sorted restaurants (max 10) by their popularity.
 *
 * @param restaurants - restaurant list to be sorted.
 */
function popularRestaurants(restaurants: Array<Restaurant>): Array<Restaurant> {
	const openRest = filterByOrderState(restaurants, "online");
	const sortedOpenPopularRest = sortByPopularity(openRest);

	let popularRest = sortedOpenPopularRest;

	if (popularRest.length < 10) {
		const closeRest = filterByOrderState(restaurants, "offline");
		const sortedClosePopularRest = sortByPopularity(closeRest);
		popularRest = popularRest.concat(sortedClosePopularRest);
	}

	return popularRest.slice(0, 10);
}

/**
 * Sorts a list of restaurants by their distance from user (ascending order)
 *
 * @param restaurants - List(Array) of restaurants to be sorted.
 * @param location - user location (latitude and longitude)
 *
 * @returns {Array<Restaurant>}
 */
function sortByDistance(
	restaurants: Array<Restaurant>,
	location: Location
): Array<Restaurant> {
	return restaurants.sort((restaurant1, restaurant2) => {
		const d1 = getDistanceFromLatLonInKm(
			restaurant1.location[0],
			restaurant1.location[1],
			location.lon,
			location.lat
		);
		const d2 = getDistanceFromLatLonInKm(
			restaurant2.location[0],
			restaurant2.location[1],
			location.lon,
			location.lat
		);

		return d1 - d2;
	});
}

/**
 * Provides a list(Array) of sorted restaurants (max 10) by their distance from user.
 *
 * @param restaurants - restaurant list to be sorted.
 * @param location - user location (latitude and longitude)
 */
function nearbyRestaurant(
	validRestaurants: Array<Restaurant>,
	location: Location
) {
	const openRest = filterByOrderState(validRestaurants, "online");
	const sortedOpenNearRest = sortByDistance(openRest, location);

	let NearRest = sortedOpenNearRest;

	if (NearRest.length < 10) {
		const closeRest = filterByOrderState(validRestaurants, "offline");
		const sortedCloseNearRest = sortByDistance(closeRest, location);
		NearRest = NearRest.concat(sortedCloseNearRest);
	}

	return NearRest.slice(0, 10);
}

/**
 * Calculates the difference in years between two dates.
 *
 * @param d1 - Date 1
 * @param d2 - Date 2
 *
 * @returns {number}
 */
function yearsDiff(d1: number, d2: number): number {
	const date1 = new Date(d1);
	const date2 = new Date(d2);
	const yearsDiff = date2.getFullYear() - date1.getFullYear();
	return yearsDiff;
}

/**
 * Calculates the difference in months between two dates.
 *
 * @param d1 - Date 1
 * @param d2 - Date 2
 *
 * @returns {number}
 */
function monthsDiff(d1: number, d2: number): number {
	const date1 = new Date(d1);
	const date2 = new Date(d2);
	const years = yearsDiff(d1, d2);
	const months = years * 12 + (date2.getMonth() - date1.getMonth());
	return months;
}

/**
 * Filters a list of restaurants by their open date  i.e <= 4 months.
 *
 * @param restaurants - List of restaurants to be filtered
 *
 * @returns {Array<Restaurant>}
 */
function filterByDate(restaurants: Array<Restaurant>): Array<Restaurant> {
	const d1 = Date.now();
	return restaurants.filter((restaurant) => {
		const launchYMD = restaurant.launch_date.split("-");
		const d2 = new Date(
			Number(launchYMD[0]),
			Number(launchYMD[1]),
			Number(launchYMD[2])
		).getTime();

		return monthsDiff(d1, d2) <= 4;
	});
}

/**
 * Sorts a list(Array) of restaurants by their opening date (newest first).
 *
 * @param restaurants - List of restaurants to be sorted
 *
 * @returns {Array<Restaurant>}
 */
function sortByDate(restaurants: Array<Restaurant>): Array<Restaurant> {
	return restaurants.sort((restuarant1, restaurant2) => {
		const launchYMD1 = restuarant1.launch_date.split("-");
		const launchYMD2 = restaurant2.launch_date.split("-");
		const d1 = new Date(
			Number(launchYMD1[0]),
			Number(launchYMD1[1]),
			Number(launchYMD1[2])
		).getTime();

		const d2 = new Date(
			Number(launchYMD2[0]),
			Number(launchYMD2[1]),
			Number(launchYMD2[2])
		).getTime();

		return d2 - d1;
	});
}

/**
 * Provides a list(Array) of sorted restaurants (max 10) by opening date (newest first).
 *
 * @param restaurants - List of restaurants to be sorted
 *
 * @returns {Array<Restaurant>}
 */
function newRestaurants(restaurants: Array<Restaurant>): Array<Restaurant> {
	const filteredNewRest = filterByDate(restaurants);
	const openRest = filterByOrderState(filteredNewRest, "online");
	const sortedOpenNewRest = sortByDate(openRest);

	let newRest = sortedOpenNewRest;

	if (newRest.length < 10) {
		const closeNewRest = filterByOrderState(newRest, "offline");
		const sortedCloseNewRest = sortByDate(closeNewRest);
		newRest = newRest.concat(sortedCloseNewRest);
	}

	return newRest.slice(0, 10);
}

export {
	filterByDistance,
	popularRestaurants,
	nearbyRestaurant,
	newRestaurants,
};
