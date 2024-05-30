self.addEventListener('fetch', (event: any) => {

    const url = new URL(event.request.url);
    const newHeaders = new Headers(event.request.headers);
    const originalUrl = url.href;
    newHeaders.append('X-Original-URL', originalUrl);

    const newRequest = new Request('https://www.google.com', {
        method: event.request.method,
        headers: newHeaders,
        mode: event.request.mode,
        credentials: event.request.credentials,
        redirect: event.request.redirect,
        referrer: event.request.referrer,
        integrity: event.request.integrity,
        cache: event.request.cache,
        body: event.request.body,
    });

    event.respondWith(
        fetch(newRequest)
            .then(response => {
                // ensure the response is valid and can be converted to a blob
                if (response instanceof Response && typeof response.blob === 'function') {
                    return response.blob().then(blob => [blob, response]); // pass the original response along with the blob
                } else {
                    throw new Error('Invalid response type');
                }
            })
            .then(([blob, response]) => {
                // convert the blob to a data URL
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve([reader.result, response]); // pass the original response along with the data URL
                    reader.onerror = reject;
                    if (blob instanceof Blob) {
                        reader.readAsDataURL(blob);
                    } else {
                        reject(new Error('Expected Blob'));
                    }
                });
            })
            .then((value: any) => {
                // check if an array with two elements
                if (Array.isArray(value) && value.length === 2) {
                    const [dataUrl, response] = value;            
                    // post message with the data URL
                    ((self as unknown) as ServiceWorkerGlobalScope).clients.matchAll().then(clients => {
                        clients.forEach(client => client.postMessage(dataUrl));
                    });

                    return response;
                } else {
                    throw new Error('Unexpected value');
                }
            })
    );
});