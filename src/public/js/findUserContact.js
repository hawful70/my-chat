function callFindUsers(element) {
    if (element.which === 13 || element.type === "click") {
        let keyword = $("#input-find-users-contact").val();

        if (!keyword.length) {
            alertify.notify("You must input the keyword", "error", 7);
            return false;
        }

        $.get(`/contact/find-users/${keyword}`, function (data) {
            $("#find-user ul").html(data);
            addContact();
            removeRequestContactSent();
        })
    }
}

$(document).ready(function () {
    $("#input-find-users-contact").bind("keypress", callFindUsers)
    $("#btn-find-users-contact").bind("click", callFindUsers)
})