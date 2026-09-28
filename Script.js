document.getElementById("btnLogin").addEventListener("click", function () {

    let user = document.getElementById("txtUser").value;
    let pass = document.getElementById("txtPassword").value;

    if (user === "admin" && pass === "1234") {

        window.location.href = "dashboard.html";

    } else {

        alert("Invalid Username or Password");

    }

});