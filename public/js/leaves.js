let leaves = [];


// Get HTML elements

const leaveForm =
    document.getElementById("leaveForm");

const leaveTableBody =
    document.getElementById("leaveTableBody");

const statusFilter =
    document.getElementById("statusFilter");


// Load leave requests from the server (filtered by status)

async function loadLeaves() {

    try {

        const selectedStatus =
            statusFilter.value;

        const query =
            selectedStatus && selectedStatus !== "All"
                ? "?status=" + encodeURIComponent(selectedStatus)
                : "";

        leaves =
            await apiFetch("/leaves" + query);

        displayLeaves(leaves);

    }

    catch (error) {

        alert(error.message);

    }

}


// Display leaves

function displayLeaves(leaveList) {

    leaveTableBody.innerHTML = "";


    if (leaveList.length === 0) {

        leaveTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No leave requests found.
                </td>
            </tr>
        `;

        return;
    }


    leaveList.forEach(function(leave) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${escapeHtml(leave.employee)}</td>

            <td>${escapeHtml(leave.type)}</td>

            <td>${escapeHtml(leave.startDate)}</td>

            <td>${escapeHtml(leave.endDate)}</td>

            <td>${escapeHtml(leave.reason)}</td>

            <td>

                <span class="status ${leave.status.toLowerCase()}">

                    ${leave.status}

                </span>

            </td>

            <td>

                ${
                    leave.status === "Pending"

                    ?

                    `
                    <button
                        class="approve-button"
                        onclick="updateLeaveStatus('${leave._id}', 'Approved')">

                        Approve

                    </button>

                    <button
                        class="reject-button"
                        onclick="updateLeaveStatus('${leave._id}', 'Rejected')">

                        Reject

                    </button>
                    `

                    :

                    `
                    <button
                        class="delete-button"
                        onclick="deleteLeave('${leave._id}')">

                        Delete

                    </button>
                    `
                }

            </td>

        `;


        leaveTableBody.appendChild(row);

    });

}


// Add leave request

leaveForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const employee =
            document.getElementById("employeeName").value;

        const type =
            document.getElementById("leaveType").value;

        const startDate =
            document.getElementById("startDate").value;

        const endDate =
            document.getElementById("endDate").value;

        const reason =
            document.getElementById("reason").value;


        if (
            employee.trim() === "" ||
            type === "" ||
            startDate === "" ||
            endDate === "" ||
            reason.trim() === ""
        ) {

            alert(
                "Please fill all leave request fields."
            );

            return;
        }


        if (reason.trim().length < 5) {

            alert(
                "Please provide a more detailed reason."
            );

            return;
        }


        if (endDate < startDate) {

            alert(
                "End date cannot be before start date."
            );

            return;
        }


        try {

            await apiFetch(
                "/leaves",
                {
                    method: "POST",
                    body: {
                        employee: employee.trim(),
                        type: type,
                        startDate: startDate,
                        endDate: endDate,
                        reason: reason.trim()
                    }
                }
            );


            leaveForm.reset();

            await loadLeaves();

        }

        catch (error) {

            alert(error.message);

        }

    }
);


// Approve or reject a leave request

async function updateLeaveStatus(id, status) {

    try {

        await apiFetch(
            "/leaves/" + id + "/status",
            {
                method: "PATCH",
                body: { status: status }
            }
        );

        await loadLeaves();

    }

    catch (error) {

        alert(error.message);

    }

}


// Delete leave

async function deleteLeave(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this request?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await apiFetch(
            "/leaves/" + id,
            { method: "DELETE" }
        );

        await loadLeaves();

    }

    catch (error) {

        alert(error.message);

    }

}


// Filter by status

statusFilter.addEventListener(
    "change",
    loadLeaves
);


// Load when page opens

loadLeaves();
