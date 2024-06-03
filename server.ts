import { createRequestHandler } from "@remix-run/express";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { installGlobals } from "@remix-run/node";
import compression from "compression";
import express, { Request, Response } from "express";
import morgan from "morgan";
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net'; 
import wisp from 'wisp-server-node';

import path from 'path';

installGlobals();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
app.use('/service-worker.js', express.static(path.join(__dirname, '/app/public/service-worker.tsx')));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);
const server = createServer();
server.on("request", (req: Request, res: Response) => {
	app(req, res);
});
server.on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
	if (req.url && req.url.endsWith('/wisp/')) {
	  wisp.routeRequest(req, socket, head);
	}
});
server.listen(port, () => {
	console.log(`Express server started on http://localhost:${port}`);
});
