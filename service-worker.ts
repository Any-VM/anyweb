self.addEventListener("message", (event) => {
    console.log("Service Worker received message");
    if (event.data && event.data.type === "FETCH_URL") {
        const url = event.data.url;
        const newHeaders = new Headers();
        newHeaders.append("X-Original-URL", url);

        const newRequest = new Request("https://www.google.com", {
            method: "GET",
            headers: newHeaders,
            mode: "cors",
            credentials: "omit",
            redirect: "follow",
        });

        fetch(newRequest)
            .then((response) => {
                if (
                    response instanceof Response &&
                    typeof response.blob === "function"
                ) {
                    return response.blob().then((blob) => [blob, response]);
                } else {
                    throw new Error("Invalid response type");
                }
            })
            .then(([blob, response]) => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve([reader.result, response]);
                    reader.onerror = reject;
                    if (blob instanceof Blob) {
                        reader.readAsDataURL(blob);
                    } else {
                        reject(new Error("Expected Blob"));
                    }
                });
            })
            .then((value) => {
                if (Array.isArray(value) && value.length === 2) {
                    const [dataUrl, response] = value;
                    if (event.source) {
                        event.source.postMessage({
                            type: 'FETCH_RESPONSE',
                            url: url,
                            response: dataUrl,
                        });
                    }
                    return response;
                } else {
                    throw new Error("Unexpected value");
                }
            });
    }
});
