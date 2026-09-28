/* =====================================================
   MP POLICE PAYROLL SYSTEM
===================================================== */


/* =====================================================
   LOGIN
===================================================== */

const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "1234";

const STORAGE_KEY = "MP_POLICE_EMPLOYEE_RECORDS";

let employees = [];
let selectedUnicode = null;


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadStorage();

    checkLogin();

    renderTable();

    updateClock();

    setInterval(updateClock, 1000);

});


/* =====================================================
   LOGIN CHECK
===================================================== */

function checkLogin() {

    const loggedIn =
        sessionStorage.getItem("MP_POLICE_LOGGED_IN");

    if (loggedIn === "YES") {

        showSoftware();

    } else {

        showLogin();

    }

}


/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin() {

    document.getElementById("loginPage")
        .classList.remove("hidden");

    document.getElementById("software")
        .classList.add("hidden");

}


/* =====================================================
   SHOW SOFTWARE
===================================================== */

function showSoftware() {

    document.getElementById("loginPage")
        .classList.add("hidden");

    document.getElementById("software")
        .classList.remove("hidden");


    const username =
        sessionStorage.getItem("MP_POLICE_USERNAME") || "Admin";


    document.getElementById("loggedUser").textContent =
        username;

    document.getElementById("topUser").textContent =
        username;


    openPage("home");

}


/* =====================================================
   LOGIN
===================================================== */

function login() {

    const username =
        document.getElementById("loginUsername")
        .value.trim();

    const password =
        document.getElementById("loginPassword")
        .value;


    const message =
        document.getElementById("loginMessage");


    if (
        username === LOGIN_USERNAME &&
        password === LOGIN_PASSWORD
    ) {

        sessionStorage.setItem(
            "MP_POLICE_LOGGED_IN",
            "YES"
        );

        sessionStorage.setItem(
            "MP_POLICE_USERNAME",
            username
        );

        message.textContent = "";

        showSoftware();

    } else {

        message.textContent =
            "Invalid username or password.";

    }

}


/* =====================================================
   ENTER KEY LOGIN
===================================================== */

document.addEventListener("keydown", function (event) {

    if (
        event.key === "Enter" &&
        !document
            .getElementById("loginPage")
            .classList.contains("hidden")
    ) {

        login();

    }

});


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    sessionStorage.removeItem(
        "MP_POLICE_LOGGED_IN"
    );

    sessionStorage.removeItem(
        "MP_POLICE_USERNAME"
    );

    selectedUnicode = null;

    clearForm();

    showLogin();

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function openPage(page, clickedButton = null) {

    const pages =
        document.querySelectorAll(".page");


    pages.forEach(function (item) {

        item.classList.add("hidden");

    });


    const selectedPage =
        document.getElementById(page);


    if (selectedPage) {

        selectedPage.classList.remove("hidden");

    }


    const buttons =
        document.querySelectorAll(".menu-button");


    buttons.forEach(function (button) {

        button.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        buttons.forEach(function (button) {

            const action =
                button.getAttribute("onclick") || "";


            if (
                action.includes("'" + page + "'") ||
                action.includes('"' + page + '"')
            ) {

                button.classList.add("active");

            }

        });

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =====================================================
   CLOCK
===================================================== */

function updateClock() {

    const clock =
        document.getElementById("clock");


    if (!clock) return;


    const now = new Date();


    const day =
        String(now.getDate()).padStart(2, "0");

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const year =
        now.getFullYear();


    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    const seconds =
        String(now.getSeconds()).padStart(2, "0");


    clock.textContent =
        `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;

}


/* =====================================================
   LOCAL STORAGE
===================================================== */

function loadStorage() {

    try {

        employees =
            JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            ) || [];

    } catch (error) {

        employees = [];

    }

}


function saveStorage() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(employees)
    );

}


/* =====================================================
   GET VALUE
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);


    if (!element) return "";


    return element.value.trim();

}


/* =====================================================
   EMPLOYEE OBJECT
===================================================== */

function getEmployeeFromForm() {

    return {

        bno: getValue("bno"),

        unicode: getValue("unicode"),

        name: getValue("name"),

        rank: getValue("rank"),

        pran: getValue("pran"),

        basic: getValue("basic"),

        posting: getValue("posting"),

        mobile: getValue("mobile"),

        gpf: getValue("gpf"),

        dob: getValue("dob"),

        doa: getValue("doa"),

        doj: getValue("doj"),

        dor: getValue("dor"),

        status: getValue("status"),

        remark: getValue("remark")

    };

}


/* =====================================================
   SAVE EMPLOYEE
===================================================== */

function saveEmployee() {

    const data =
        getEmployeeFromForm();


    if (!data.unicode) {

        alert("Please enter UNICODE.");

        document.getElementById("unicode").focus();

        return;

    }


    if (!data.name) {

        alert("Please enter Employee Name.");

        document.getElementById("name").focus();

        return;

    }


    const duplicate =
        employees.some(function (employee) {

            return (
                employee.unicode.toLowerCase() ===
                data.unicode.toLowerCase()
            );

        });


    if (duplicate) {

        alert(
            "This UNICODE already exists."
        );

        return;

    }


    data.created =
        new Date().toISOString();


    data.updated =
        "";


    employees.push(data);


    saveStorage();

    renderTable();

    loadEmployee(data);


    alert("Employee saved successfully.");

}


/* =====================================================
   UPDATE EMPLOYEE
===================================================== */

function updateEmployee() {

    if (!selectedUnicode) {

        alert(
            "First select an employee to update."
        );

        return;

    }


    const data =
        getEmployeeFromForm();


    if (!data.unicode || !data.name) {

        alert(
            "UNICODE and Name are required."
        );

        return;

    }


    const index =
        employees.findIndex(function (employee) {

            return (
                employee.unicode.toLowerCase() ===
                selectedUnicode.toLowerCase()
            );

        });


    if (index === -1) {

        alert("Employee record not found.");

        return;

    }


    const duplicate =
        employees.some(function (employee, i) {

            return (
                i !== index &&
                employee.unicode.toLowerCase() ===
                data.unicode.toLowerCase()
            );

        });


    if (duplicate) {

        alert(
            "Another employee already has this UNICODE."
        );

        return;

    }


    data.created =
        employees[index].created;


    data.updated =
        new Date().toISOString();


    employees[index] =
        data;


    selectedUnicode =
        data.unicode;


    saveStorage();

    renderTable();

    loadEmployee(data);


    alert("Employee updated successfully.");

}


/* =====================================================
   DELETE EMPLOYEE
===================================================== */

function deleteEmployee() {

    if (!selectedUnicode) {

        alert(
            "First select an employee to delete."
        );

        return;

    }


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmDelete) return;


    employees =
        employees.filter(function (employee) {

            return (
                employee.unicode.toLowerCase() !==
                selectedUnicode.toLowerCase()
            );

        });


    saveStorage();

    clearForm();

    renderTable();


    alert("Employee deleted.");

}


/* =====================================================
   SEARCH EMPLOYEE
===================================================== */

function searchEmployee() {

    const search =
        prompt(
            "Enter BNO, UNICODE or Employee Name:"
        );


    if (!search) return;


    const keyword =
        search.trim().toLowerCase();


    const employee =
        employees.find(function (item) {

            return (

                (item.bno || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (item.unicode || "")
                    .toLowerCase()
                    .includes(keyword)

                ||

                (item.name || "")
                    .toLowerCase()
                    .includes(keyword)

            );

        });


    if (!employee) {

        alert("Employee not found.");

        return;

    }


    loadEmployee(employee);

}


/* =====================================================
   LOAD EMPLOYEE
===================================================== */

function loadEmployee(employee) {

    selectedUnicode =
        employee.unicode;


    const fields = [

        "bno",
        "unicode",
        "name",
        "rank",
        "pran",
        "basic",
        "posting",
        "mobile",
        "gpf",
        "dob",
        "doa",
        "doj",
        "dor",
        "status",
        "remark"

    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value =
                employee[id] || "";

        }

    });


    openPage("profile");


}


/* =====================================================
   CLEAR FORM
===================================================== */

function clearForm() {

    selectedUnicode = null;


    const fields = [

        "bno",
        "unicode",
        "name",
        "rank",
        "pran",
        "basic",
        "posting",
        "mobile",
        "gpf",
        "dob",
        "doa",
        "doj",
        "dor",
        "remark"

    ];


    fields.forEach(function (id) {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });


    const status =
        document.getElementById("status");


    if (status) {

        status.value = "Active";

    }

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderTable() {

    const table =
        document.getElementById("employeeTable");


    if (!table) return;


    const searchElement =
        document.getElementById("tableSearch");


    const search =
        searchElement
            ? searchElement.value.trim().toLowerCase()
            : "";


    const filtered =
        employees.filter(function (employee) {

            if (!search) return true;


            return (

                (employee.unicode || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (employee.bno || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (employee.name || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (employee.rank || "")
                    .toLowerCase()
                    .includes(search)

                ||

                (employee.posting || "")
                    .toLowerCase()
                    .includes(search)

            );

        });


    table.innerHTML = "";


    if (filtered.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7"
                    style="text-align:center;color:#8995a3;padding:25px;">
                    No employee records found.
                </td>
            </tr>
        `;

        return;

    }


    filtered.forEach(function (employee) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHTML(employee.unicode)}</td>

            <td>${escapeHTML(employee.bno)}</td>

            <td>${escapeHTML(employee.name)}</td>

            <td>${escapeHTML(employee.rank)}</td>

            <td>${escapeHTML(employee.posting)}</td>

            <td>${escapeHTML(employee.basic)}</td>

            <td>${escapeHTML(employee.status)}</td>

        `;


        row.addEventListener(
            "click",
            function () {

                loadEmployee(employee);

            }
        );


        table.appendChild(row);

    });

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
