self.addEventListener("message", (event) => {
    console.log("Service Worker received message", event.data);
    if (event.data && event.data.type === "FETCH_URL") {
        const url = event.data.url;
        console.log("URL to fetch:", url);
        const newHeaders = new Headers();
        newHeaders.append("X-Original-URL", url);

        const newRequest = new Request("http://example.com", {
            method: "GET",
            headers: newHeaders,
            mode: "cors",
            credentials: "omit",
            redirect: "follow",
        });

        console.log("Created new request:", newRequest);
        console.log("headers", newHeaders)
        return fetch(newRequest)
            .then((response) => {
                console.log("Received response:", response);
                if (
                    response instanceof Response &&
                    typeof response.blob === "function"
                ) {
                    return response.blob().then((blob) => {
                        console.log("Received blob:", blob);
                        return [blob, response] as [Blob, Response];
                    });
                } else {
                    throw new Error("Invalid response type");
                }
            })
            .catch((error) => {
                console.error("Error fetching URL:", error);
                if (event.source) {
                    event.source.postMessage({
                        type: 'FETCH_ERROR',
                        url: url,
                        error: error.message,
                    });
                    console.log("Posted error to source");
                }
                throw error;  
            })
            .then(([blob, response]) => {
                return new Promise<[string, Response]>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        console.log("Finished reading blob:", reader.result);
                        resolve([reader.result as string, response]);
                    };
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
                    console.log("Data URL and response:", dataUrl, response);
                    if (event.source) {
                        event.source.postMessage({
                            type: 'FETCH_RESPONSE',
                            url: url,
                            response: dataUrl,
                        });
                        console.log("Posted message to source");
                    }
                    return [response] as [Response]; 
                } else {
                    throw new Error("Unexpected value");
                }
            });
    }
});