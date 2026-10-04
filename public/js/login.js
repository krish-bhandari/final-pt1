// Already logged in? Go straight to the dashboard

if (getToken()) {

    window.location.href = "dashboard.html";

}


const loginForm =
    document.getElementById("loginForm");


loginForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;


        if (username === "" || password === "") {

            alert("Please enter username and password.");

            return;
        }


        try {

            // The server checks the credentials against MongoDB
            // and returns a JWT token

            const data = await apiFetch(
                "/auth/login",
                {
                    method: "POST",
                    body: { username, password }
                }
            );


            setToken(data.token);

            window.location.href =
                "dashboard.html";

        }

        catch (error) {

            alert(error.message);

        }

    }
);
