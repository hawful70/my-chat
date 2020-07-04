function attachmentChat(divId) {
    $(`#attach-chat-${divId}`).unbind("change").on("change", function () {
        let fileData = $(this).prop("files")[0];
        let limit = 1048576; // byte = 1MB

        if (fileData.size > limit) {
            alertify.notify("file size maximum 1MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isChatGroup = false

        let mesageFormData = new FormData();
        mesageFormData.append("my-attach-chat", fileData);
        mesageFormData.append("uid", targetId);
        if ($(this).hasClass("chat-in-group")) {
            mesageFormData.append("isChatGroup", true);
            isChatGroup = true;
        }

        $.ajax({
            url: "/message/add-new-attachment",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: mesageFormData,
            success: function (data) {
                console.log(data);
                let dataToEmit = {
                    message: data.message
                }
                let messageOfMe = $(`<div class="bubble me bubble-attach-file" data-mess-id="${data.message._id}"></div>`);
                let attachmentChat = `<a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
                                            download="${data.message.file.fileName}">
                                            ${data.message.file.fileName}
                                        </a>`
                if (isChatGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
                    title="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
                    dataToEmit.groupId = targetId;
                } else {
                    messageOfMe.html(`${attachmentChat}`);
                    dataToEmit.contactId = targetId;
                }

                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("en").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html("File ....");

                $(`.person[data-chat=${divId}]`).on("action.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("action.moveConversationToTop");
                })
                $(`.person[data-chat=${divId}]`).trigger("action.moveConversationToTop");

                socket.emit("chat-attachment", dataToEmit);

                let attachmentChatModal = `<li>
                                <a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
                                    download="${data.message.file.fileName}">
                                    ${data.message.file.fileName}
                                </a>
                            </li>`;
                $(`#attachsModal_${divId}`).find("ul.list-attachs").append(attachmentChatModal);
            },
            error: function (error) {
                alertify.notify(error.responseText, "error", 7);
            }
        })
    })
}

socket.on("response-chat-attachment", function (response) {
    let divId = "";
    let messageOfYou = $(`<div class="bubble you bubble-attach-file" data-mess-id="${response.message._id}"></div>`);
    let attachmentChat = `<a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
                                            download="${response.message.file.fileName}">
                                            ${response.message.file.fileName}
                                        </a>`
    if (response.currentGroupId) {
        let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small"
                    title="${response.message.sender.name}" />`;
        messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
        divId = response.currentGroupId;
    } else {
        messageOfYou.html(`${attachmentChat}`);
        divId = response.currentUserId;
    }


    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("en").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("File ....");

    $(`.person[data-chat=${divId}]`).on("action.moveConversationToTop", function () {
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("action.moveConversationToTop");
    })
    $(`.person[data-chat=${divId}]`).trigger("action.moveConversationToTop");

    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
        nineScrollRight(divId);
        $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");

        let attachmentChatModal = `<li>
                                <a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
                                    download="${response.message.file.fileName}">
                                    ${response.message.file.fileName}
                                </a>
                            </li>`;
        $(`#attachsModal_${divId}`).find("ul.list-attachs").append(attachmentChatModal);
    }

})