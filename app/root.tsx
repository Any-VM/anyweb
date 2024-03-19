import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react";
import bareMux from "@mercuryworkshop/bare-mux";
const { registerRemoteListener } = bareMux;
import changeTransport from "@/lib/transport";
import { useEffect } from "react";
import "./globals.css";

export function Layout({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js", {
					scope: "/~/",
				})
				.then(() => {
					const wispUrl =
						(location.protocol === "https:" ? "wss://" : "ws://") +
						location.host +
						"/wisp/";
					registerRemoteListener(navigator.serviceWorker.controller);

					changeTransport(
						localStorage.getItem("transport") || "libcurl",
						localStorage.getItem("wispUrl") || wispUrl,
					);
				});
		}
	}, []);
	return (
		// todo: add dark mode
		<html lang="en" className="dark">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<script src="/baremux/bare.cjs" defer></script>
				<script src="/epoxy/index.js" defer></script>
				<script src="/uv/uv.bundle.js" defer></script>
				<script src="/uv/uv.config.js" defer></script>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
