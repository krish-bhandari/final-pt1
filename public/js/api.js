// Shared helpers used by every page: talking to the backend API,
// keeping the login token, and escaping text before it goes into HTML.

const TOKEN_KEY = "hrToken";


function getToken() {

    return localStorage.getItem(TOKEN_KEY);

}


function setToken(token) {

    localStorage.setItem(TOKEN_KEY, token);

}


// Redirects to the login page when there is no token.
// Called at the top of every protected page.
function requireLogin() {

    if (!getToken()) {

        window.location.href = "index.html";

    }

}


function logout() {

    localStorage.removeItem(TOKEN_KEY);

    window.location.href = "index.html";

}


// Wrapper around fetch():
//  - sends the JWT in the Authorization header
//  - sends/receives JSON
//  - throws an Error with the server's message on failure
async function apiFetch(path, options = {}) {

    const headers = { "Content-Type": "application/json" };

    const token = getToken();

    if (token) {

        headers.Authorization = "Bearer " + token;

    }

    const response = await fetch("/api" + path, {

        method: options.method || "GET",

        headers: headers,

        body: options.body ? JSON.stringify(options.body) : undefined

    });

    let data = null;

    try {

        data = await response.json();

    } catch (error) {

        // response had no JSON body

    }

    if (response.status === 401 && path !== "/auth/login") {

        // Token missing, invalid or expired
        logout();

        throw new Error("Session expired. Please log in again.");

    }

    if (!response.ok) {

        throw new Error(
            (data && data.message) || "Request failed."
        );

    }

    return data;

}


// Prevents HTML injection when showing user-entered text with innerHTML
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}
