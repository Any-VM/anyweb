import { RemixBrowser } from "@remix-run/react";
import React from "react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js')
	  .then((registration) => {
		console.log('Service Worker registered with scope:', registration.scope);
	  })
	  .catch((err) => {
		console.log('Service Worker registration failed:', err);
	  });
  }
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>,
  );
});