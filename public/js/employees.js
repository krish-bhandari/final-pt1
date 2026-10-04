let employees = [];


// HTML elements

const employeeTableBody =
    document.getElementById("employeeTableBody");

const employeeForm =
    document.getElementById("employeeForm");

const searchEmployee =
    document.getElementById("searchEmployee");


// Currently edited employee (MongoDB _id)

let editingEmployeeId = null;


// Load employees from the server (optionally filtered by search text)

async function loadEmployees() {

    try {

        const searchText =
            searchEmployee.value.trim();

        const query =
            searchText
                ? "?search=" + encodeURIComponent(searchText)
                : "";

        employees =
            await apiFetch("/employees" + query);

        displayEmployees(employees);

    }

    catch (error) {

        alert(error.message);

    }

}


// Display employees

function displayEmployees(employeeList) {

    employeeTableBody.innerHTML = "";

    if (employeeList.length === 0) {

        employeeTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No employees found.
                </td>
            </tr>
        `;

        return;
    }


    employeeList.forEach(function(employee, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHtml(employee.name)}</td>

            <td>${escapeHtml(employee.email)}</td>

            <td>${escapeHtml(employee.department)}</td>

            <td>${escapeHtml(employee.position)}</td>

            <td>

                <button
                    class="edit-button"
                    onclick="editEmployee('${employee._id}')">

                    Edit

                </button>

                <button
                    class="delete-button"
                    onclick="deleteEmployee('${employee._id}')">

                    Delete

                </button>

            </td>

        `;


        employeeTableBody.appendChild(row);

    });

}


// Add / Update employee

employeeForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const department =
            document.getElementById("department").value;

        const position =
            document.getElementById("position").value.trim();


        // Basic validation

        if (
            name === "" ||
            email === "" ||
            department === "" ||
            position === ""
        ) {

            alert("Please fill all fields.");

            return;
        }


        // Name validation

        if (name.length < 3) {

            alert("Name must contain at least 3 characters.");

            return;
        }


        // Position validation

        if (position.length < 2) {

            alert("Please enter a valid position.");

            return;
        }


        // Email validation

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(email)) {

            alert("Please enter a valid email address.");

            return;
        }


        const employeeData = {
            name: name,
            email: email,
            department: department,
            position: position
        };


        try {

            if (editingEmployeeId !== null) {

                // Update existing employee

                await apiFetch(
                    "/employees/" + editingEmployeeId,
                    {
                        method: "PUT",
                        body: employeeData
                    }
                );


                editingEmployeeId = null;

                document.querySelector(
                    ".primary-button"
                ).textContent = "Add Employee";

            }

            else {

                // Add new employee
                // (duplicate emails are rejected by the server)

                await apiFetch(
                    "/employees",
                    {
                        method: "POST",
                        body: employeeData
                    }
                );

            }


            employeeForm.reset();

            await loadEmployees();

        }

        catch (error) {

            alert(error.message);

        }

    }
);


// Edit employee

function editEmployee(id) {

    const employee =
        employees.find(
            function(employee) {

                return employee._id === id;

            }
        );


    if (!employee) {

        return;

    }


    document.getElementById("name").value =
        employee.name;

    document.getElementById("email").value =
        employee.email;

    document.getElementById("department").value =
        employee.department;

    document.getElementById("position").value =
        employee.position;


    editingEmployeeId = id;


    document.querySelector(
        ".primary-button"
    ).textContent = "Update Employee";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// Delete employee

async function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await apiFetch(
            "/employees/" + id,
            { method: "DELETE" }
        );

        await loadEmployees();

    }

    catch (error) {

        alert(error.message);

    }

}


// Search employees (the server filters using a MongoDB query)

let searchTimer = null;


searchEmployee.addEventListener(
    "input",
    function() {

        // wait until the user stops typing
        clearTimeout(searchTimer);

        searchTimer = setTimeout(loadEmployees, 250);

    }
);


// Load employees when page opens

loadEmployees();
