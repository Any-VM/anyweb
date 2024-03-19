import bareMux from "@mercuryworkshop/bare-mux";
const { SetTransport } = bareMux;
export default function changeTransport(transport: string, wisp: string) {
	switch (transport) {
		case "epoxy":
			localStorage.setItem("transport", "epoxy");
			console.log("Setting transport to Epoxy");
			SetTransport("EpxMod.EpoxyClient", { wisp });
			break;
		case "libcurl":
			localStorage.setItem("transport", "libcurl");
			console.log("Setting transport to Libcurl");
			SetTransport("CurlMod.LibcurlClient", {
				wisp,
				wasm: "https://cdn.jsdelivr.net/npm/libcurl.js@v0.5.2/libcurl.wasm",
			});
			break;
		default:
			SetTransport("CurlMod.LibcurlClient", {
				wisp,
				wasm: "/libcurl.wasm",
			});
			break;
	}
}
