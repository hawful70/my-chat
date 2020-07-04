function imageChat(divId) {
    $(`#image-chat-${divId}`).unbind("change").on("change", function () {
        let fileData = $(this).prop("files")[0];
        let math = ["image/png", "image/jpg", "image/jpeg"];
        let limit = 1048576; // byte = 1MB
        if ($.inArray(fileData.type, math) === -1) {
            alertify.notify("file type not correct, only accept jpg & png", "error", 7);
            $(this).val(null);
            return false;
        }

        if (fileData.size > limit) {
            alertify.notify("file size maximum 1MB", "error", 7);
            $(this).val(null);
            return false;
        }

        let targetId = $(this).data("chat");
        let isChatGroup = false

        let mesageFormData = new FormData();
        mesageFormData.append("my-image-chat", fileData);
        mesageFormData.append("uid", targetId);
        if ($(this).hasClass("chat-in-group")) {
            mesageFormData.append("isChatGroup", true);
            isChatGroup = true;
        }

        $.ajax({
            url: "/message/add-new-image",
            type: "post",
            cache: false,
            contentType: false,
            processData: false,
            data: mesageFormData,
            success: function (data) {

                let dataToEmit = {
                    message: data.message
                }
                let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
                let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat" />`
                if (isChatGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
                    title="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} ${imageChat}`);
                    dataToEmit.groupId = targetId;
                } else {
                    messageOfMe.html(`${imageChat}`);
                    dataToEmit.contactId = targetId;
                }

                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("en").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html("Picture ....");

                $(`.person[data-chat=${divId}]`).on("action.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("action.moveConversationToTop");
                })
                $(`.person[data-chat=${divId}]`).trigger("action.moveConversationToTop");

                socket.emit("chat-image", dataToEmit);

                let imageChatModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" />`;
                $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatModal);
            },
            error: function (error) {
                alertify.notify(error.responseText, "error", 7);
            }
        })
    })
}

socket.on("response-chat-image", function (response) {
    let divId = "";
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let imageChat = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat" />`
    if (response.currentGroupId) {
        let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small"
                    title="${response.message.sender.name}" />`;
        messageOfYou.html(`${senderAvatar} ${imageChat}`);
        divId = response.currentGroupId;
    } else {
        messageOfYou.html(`${imageChat}`);
        divId = response.currentUserId;
    }


    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("en").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Picture ....");

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

        let imageChatModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" />`;
        $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatModal);
    }

})