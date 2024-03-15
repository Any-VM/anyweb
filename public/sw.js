const swAllowedHostnames = ["localhost", "127.0.0.1", "10.0.0.1"];

async function registerSW() {
  const wispserver = `${window.location.origin.replace('https://', 'ws://')}/wisp` //await Filer.fs.promises.readFile()
  console.log(wispserver)
  if (
    location.protocol !== "https:" &&
    !swAllowedHostnames.includes(location.hostname)
  )
    throw new Error("Service workers cannot be registered without https.");

  if (!navigator.serviceWorker)
    throw new Error("Your browser doesn't support service workers.");

  await navigator.serviceWorker.register("/uv/sw.js", {
    scope: '/uv/service/',
  });
  await navigator.serviceWorker.register("anura-sw.js", {
    scope: '/',
  });
  console.log("UV Service Worker registered.");
  BareMux.registerRemoteListener(navigator.serviceWorker.controller);
  BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispserver });
}

registerSW();