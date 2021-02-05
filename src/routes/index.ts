import http from "http";
import * as reqUtils from "../utils/requestUtils";
import * as resUtils from "../utils/responseUtils";

import discoveryRouter from "./discoveryRoute";

/**
 * Handles route paths
 *
 * @param request - Client request sent from the browser
 * @param response - Server response to be sent to the client
 */
const routeHandler = (
	request: http.IncomingMessage,
	response: http.ServerResponse
): void => {
	const { url, headers } = request;
	const path = reqUtils.getURLPath(url, headers.host);
	if (!url || !headers.host) return resUtils.badRequest(response, "Bad URL");

	if (path === "/discovery") {
		discoveryRouter(request, response);
		return;
	}

	resUtils.notFound(response);
};

export default routeHandler;
