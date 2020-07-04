function removeRequestContactReceived() {
    $(".user-reject-request-contact-received").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-request-contact-received",
            type: "delete",
            data: {
                uid: targetId
            },
            success: function (data) {
                if (data.success) {
                    decreaseNumberNotification("noti_contact_counter", 1);
                    decreaseNumberNotiContact("count-request-contact-received");

                    $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

                    socket.emit("remove-request-contact-received", {
                        contactId: targetId
                    })
                }
            }
        })
    })
}

socket.on("response-remove-request-contact-received", function (user) {
    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${user.id}]`).hide();
    $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");


    $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();


    decreaseNumberNotiContact("count-request-contact-sent");
    decreaseNumberNotification("noti_contact_counter", 1);

})

$(document).ready(function () {
    removeRequestContactReceived();
})