import http from "http";


/**
 * Sends JSON in response to client.
 *
 * @param {http.ServerResponse} response - a http response
 * @param {Object} payload - content
 * @param {number} code - status code
 * 
 * @returns {void}
 */
const sendJson = (
	response: http.ServerResponse,
	payload: object,
	code: number = 200
): void => {
	response.writeHead(code, { "Content-Type": "application/json" });
	response.end(JSON.stringify(payload));
};

/**
 * Responds to a bad request.
 *
 * @param {http.ServerResponse} response - a http response
 * @param {string} errorMsg - an error message
 *
 * @returns {void} sent response
 */
const badRequest = (response: http.ServerResponse, errorMsg: string): void => {
	if (errorMsg) return sendJson(response, { error: errorMsg }, 400);

	response.statusCode = 400;
	response.end();
};


/**
 * Responds when the resourse requested is not found.
 *
 * @param {object} response - a http response
 *
 * @returns {void} sent response
 */
const notFound = (response: http.ServerResponse): void => {
	response.statusCode = 404;
	response.end();
};

/**
 * Responds when the request method is not allowed.
 *
 * @param {object} response - a http response
 *
 * @returns {void} sent response
 */
const methodNotAllowed = (response: http.ServerResponse): void => {
	response.statusCode = 405;
	response.end();
};

/**
 * Responds when the request Accept-Type is not supported.
 *
 * @param {http.ServerResponse} response - a http response
 *
 * @returns {void} sent response
 */
const acceptTypeNotFound = (response: http.ServerResponse): void => {
	response.statusCode = 406;
	response.end();
};


export {
	sendJson,
	badRequest,
	notFound,
	methodNotAllowed,
	acceptTypeNotFound,
};
