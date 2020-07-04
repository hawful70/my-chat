$(document).ready(function () {
    $("#popup-mark-all-as-read").bind("click", markAllRead)

    $("#modal-mark-all-as-read").bind("click", markAllRead)

    function markAllRead() {
        let targetUsers = [];
        let idComponent = this.id;
        if (idComponent === "popup-mark-all-as-read") {
            $(".noti_content").find("div.noti-readed-false").each(function (index, notification) {
                let userId = $(notification).data("uid");
                targetUsers.push(userId);
            })
        } else {
            $("ul.list-notifications").find("li>div.noti-readed-false").each(function (index, notification) {
                let userId = $(notification).data("uid");
                targetUsers.push(userId);
            })
        }

        if (targetUsers.length > 0) {
            markAllReadAjax(targetUsers)
        }
    }

    function markAllReadAjax(targetUsers) {
        $.ajax({
            url: "/notification/mark-all-as-read",
            type: "put",
            data: {
                targetUsers: targetUsers
            },
            success: function (result) {
                if (result) {
                    targetUsers.forEach(function (uid) {
                        $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("noti-readed-false");
                        $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("noti-readed-false");
                    })
                    decreaseNumberNotification("noti_counter", targetUsers.length);
                }
            }
        })
    }
})