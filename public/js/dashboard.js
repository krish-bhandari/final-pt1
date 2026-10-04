// The logout button on this page has no inline onclick,
// so attach the handler here

document
    .getElementById("logoutButton")
    .addEventListener("click", logout);


// Load every dashboard number with a single API call

async function loadDashboard() {

    try {

        const data =
            await apiFetch("/dashboard");


        // -------------------------
        // Statistics
        // -------------------------

        document.getElementById(
            "totalEmployees"
        ).textContent = data.totalEmployees;

        document.getElementById(
            "totalDepartments"
        ).textContent = data.totalDepartments;

        document.getElementById(
            "pendingLeaves"
        ).textContent = data.pendingLeaves;

        document.getElementById(
            "approvedLeaves"
        ).textContent = data.approvedLeaves;


        // -------------------------
        // Recent Leave Requests
        // -------------------------

        const recentLeaves =
            document.getElementById(
                "recentLeaves"
            );


        recentLeaves.innerHTML = "";


        if (data.recentLeaves.length === 0) {

            recentLeaves.innerHTML = `
                <p class="empty-message">
                    No leave requests yet.
                </p>
            `;

        } else {

            data.recentLeaves.forEach(
                function(leave) {

                    const activity =
                        document.createElement("div");

                    activity.className =
                        "activity";


                    activity.innerHTML = `

                        <strong>
                            ${escapeHtml(leave.employee)}
                        </strong>

                        requested
                        ${escapeHtml(leave.type)}

                        <span class="status ${leave.status.toLowerCase()}">

                            ${leave.status}

                        </span>

                    `;


                    recentLeaves.appendChild(
                        activity
                    );

                }
            );

        }


        // -------------------------
        // Recent Announcements
        // -------------------------

        const recentAnnouncements =
            document.getElementById(
                "recentAnnouncements"
            );


        recentAnnouncements.innerHTML = "";


        if (data.recentAnnouncements.length === 0) {

            recentAnnouncements.innerHTML = `
                <p class="empty-message">
                    No announcements available.
                </p>
            `;

        } else {

            data.recentAnnouncements.forEach(
                function(announcement) {

                    const item =
                        document.createElement("div");


                    item.className =
                        "activity";


                    item.innerHTML = `

                        <strong>
                            ${escapeHtml(announcement.title)}
                        </strong>

                        <span>
                            ${escapeHtml(announcement.date)}
                        </span>

                    `;


                    recentAnnouncements.appendChild(
                        item
                    );

                }
            );

        }

    }

    catch (error) {

        alert(error.message);

    }

}


loadDashboard();
