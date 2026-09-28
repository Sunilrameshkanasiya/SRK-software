function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === "admin" && password === "1234") {

        sessionStorage.setItem("mpPoliceLoggedIn", "true");

        window.location.href = "dashboard.html";

    } else {

        document.getElementById("loginMessage").textContent =
            "Invalid User ID or Password";

    }
}

function logout() {
    sessionStorage.removeItem("mpPoliceLoggedIn");
    window.location.href = "index.html";
}