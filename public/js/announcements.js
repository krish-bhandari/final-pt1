let announcements = [];


// HTML elements

const announcementForm =
    document.getElementById(
        "announcementForm"
    );

const announcementList =
    document.getElementById(
        "announcementList"
    );


// Load announcements from the server (newest first)

async function loadAnnouncements() {

    try {

        announcements =
            await apiFetch("/announcements");

        displayAnnouncements();

    }

    catch (error) {

        alert(error.message);

    }

}


// Display announcements

function displayAnnouncements() {

    announcementList.innerHTML = "";


    if (announcements.length === 0) {

        announcementList.innerHTML = `
            <p class="empty-message">
                No announcements available.
            </p>
        `;

        return;

    }


    announcements.forEach(function(announcement) {

        const card =
            document.createElement("div");

        card.className =
            "announcement-card";


        card.innerHTML = `

            <div class="announcement-header">

                <h3>
                    ${escapeHtml(announcement.title)}
                </h3>

                <span>
                    ${escapeHtml(announcement.date)}
                </span>

            </div>


            <p>
                ${escapeHtml(announcement.message)}
            </p>


            <button
                class="delete-button"
                onclick="deleteAnnouncement('${announcement._id}')">

                Delete

            </button>

        `;


        announcementList.appendChild(card);

    });

}


// Add announcement

announcementForm.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const title =
            document.getElementById(
                "announcementTitle"
            ).value;


        const date =
            document.getElementById(
                "announcementDate"
            ).value;


        const message =
            document.getElementById(
                "announcementMessage"
            ).value;


        if (
            title.trim() === "" ||
            date === "" ||
            message.trim() === ""
        ) {

            alert(
                "Please fill all announcement fields."
            );

            return;
        }


        if (title.trim().length < 3) {

            alert(
                "Announcement title must contain at least 3 characters."
            );

            return;
        }


        if (message.trim().length < 10) {

            alert(
                "Announcement message is too short."
            );

            return;
        }


        try {

            await apiFetch(
                "/announcements",
                {
                    method: "POST",
                    body: {
                        title: title.trim(),
                        date: date,
                        message: message.trim()
                    }
                }
            );


            announcementForm.reset();

            await loadAnnouncements();

        }

        catch (error) {

            alert(error.message);

        }

    }
);


// Delete announcement

async function deleteAnnouncement(id) {

    const confirmDelete =
        confirm(
            "Delete this announcement?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        await apiFetch(
            "/announcements/" + id,
            { method: "DELETE" }
        );

        await loadAnnouncements();

    }

    catch (error) {

        alert(error.message);

    }

}


// Load when page opens

loadAnnouncements();
