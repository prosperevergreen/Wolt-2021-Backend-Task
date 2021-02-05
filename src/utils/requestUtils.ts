import http from "http";
import Location from "../model/Location";


/**
 * Does the client accept JSON responses?
 *
 * @param {http.IncomingMessage} request - a http request
 * @returns {boolean} returns True if client accepts JSON
 */
const acceptsJson = (request: http.IncomingMessage): boolean => {
	const acceptType = request.headers["accept"];
	if (
		acceptType &&
		(acceptType.includes("application/json") || acceptType.includes("*/*"))
	) {
		return true;
	} else {
		return false;
	}
};


/**
 * Provides the Location object {longitude & latitude} or null from the url query params
 * 
 * @param url - relative URL
 * @param host - the base URL
 * 
 * @returns {Location | null}
 */
const getQueryParams = (url: string, host: string): Location | null => {
	const myURL = new URL(url, `http://${host}`);
	const lon = myURL.searchParams.get("lon");
	const lat = myURL.searchParams.get("lat");

	if (!lon || !lat) {
		return null;
	}

	const reqQueries: Location = {
		lon: Number(lon),
		lat: Number(lat),
	};

	return reqQueries;
};


/**
 * Provides the path of the request
 * 
 * @param url - relative URL
 * @param host - the base URL
 * 
 * @returns {Location | null}
 */
const getURLPath = (
	url: string | undefined,
	host: string | undefined
): string | null => {
	let reqPath: string | null = null;

	if (url && host) {
		const myURL = new URL(url, `http://${host}`);
		reqPath = myURL.pathname;
	}

	return reqPath;
};

export { acceptsJson, getQueryParams, getURLPath };
