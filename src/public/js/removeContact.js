function removeContact() {
    $(".user-remove-contact").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        $.ajax({
            url: "/contact/remove-contact",
            type: "delete",
            data: {
                uid: targetId
            },
            success: function (data) {
                if (data.success) {
                    $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
                    decreaseNumberNotiContact("count-contacts");

                    socket.emit("remove-contact", {
                        contactId: targetId
                    })
                }
            }
        })
    })
}

socket.on("response-remove-contact", function (user) {
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
    decreaseNumberNotiContact("count-contacts");

})

$(document).ready(function () {
    removeContact();
})