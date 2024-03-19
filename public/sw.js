importScripts("/epoxy/index.js");
importScripts("/libcurl/index.cjs");
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");
importScripts("/localforage/localforage.min.js");
localforage.config({
	driver: localforage.INDEXEDDB,
	name: "anyweb",
	storeName: "__anyweb_config",
});
async function setUv() {
	try {
		const bare =
			(await localforage.getItem("__bserver")) ||
			location.origin + "/bend/";
		const proxyUrl = (await localforage.getItem("__hproxy")) || "";
		const [proxyIp, proxyPort] = proxyUrl.split(":");
		self.__uv$config.bare = bare;
		self.__uv$config.proxyPort = proxyPort;
		self.__uv$config.proxyIp = proxyIp;
		self.uv = new UVServiceWorker(self.__uv$config);
	} catch (error) {
		console.error(
			"\x1b[34;49;1m[AnyWeb] \x1B[31mERROR: Settings for Ultraviolet cannot be set (setUv)" +
				error,
		);
	}
}
self.addEventListener("fetch", (event) => {
	if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
		event.respondWith(
			(async () => {
				try {
					await setUv();
				} catch (error) {
					console.error(
						"\x1b[34;49;1m[AnyWeb] \x1B[31mERROR: Settings for Ultraviolet cannot be set (event.respondWith)" +
							error,
					);
				}
				return await self.uv.fetch(event);
			})(),
		);
	}
});
