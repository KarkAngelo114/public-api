// applications/http.js
// The http module is use to make request using native fetch API for seamless flow of making request.

const request = async (method, url, { body = null, headers = {}, timeout = 5000 }) => {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);

        const options = {
            method,
            headers,
            signal: controller.signal
        };

        if (body) {
            options.body = typeof body === "object" ? JSON.stringify(body) : body;
            if (!headers["Content-Type"]) {
                options.headers["Content-Type"] = "application/json";
            }
        }

        const response = await fetch(url, options);
        clearTimeout(timer);

        const contentType = response.headers.get("content-type");

        let data;
        if (contentType?.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        return {
            StatusCode: response.status,
            data: data,
            message: response.ok ? "OK" : "Request failed"
        };

    } catch (error) {
        return {
            StatusCode: error.name === "AbortError" ? 408 : 500,
            data: null,
            message: error.message
        };
    }
};

/**
 * 
 * @param {String} url url link 
 * @param {OBject} headers header configs
 * @returns {{StatusCode: Number, data: any, message: String}}
 */
exports.useGet = (url, headers) => request("GET", url, { headers });

/**
 * 
 * @param {String} url url link to third party application or server
 * @param {Object} body payload to be send for making request
 * @param {OBject} headers header configs
 * @returns {{StatusCode: Number, data: any, message: String}}
 */
exports.usePost = (url, body, headers) => request("POST", url, { body, headers });

/**
 * 
 * @param {String} url url link to third party application or server
 * @param {Object} body payload to be send for making request
 * @param {OBject} headers header configs
 * @returns {{StatusCode: Number, data: any, message: String}}
 */
exports.usePut = (url, body, headers) => request("PUT", url, { body, headers });

/**
 * 
 * @param {String} url url link 
 * @param {OBject} headers header configs
 * @returns {{StatusCode: Number, data: any, message: String}}
 */
exports.useDelete = (url, headers) => request("DELETE", url, { headers });