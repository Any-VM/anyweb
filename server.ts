import { createRequestHandler } from "@remix-run/express";
import { installGlobals } from "@remix-run/node";
import compression from "compression";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { createServer } from "http";
import { Socket, Head } from "ws";
import wisp from "wisp-server-node";


installGlobals();
const port = process.env.PORT || 3000;
const viteDevServer =
	process.env.NODE_ENV === "production"
		? undefined
		: await import("vite").then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			);

const remixHandler = createRequestHandler({
	build: viteDevServer
		? () => viteDevServer.ssrLoadModule("virtual:remix/server-build")
		: // eslint-disable-next-line
			// @ts-ignore
			// eslint-disable-next-line
			await import("./build/server/index.js"),
});

const app = express();
app.use(compression());
app.disable("x-powered-by");
// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	// Vite fingerprints its assets so we can cache forever.
	app.use(
		"/assets",
		express.static("build/client/assets", {
			immutable: true,
			maxAge: "1y",
		}),
	);
}

app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);
const server = createServer();
server.on("request", (req: Request, res: Response) => {
	app(req, res);
});
server.on("upgrade", (req: Request, socket: Socket, head: Head) => {
	if (req.url.endsWith("/wisp/")) {
		wisp.routeRequest(req, socket, head);
	}
});
server.listen(port, () => {
	console.log(`Express server started on http://localhost:${port}`);
});
