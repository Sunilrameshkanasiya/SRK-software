/* =====================================================
   MP POLICE PAYROLL SYSTEM
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   LOGIN SETTINGS
===================================================== */

const LOGIN_USERNAME = "admin";
const LOGIN_PASSWORD = "1234";


/* =====================================================
   STORAGE
===================================================== */

const STORAGE_KEY =
    "MP_POLICE_EMPLOYEE_RECORDS";


let employees =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    ) || [];


let selectedUnicode = null;


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function(){

        checkLogin();

        renderTable();

        updateClock();

        setInterval(
            updateClock,
            1000
        );

    }
);


/* =====================================================
   LOGIN CHECK
===================================================== */

function checkLogin(){

    const loggedIn =
        sessionStorage.getItem(
            "MP_POLICE_LOGGED_IN"
        );


    if(loggedIn === "true"){

        showSoftware();

    }
    else{

        showLogin();

    }

}


/* =====================================================
   SHOW LOGIN
===================================================== */

function showLogin(){

    document
        .getElementById("loginPage")
        .classList.remove("hidden");


    document
        .getElementById("software")
        .classList.add("hidden");


    setTimeout(
        function(){

            document
                .getElementById("loginUsername")
                .focus();

        },
        100
    );

}


/* =====================================================
   SHOW SOFTWARE
===================================================== */

function showSoftware(){

    document
        .getElementById("loginPage")
        .classList.add("hidden");


    document
        .getElementById("software")
        .classList.remove("hidden");


    const username =
        sessionStorage.getItem(
            "MP_POLICE_USERNAME"
        ) || "ADMIN";


    document
        .getElementById("loggedUser")
        .textContent =
        username.toUpperCase();


    document
        .getElementById("topUser")
        .textContent =
        username.toUpperCase();


    /* HOME FIRST */

    openPage("home");

}


/* =====================================================
   LOGIN
===================================================== */

function login(){

    const username =
        document
            .getElementById("loginUsername")
            .value
            .trim();


    const password =
        document
            .getElementById("loginPassword")
            .value;


    const message =
        document
            .getElementById("loginMessage");


    message.textContent = "";


    if(
        username === LOGIN_USERNAME &&
        password === LOGIN_PASSWORD
    ){

        sessionStorage.setItem(
            "MP_POLICE_LOGGED_IN",
            "true"
        );


        sessionStorage.setItem(
            "MP_POLICE_USERNAME",
            username
        );


        showSoftware();

    }
    else{

        message.textContent =
            "Invalid User Name or Password";


        document
            .getElementById("loginPassword")
            .value = "";


        document
            .getElementById("loginPassword")
            .focus();

    }

}


/* =====================================================
   ENTER KEY LOGIN
===================================================== */

function loginEnter(event){

    if(event.key === "Enter"){

        login();

    }

}


/* =====================================================
   LOGOUT
===================================================== */

function logout(){

    const confirmLogout =
        confirm(
            "क्या आप Logout करना चाहते हैं?"
        );


    if(!confirmLogout){

        return;

    }


    sessionStorage.removeItem(
        "MP_POLICE_LOGGED_IN"
    );


    sessionStorage.removeItem(
        "MP_POLICE_USERNAME"
    );


    document
        .getElementById("loginUsername")
        .value = "";


    document
        .getElementById("loginPassword")
        .value = "";


    document
        .getElementById("loginMessage")
        .textContent = "";


    showLogin();

}


/* =====================================================
   PAGE OPEN
===================================================== */

function openPage(
    page,
    clickedButton = null
){

    document
        .querySelectorAll(".page")
        .forEach(
            function(p){

                p.classList.add(
                    "hidden"
                );

            }
        );


    const selected =
        document.getElementById(page);


    if(selected){

        selected.classList.remove(
            "hidden"
        );

    }


    /* Sidebar active button */

    document
        .querySelectorAll(
            ".menu-button"
        )
        .forEach(
            function(button){

                button.classList.remove(
                    "active"
                );

            }
        );


    if(clickedButton){

        clickedButton.classList.add(
            "active"
        );

    }
    else{

        const sidebarButton =
            document.querySelector(
                `.menu-button[onclick*="'${page}'"]`
            );


        if(sidebarButton){

            sidebarButton.classList.add(
                "active"
            );

        }

    }


    /* Scroll top */

    window.scrollTo(
        0,
        0
    );

}


/* =====================================================
   CLOCK
===================================================== */

function updateClock(){

    const now =
        new Date();


    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );


    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const year =
        now.getFullYear();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour12:false
            }
        );


    const clock =
        document.getElementById(
            "clock"
        );


    if(clock){

        clock.textContent =
            `${day}-${month}-${year} ${time}`;

    }

}


/* =====================================================
   EMPLOYEE DATA
===================================================== */

function getEmployeeData(){

    return {

        bno:
            getValue("bno"),

        unicode:
            getValue("unicode"),

        name:
            getValue("name"),

        rank:
            getValue("rank"),

        pran:
            getValue("pran"),

        basic:
            getValue("basic"),

        posting:
            getValue("posting"),

        mobile:
            getValue("mobile"),

        gpf:
            getValue("gpf"),

        dob:
            getValue("dob"),

        doa:
            getValue("doa"),

        doj:
            getValue("doj"),

        dor:
            getValue("dor"),

        status:
            getValue("status"),

        remark:
            getValue("remark")

    };

}


/* =====================================================
   GET VALUE
===================================================== */

function getValue(id){

    const element =
        document.getElementById(id);


    if(!element){

        return "";

    }


    return element.value.trim();

}


/* =====================================================
   SAVE STORAGE
===================================================== */

function saveStorage(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(employees)
    );


    renderTable();

}


/* =====================================================
   SAVE EMPLOYEE
===================================================== */

function saveEmployee(){

    const data =
        getEmployeeData();


    if(!data.unicode){

        alert(
            "UNICODE दर्ज करें।"
        );

        document
            .getElementById("unicode")
            .focus();

        return;

    }


    if(!data.name){

        alert(
            "Employee Name दर्ज करें।"
        );

        document
            .getElementById("name")
            .focus();

        return;

    }


    const exists =
        employees.some(
            function(employee){

                return (
                    employee.unicode
                    .toLowerCase()
                    ===
                    data.unicode
                    .toLowerCase()
                );

            }
        );


    if(exists){

        alert(
            "यह Unicode पहले से मौजूद है। UPDATE का उपयोग करें।"
        );

        return;

    }


    data.created =
        new Date().toISOString();


    employees.push(data);


    selectedUnicode =
        data.unicode;


    saveStorage();


    loadEmployee(data);


    alert(
        "Employee Successfully Saved"
    );

}


/* =====================================================
   UPDATE
===================================================== */

function updateEmployee(){

    const data =
        getEmployeeData();


    if(!data.unicode){

        alert(
            "पहले Employee Search करें।"
        );

        return;

    }


    const key =
        selectedUnicode ||
        data.unicode;


    const index =
        employees.findIndex(
            function(employee){

                return (
                    employee.unicode
                    === key
                );

            }
        );


    if(index === -1){

        alert(
            "Employee Record नहीं मिला।"
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


    loadEmployee(data);


    alert(
        "Employee Successfully Updated"
    );

}


/* =====================================================
   DELETE
===================================================== */

function deleteEmployee(){

    const key =
        selectedUnicode ||
        getValue("unicode");


    if(!key){

        alert(
            "पहले Employee select करें।"
        );

        return;

    }


    const employee =
        employees.find(
            function(item){

                return (
                    item.unicode === key
                );

            }
        );


    if(!employee){

        alert(
            "Employee Record नहीं मिला।"
        );

        return;

    }


    const confirmDelete =
        confirm(
            `${employee.name} का record delete करना है?`
        );


    if(!confirmDelete){

        return;

    }


    employees =
        employees.filter(
            function(item){

                return (
                    item.unicode !== key
                );

            }
        );


    selectedUnicode = null;


    saveStorage();


    clearForm(false);


    alert(
        "Employee Deleted"
    );

}


/* =====================================================
   SEARCH
===================================================== */

function searchEmployee(){

    const search =
        prompt(
            "BNO / Unicode / Employee Name दर्ज करें:"
        );


    if(!search){

        return;

    }


    const value =
        search
            .toLowerCase()
            .trim();


    const employee =
        employees.find(
            function(item){

                return (

                    String(
                        item.unicode
                    )
                    .toLowerCase()
                    === value

                    ||

                    String(
                        item.bno
                    )
                    .toLowerCase()
                    === value

                    ||

                    String(
                        item.name
                    )
                    .toLowerCase()
                    .includes(value)

                );

            }
        );


    if(!employee){

        alert(
            "Employee Record नहीं मिला।"
        );

        return;

    }


    loadEmployee(employee);


    openPage(
        "profile"
    );

}


/* =====================================================
   LOAD EMPLOYEE
===================================================== */

function loadEmployee(employee){

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


    fields.forEach(
        function(field){

            const element =
                document.getElementById(
                    field
                );


            if(element){

                element.value =
                    employee[field] || "";

            }

        }
    );


    document
        .getElementById("recordId")
        .textContent =
        employee.unicode;


    updateTopEmployee(
        employee
    );

}


/* =====================================================
   UPDATE TOP HEADER
===================================================== */

function updateTopEmployee(
    employee
){

    document
        .getElementById("topName")
        .textContent =
        employee.name ||
        "MP POLICE PAYROLL";


    document
        .getElementById("topBno")
        .textContent =
        employee.bno ||
        "BNO";


    document
        .getElementById("topUnicode")
        .textContent =
        employee.unicode ||
        "UNICODE";


    document
        .getElementById("topRank")
        .textContent =
        employee.rank ||
        "RANK";


    document
        .getElementById("topPosting")
        .textContent =
        employee.posting ||
        "POSTING";


    document
        .getElementById("topCode")
        .textContent =
        employee.bno ||
        "—";

}


/* =====================================================
   CLEAR
===================================================== */

function clearForm(
    showMessage = true
){

    document
        .getElementById(
            "employeeForm"
        )
        .reset();


    document
        .getElementById(
            "recordId"
        )
        .textContent =
        "NEW";


    selectedUnicode = null;


    resetTopHeader();


    if(showMessage){

        alert(
            "Form Cleared"
        );

    }

}


/* =====================================================
   RESET TOP HEADER
===================================================== */

function resetTopHeader(){

    document
        .getElementById("topName")
        .textContent =
        "MP POLICE PAYROLL";


    document
        .getElementById("topBno")
        .textContent =
        "BNO";


    document
        .getElementById("topUnicode")
        .textContent =
        "UNICODE";


    document
        .getElementById("topRank")
        .textContent =
        "RANK";


    document
        .getElementById("topPosting")
        .textContent =
        "POSTING";


    document
        .getElementById("topCode")
        .textContent =
        "—";

}


/* =====================================================
   TABLE
===================================================== */

function renderTable(){

    const table =
        document.getElementById(
            "employeeTable"
        );


    if(!table){

        return;

    }


    const searchElement =
        document.getElementById(
            "tableSearch"
        );


    const search =
        searchElement
            ? searchElement.value
                .toLowerCase()
                .trim()
            : "";


    const records =
        employees.filter(
            function(employee){

                if(!search){

                    return true;

                }


                return (

                    String(
                        employee.unicode
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        employee.bno
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        employee.name
                    )
                    .toLowerCase()
                    .includes(search)

                    ||

                    String(
                        employee.posting
                    )
                    .toLowerCase()
                    .includes(search)

                );

            }
        );


    if(records.length === 0){

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#7c899a;
                    "
                >

                    No Employee Records

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =
        records
        .map(
            function(employee){

                return `

                    <tr
                        onclick='selectEmployee(
                            ${JSON.stringify(employee)}
                        )'
                    >

                        <td>
                            <b>
                                ${escapeHTML(
                                    employee.unicode
                                )}
                            </b>
                        </td>

                        <td>
                            ${escapeHTML(
                                employee.bno
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                employee.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                employee.rank
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                employee.posting
                            )}
                        </td>

                        <td>
                            ₹ ${Number(
                                employee.basic || 0
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                employee.status
                            )}
                        </td>

                    </tr>

                `;

            }
        )
        .join("");

}


/* =====================================================
   SELECT EMPLOYEE
===================================================== */

function selectEmployee(
    employee
){

    loadEmployee(
        employee
    );


    openPage(
        "profile"
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
){

    return String(
        value || ""
    )
    .replace(
        /[&<>"']/g,
        function(character){

            return {

                "&":"&amp;",
                "<":"&lt;",
                ">":"&gt;",
                '"':"&quot;",
                "'":"&#039;"

            }[character];

        }
    );

}


/* =====================================================
   EXPORT CSV
===================================================== */

function exportCSV(){

    if(
        employees.length === 0
    ){

        alert(
            "Export करने के लिए Employee Records नहीं हैं।"
        );

        return;

    }


    const headers = [

        "BNO",
        "UNICODE",
        "NAME",
        "RANK",
        "PRAN",
        "BASIC",
        "POSTING",
        "MOBILE",
        "GPF/DPF/NPS",
        "DOB",
        "DOA",
        "DOJ",
        "DOR",
        "STATUS",
        "REMARK"

    ];


    const keys = [

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


    let csv =
        headers.join(",")
        + "\n";


    employees.forEach(
        function(employee){

            csv +=

                keys
                .map(
                    function(key){

                        return `"${String(
                            employee[key] || ""
                        ).replaceAll(
                            '"',
                            '""'
                        )}"`;

                    }
                )
                .join(",")

                +

                "\n";

        }
    );


    const blob =
        new Blob(
            [
                "\ufeff" +
                csv
            ],
            {
                type:
                    "text/csv;charset=utf-8"
            }
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        URL.createObjectURL(
            blob
        );


    link.download =
        "MP_Police_Employee_Data.csv";


    link.click();

}