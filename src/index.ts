import http from "http";
import handleRequest from "./routes/index";

// Set server port
const PORT = process.env.PORT || 3000;

// Creates server
const server = http.createServer(handleRequest);

// Server error listener
server.on("error", (err) => {
	console.error(err);
	server.close();
});

// Close server
server.on("close", () => console.log("Server closed."));

// Server starts listening
server.listen(PORT, () => {
	console.log(`Listening on ports: ${PORT}`);
});
