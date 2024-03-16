import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";

import "./globals.css";

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        // todo: add dark mode
        <html lang="en" className="dark">
            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <script src="baremux/bare.cjs" defer></script>
                <script src="epoxy/index.js" defer></script>
                <script src="uv/uv.bundle.js" defer></script>
                <script src="uv/uv.config.js" defer></script>
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
