$(document).ready(function () {
    $("#modal-read-more-noti").bind("click", function () {
        let skipNumber = $("ul.list-notifications").find("li").length;

        $(this).css("display", "none");
        $(".read-more-loading").css("display", "inline-block");

        $.get(`/notification/read-more?skipNumber=${skipNumber}`, function (notifications) {

            $("#modal-read-more-noti").css("display", "inline-block");
            $(".read-more-loading").css("display", "none");

            if (!notifications.length) {
                alertify.notify("there is no notifications exist", "error", 7);
                return false;
            }
            notifications.forEach(function (notification) {
                $("ul.list-notifications").append(`<li>${notification}</li>`);
            })
        })
    })
})