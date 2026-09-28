const STORAGE_KEY = "MP_POLICE_EMPLOYEES";

let employees =
    JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

let selectedUnicode = null;


/* PAGE */

function openPage(page){

    document
        .querySelectorAll(".page")
        .forEach(p => p.classList.add("hidden"));

    const selected =
        document.getElementById(page);

    if(selected){
        selected.classList.remove("hidden");
    }

}


/* CLOCK */

function updateClock(){

    const now = new Date();

    const date =
        String(now.getDate()).padStart(2,"0") +
        "-" +
        String(now.getMonth()+1).padStart(2,"0") +
        "-" +
        now.getFullYear();

    const time =
        now.toLocaleTimeString("en-IN",{
            hour12:false
        });

    document.getElementById("clock").textContent =
        date + " " + time;

}

setInterval(updateClock,1000);

updateClock();


/* FORM DATA */

function getData(){

    return {

        bno:
            document.getElementById("bno").value.trim(),

        unicode:
            document.getElementById("unicode").value.trim(),

        name:
            document.getElementById("name").value.trim(),

        rank:
            document.getElementById("rank").value,

        pran:
            document.getElementById("pran").value.trim(),

        basic:
            document.getElementById("basic").value.trim(),

        posting:
            document.getElementById("posting").value.trim(),

        mobile:
            document.getElementById("mobile").value.trim(),

        gpf:
            document.getElementById("gpf").value.trim(),

        dob:
            document.getElementById("dob").value,

        doa:
            document.getElementById("doa").value,

        doj:
            document.getElementById("doj").value,

        dor:
            document.getElementById("dor").value,

        status:
            document.getElementById("status").value,

        remark:
            document.getElementById("remark").value.trim()

    };

}


/* SAVE STORAGE */

function saveStorage(){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(employees)
    );

    renderTable();

    updateEmployeeCount();

}


/* VALIDATION */

function valid(data){

    if(!data.unicode){

        alert("UNICODE दर्ज करें।");

        document
            .getElementById("unicode")
            .focus();

        return false;

    }


    if(!data.name){

        alert("Employee Name दर्ज करें।");

        document
            .getElementById("name")
            .focus();

        return false;

    }


    return true;

}


/* SAVE */

function saveEmployee(){

    const data = getData();

    if(!valid(data)){
        return;
    }


    const exists =
        employees.some(
            e => e.unicode === data.unicode
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
        "Employee successfully saved."
    );

}


/* UPDATE */

function updateEmployee(){

    const data = getData();

    if(!valid(data)){
        return;
    }


    const key =
        selectedUnicode ||
        data.unicode;


    const index =
        employees.findIndex(
            e => e.unicode === key
        );


    if(index === -1){

        alert(
            "Employee नहीं मिला। पहले SEARCH करें।"
        );

        return;

    }


    employees[index] = {

        ...data,

        created:
            employees[index].created,

        updated:
            new Date().toISOString()

    };


    selectedUnicode =
        data.unicode;


    saveStorage();

    loadEmployee(data);

    alert(
        "Employee successfully updated."
    );

}


/* DELETE */

function deleteEmployee(){

    const key =
        selectedUnicode ||
        document
            .getElementById("unicode")
            .value.trim();


    if(!key){

        alert(
            "पहले Employee select करें।"
        );

        return;

    }


    const employee =
        employees.find(
            e => e.unicode === key
        );


    if(!employee){

        alert(
            "Employee नहीं मिला।"
        );

        return;

    }


    const confirmDelete =
        confirm(
            employee.name +
            " का record delete करना है?"
        );


    if(!confirmDelete){
        return;
    }


    employees =
        employees.filter(
            e => e.unicode !== key
        );


    selectedUnicode = null;

    saveStorage();

    clearForm(false);

    alert(
        "Employee deleted."
    );

}


/* SEARCH */

function searchEmployee(){

    const search =
        prompt(
            "BNO / Unicode / Employee Name दर्ज करें:"
        );


    if(!search){
        return;
    }


    const value =
        search.toLowerCase().trim();


    const employee =
        employees.find(e =>

            String(e.unicode)
                .toLowerCase() === value

            ||

            String(e.bno)
                .toLowerCase() === value

            ||

            String(e.name)
                .toLowerCase()
                .includes(value)

        );


    if(!employee){

        alert(
            "Employee record नहीं मिला।"
        );

        return;

    }


    loadEmployee(employee);

    openPage("profile");

}


/* LOAD */

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


    fields.forEach(field => {

        const element =
            document.getElementById(field);

        if(element){

            element.value =
                employee[field] || "";

        }

    });


    document.getElementById(
        "recordId"
    ).textContent =
        employee.unicode;


    updateHeader(employee);

}


/* HEADER */

function updateHeader(employee){

    document.getElementById(
        "topName"
    ).textContent =
        employee.name ||
        "EMPLOYEE";


    document.getElementById(
        "topBno"
    ).textContent =
        employee.bno ||
        "—";


    document.getElementById(
        "topUnicode"
    ).textContent =
        employee.unicode ||
        "—";


    document.getElementById(
        "topRank"
    ).textContent =
        employee.rank ||
        "—";


    document.getElementById(
        "topPosting"
    ).textContent =
        employee.posting ||
        "—";


    document.getElementById(
        "topCode"
    ).textContent =
        employee.bno ||
        "—";


    document.getElementById(
        "selectedName"
    ).textContent =
        employee.name ||
        "Employee";


    document.getElementById(
        "selectedDetails"
    ).textContent =

        (employee.rank || "—") +
        " • " +
        (employee.posting || "—") +
        " • Unicode " +
        (employee.unicode || "—");


    document.getElementById(
        "salaryBasic"
    ).textContent =
        "₹ " +
        Number(employee.basic || 0)
            .toLocaleString("en-IN");

}


/* CLEAR */

function clearForm(showAlert=true){

    document
        .getElementById("employeeForm")
        .reset();


    document.getElementById(
        "recordId"
    ).textContent =
        "NEW";


    selectedUnicode = null;


    if(showAlert){

        alert(
            "Form cleared."
        );

    }

}


/* TABLE */

function renderTable(){

    const tbody =
        document.getElementById(
            "employeeTable"
        );


    const search =
        document.getElementById(
            "tableSearch"
        ).value
        .toLowerCase()
        .trim();


    const records =
        employees.filter(e =>

            !search

            ||

            String(e.unicode)
                .toLowerCase()
                .includes(search)

            ||

            String(e.bno)
                .toLowerCase()
                .includes(search)

            ||

            String(e.name)
                .toLowerCase()
                .includes(search)

            ||

            String(e.posting)
                .toLowerCase()
                .includes(search)

        );


    if(records.length === 0){

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                    text-align:center;
                    padding:25px;
                    color:#7b8798;
                    "
                >

                    No Employee Records

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        records.map(employee => `

        <tr
            onclick='selectRow(${JSON.stringify(employee)})'
        >

            <td>
                <b>
                    ${escapeHTML(employee.unicode)}
                </b>
            </td>

            <td>
                ${escapeHTML(employee.bno)}
            </td>

            <td>
                ${escapeHTML(employee.name)}
            </td>

            <td>
                ${escapeHTML(employee.rank)}
            </td>

            <td>
                ${escapeHTML(employee.posting)}
            </td>

            <td>
                ₹ ${Number(employee.basic || 0)
                    .toLocaleString("en-IN")}
            </td>

            <td>
                ${escapeHTML(employee.status)}
            </td>

        </tr>

    `).join("");

}


/* SELECT TABLE ROW */

function selectRow(employee){

    loadEmployee(employee);

    openPage("profile");

}


/* ESCAPE HTML */

function escapeHTML(value){

    return String(value || "")
        .replace(
            /[&<>"']/g,
            character => ({

                "&":"&amp;",
                "<":"&lt;",
                ">":"&gt;",
                '"':"&quot;",
                "'":"&#039;"

            })[character]
        );

}


/* COUNT */

function updateEmployeeCount(){

    document.getElementById(
        "totalEmployees"
    ).textContent =
        employees.length;

}


/* MONTH */

document
    .getElementById("month")
    .addEventListener(
        "change",
        function(){

            document.getElementById(
                "currentMonth"
            ).textContent =
                this.value.toUpperCase();

        }
    );


/* EXPORT */

function exportCSV(){

    if(
        employees.length === 0
    ){

        alert(
            "Export करने के लिए employee records नहीं हैं।"
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
        headers.join(",") +
        "\n";


    employees.forEach(employee => {

        csv +=

            keys
                .map(
                    key =>
                        `"${String(
                            employee[key] || ""
                        ).replaceAll('"','""')}"`
                )
                .join(",")

            +

            "\n";

    });


    const blob =
        new Blob(
            ["\ufeff" + csv],
            {
                type:
                    "text/csv;charset=utf-8"
            }
        );


    const link =
        document.createElement("a");


    link.href =
        URL.createObjectURL(blob);


    link.download =
        "MP_Police_Employee_Data.csv";


    link.click();

}


/* LOGOUT */

function logout(){

    alert(
        "Logout system next step में Login Page से connect किया जाएगा।"
    );

}


/* START */

renderTable();

updateEmployeeCount();

if(employees.length > 0){

    loadEmployee(
        employees[0]
    );

}