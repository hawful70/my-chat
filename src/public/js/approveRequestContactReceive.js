function approveRequestContactReceived() {
    $(".user-acccept-contact-received").unbind("click").on("click", function () {
        let targetId = $(this).data("uid");
        let targetName = $(this).parent().find("div.user-name").text().trim();
        let targetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");

        $.ajax({
            url: "/contact/approve-request-contact-received",
            type: "put",
            data: {
                uid: targetId
            },
            success: function (data) {
                if (data.success) {
                    let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
                    $(userInfo).find("div.user-acccept-contact-received").remove();
                    $(userInfo).find("div.user-reject-request-contact-received").remove();
                    $(userInfo).find("div.contactPanel").append(`
                    <div class="user-talk" data-uid="${targetId}">
                        Message
                    </div>
                    <div class="user-remove-contact action-danger" data-uid="${targetId}">
                        Delete contact
                    </div>
                    `);

                    let userInfoHTML = userInfo.get(0).outerHTML;
                    $("#contacts").find("ul").prepend(userInfoHTML);
                    $(userInfo).remove();

                    decreaseNumberNotiContact("count-request-contact-received");
                    increaseNumberNotiContact("count-contacts");

                    decreaseNumberNotification("noti_contact_counter", 1);

                    removeContact();

                    socket.emit("approve-request-contact-received", {
                        contactId: targetId
                    })

                    $("#contactsModal").modal("hide");

                    let subUserName = targetName;
                    if (subUserName.length > 15) {
                        subUserName = subUserName.substr(0, 12) + `<span>...</span>`
                    }
                    let leftSideData = `
                    <a href="javascript:void(0)" class="room-chat" data-target="#to_${targetId}">
                        <li class="person group-chat" data-chat="${targetId}">
                            <div class="left-avatar">
                                <div class="dot"></div>
                                <img src="${targetAvatar}" alt="" />
                            </div>
                            <span class="name">
                                ${subUserName}
                            </span>
                            <span class="time">
                            </span>
                            <span class="preview">
                            </span>
                        </li>
                    </a>
                    `
                    $("#all-chat").find("ul").prepend(leftSideData);
                    $("#user-chat").find("ul").prepend(leftSideData);

                    let rightSideData = `
                    <div class="right tab-pane" data-chat="${targetId}"
                        id="to_${targetId}">
                        <div class="top">
                            <span>To: <span class="name">${targetName}</span></span>
                            <span class="chat-menu-right">
                                <a href="#attachsModal_${targetId}" class="show-attachs" data-toggle="modal">
                                    Attach files
                                    <i class="fa fa-paperclip"></i>
                                </a>
                            </span>
                            <span class="chat-menu-right">
                                <a href="javascript:void(0)">&nbsp;</a>
                            </span>
                            <span class="chat-menu-right">
                                <a href="#imagesModal_${targetId}" class="show-images" data-toggle="modal">
                                    Pictures
                                    <i class="fa fa-photo"></i>
                                </a>
                            </span>
                        </div>
                        <div class="content-chat">
                            <div class="chat" data-chat="${targetId}">
                            </div>
                        </div>
                        <div class="write" data-chat="${targetId}">
                            <input type="text" class="write-chat" id="write-chat-${targetId}"
                                data-chat="${targetId}" />
                            <div class="icons">
                                <a href="#" class="icon-chat" data-chat="${targetId}"><i class="fa fa-smile-o"></i></a>
                                <label for="image-chat-${targetId}">
                                    <input type="file" id="image-chat-${targetId}" name="my-image-chat"
                                        class="image-chat" data-chat="${targetId}" />
                                    <i class="fa fa-photo"></i>
                                </label>
                                <label for="attach-chat-${targetId}">
                                    <input type="file" id="attach-chat-${targetId}" name="my-attach-chat"
                                        class="attach-chat" data-chat="${targetId}" />
                                    <i class="fa fa-paperclip"></i>
                                </label>
                                <a href="javascript:void(0)" id="video-chat-${targetId}" class="video-chat"
                                    data-chat="${targetId}">
                                    <i class="fa fa-video-camera"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                    `

                    $("#screen-chat").prepend(rightSideData);

                    changeScreenChat();
                    let imageModalChat = `
                        <div class="modal fade" id="imagesModal_${targetId}" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">
                                            &times;
                                        </button>
                                        <h4 class="modal-title">
                                            All Images in this conversation.
                                        </h4>
                                    </div>
                                    <div class="modal-body">
                                        <div class="all-images" style="visibility: hidden;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    $("body").append(imageModalChat);
                    gridPhotos(5);

                    let attachmentModalData = `
                        <div class="modal fade" id="attachsModal_${targetId}" role="dialog">
                            <div class="modal-dialog modal-lg">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">
                                            &times;
                                        </button>
                                        <h4 class="modal-title">
                                            All Attachs in this conversation.
                                        </h4>
                                    </div>
                                    <div class="modal-body">
                                        <ul class="list-attachs">
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                    $("body").append(attachmentModalData);

                    socket.emit("check-status");
                }
            }
        })
    })
}

socket.on("response-approve-request-contact-received", function (user) {
    let noti = `<div class="noti-readed-false" data-uid="${ user.id }">
    <img class="avatar-small" src="images/users/${user.avatar}" alt="" />
    <strong>${user.username}</strong> approved your request
    </div>`;

    $(".noti_content").prepend(noti);
    $("ul.list-notifications").prepend(`<li>${noti}</li>`);
    decreaseNumberNotification("noti_contact_counter", 1);
    increaseNumberNotification("noti_counter", 1);

    decreaseNumberNotiContact("count-request-contact-sent");
    increaseNumberNotiContact("count-contacts");

    $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
    $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();

    let userInfoHTML = `
    <li class="_contactList" data-uid="${user.id}">
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
                <span>&nbsp ${user.address}</span>
            </div>
            <div class="user-talk" data-uid="${user.id}">
                Message
            </div>
            <div class="user-remove-contact action-danger" data-uid="${user.id}">
                Delete contact
            </div>
        </div>
    </li>
    `;

    $("#contacts").find("ul").prepend(userInfoHTML);
    removeContact();

    let subUserName = user.username;
    if (subUserName.length > 15) {
        subUserName = subUserName.substr(0, 12) + `<span>...</span>`
    }
    let leftSideData = `
        <a href="javascript:void(0)" class="room-chat" data-target="#to_${user.id}">
            <li class="person group-chat" data-chat="${user.id}">
                <div class="left-avatar">
                    <div class="dot"></div>
                    <img src="${user.avatar}" alt="" />
                </div>
                <span class="name">
                    ${subUserName}
                </span>
                <span class="time">
                </span>
                <span class="preview">
                </span>
            </li>
        </a>
    `
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#user-chat").find("ul").prepend(leftSideData);

    let rightSideData = `
    <div class="right tab-pane" data-chat="${user.id}"
        id="to_${user.id}">
        <div class="top">
            <span>To: <span class="name">${user.username}</span></span>
            <span class="chat-menu-right">
                <a href="#attachsModal_${user.id}" class="show-attachs" data-toggle="modal">
                    Attach files
                    <i class="fa fa-paperclip"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="#imagesModal_${user.id}" class="show-images" data-toggle="modal">
                    Pictures
                    <i class="fa fa-photo"></i>
                </a>
            </span>
        </div>
        <div class="content-chat">
            <div class="chat" data-chat="${user.id}">
            </div>
        </div>
        <div class="write" data-chat="${user.id}">
            <input type="text" class="write-chat" id="write-chat-${user.id}"
                data-chat="${user.id}" />
            <div class="icons">
                <a href="#" class="icon-chat" data-chat="${user.id}"><i class="fa fa-smile-o"></i></a>
                <label for="image-chat-${user.id}">
                    <input type="file" id="image-chat-${user.id}" name="my-image-chat"
                        class="image-chat" data-chat="${user.id}" />
                    <i class="fa fa-photo"></i>
                </label>
                <label for="attach-chat-${user.id}">
                    <input type="file" id="attach-chat-${user.id}" name="my-attach-chat"
                        class="attach-chat" data-chat="${user.id}" />
                    <i class="fa fa-paperclip"></i>
                </label>
                <a href="javascript:void(0)" id="video-chat-${user.id}" class="video-chat"
                    data-chat="${user.id}">
                    <i class="fa fa-video-camera"></i>
                </a>
            </div>
        </div>
    </div>
    `

    $("#screen-chat").prepend(rightSideData);

    changeScreenChat();
    let imageModalChat = `
        <div class="modal fade" id="imagesModal_${user.id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            &times;
                        </button>
                        <h4 class="modal-title">
                            All Images in this conversation.
                        </h4>
                    </div>
                    <div class="modal-body">
                        <div class="all-images" style="visibility: hidden;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    $("body").append(imageModalChat);
    gridPhotos(5);

    let attachmentModalData = `
        <div class="modal fade" id="attachsModal_${user.id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">
                            &times;
                        </button>
                        <h4 class="modal-title">
                            All Attachs in this conversation.
                        </h4>
                    </div>
                    <div class="modal-body">
                        <ul class="list-attachs">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `
    $("body").append(attachmentModalData);

    socket.emit("check-status");
})

$(document).ready(function () {
    approveRequestContactReceived();
})