$(document).ready(function () {
    $("#modal-read-more-contacts").bind("click", function () {
        let skipNumber = $("#contacts").find("li").length;

        $(this).css("display", "none");
        $(".read-more-loading").css("display", "inline-block");

        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, function (newContactsUser) {

            $("#modal-read-more-contacts").css("display", "inline-block");
            $(".read-more-loading").css("display", "none");

            if (!newContactsUser.length) {
                alertify.notify("there is no contacts exist", "error", 7);
                return false;
            }
            newContactsUser.forEach(function (user) {
                $("#contacts")
                    .find("ul").append(`
                    <li class="_contactList" data-uid="${user._id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="" />
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br />
                            <div class="user-address">
                                <span>&nbsp ${(user.address) ? user.address : ""}</span>
                            </div>
                            <div class="user-talk" data-uid="${user._id}">
                                Message
                            </div>
                            <div class="user-remove-contact action-danger" data-uid="${user._id}">
                                Delete contact
                            </div>
                        </div>
                    </li>`);
            })

            removeContact();
        })
    })

    $("#modal-read-more-contacts-send").bind("click", function () {
        let skipNumber = $("#request-contact-sent").find("li").length;

        $(this).css("display", "none");
        $(".read-more-loading").css("display", "inline-block");

        $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, function (newContactsUser) {

            $("#modal-read-more-contacts-send").css("display", "inline-block");
            $(".read-more-loading").css("display", "none");

            if (!newContactsUser.length) {
                alertify.notify("there is no contacts exist", "error", 7);
                return false;
            }
            newContactsUser.forEach(function (user) {
                $("#request-contact-sent")
                    .find("ul").append(`
                    <li class="_contactList" data-uid="${user._id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="" />
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br />
                            <div class="user-address">
                                <span>&nbsp ${(user.address) ? user.address : ""}</span>
                            </div>
                            <div class="user-remove-request-contact action-danger show-request-contact-sent" data-uid="${user._id}">
                                Remove request
                            </div>
                        </div>
                    </li>`);
            })

            removeRequestContactSent();
        })
    })

    $("#modal-read-more-contact-receive").bind("click", function () {
        let skipNumber = $("#request-contact-received").find("li").length;

        $(this).css("display", "none");
        $(".read-more-loading").css("display", "inline-block");

        $.get(`/contact/read-more-contacts-receive?skipNumber=${skipNumber}`, function (newContactsUser) {

            $("#modal-read-more-contact-receive").css("display", "inline-block");
            $(".read-more-loading").css("display", "none");

            if (!newContactsUser.length) {
                alertify.notify("there is no contacts exist", "error", 7);
                return false;
            }
            newContactsUser.forEach(function (user) {
                $("#request-contact-received")
                    .find("ul").append(`
                    <li class="_contactList" data-uid="${user._id}">
                        <div class="contactPanel">
                            <div class="user-avatar">
                                <img src="images/users/${user.avatar}" alt="" />
                            </div>
                            <div class="user-name">
                                <p>
                                    ${user.username}
                                </p>
                            </div>
                            <br />
                            <div class="user-address">
                                <span>&nbsp ${(user.address) ? user.address : ""}</span>
                            </div>
                            <div class="user-acccept-contact-received" data-uid="${user._id}">
                                Accept
                            </div>
                            <div class="user-reject-request-contact-received action-danger"
                                data-uid="${user._id}">
                                Reject
                            </div>
                        </div>
                    </li>`);
            })

            removeRequestContactReceived();
            approveRequestContactReceived();
        })
    })
})