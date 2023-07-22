class ResponseError extends Error {
    #response;
    constructor(message, response) {
        super(message);
        this.name = "ResponseError";
        this.#response = response;
    }
    get response() {
        return this.#response;
    }
}

const sampleFetch = async () => {
    const headers = new Headers({
        method: "GET",
        'X-Requested-With': "XMLHttpRequest",
        cache: "no-store",
    })
    const url = new URL(`${location.origin}/`);
    const request = new Request(url, { headers: headers, signal: AbortSignal.timeout(60000) });

    const response = await fetch(request, { headers: headers });

    if (!response.ok) {
        throw new ResponseError(`Bad fetch response`, response);
    }

    return response;
}

try {
    const response = await sampleFetch();
    const sample = await response.text();
} catch (error) {
    if (error instanceof ResponseError) {
        switch(error.response.status) {
            case 403:
                break;
            case 404:
                break;
            case 500:
                break;
        }
    } else if (error.name = "AbortError") {
        console.error(error);
    }
}