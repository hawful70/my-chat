function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("keyup").on("keyup", function (element) {
        let currentEmojiArea = $(this);
        if (element.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val();

            if (!targetId.length || !messageVal.length) {
                return false;
            }

            let dataTextEmojiSend = {
                uid: targetId,
                messageVal: messageVal
            };

            if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiSend.isChatGroup = true
            }

            $.post("/message/add-new-text-emoji", dataTextEmojiSend, function (data) {
                let dataToEmit = {
                    message: data.message
                }
                let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);

                if (dataTextEmojiSend.isChatGroup) {
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
                    title="${data.message.sender.name}" />`;
                    messageOfMe.html(`${senderAvatar} <span>${data.message.text}</span>`);
                    dataToEmit.groupId = targetId;
                } else {
                    messageOfMe.text(data.message.text);
                    dataToEmit.contactId = targetId;
                }

                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                $(`#write-chat-${divId}`).val("");
                currentEmojiArea.find(".emojionearea-editor").text("");

                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("en").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);

                $(`.person[data-chat=${divId}]`).on("action.moveConversationToTop", function () {
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("action.moveConversationToTop");
                })
                $(`.person[data-chat=${divId}]`).trigger("action.moveConversationToTop");

                socket.emit("chat-text-emoji", dataToEmit);

                typingOff(divId);

                let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if (checkTyping.length) {
                    checkTyping.remove();
                }
            }).fail(function (response) {
                alertify.notify(response.responseText, "error", 7);
            });
        }
    })
}

socket.on("response-chat-text-emoji", function (response) {
    let divId = "";

    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
    if (response.currentGroupId) {
        let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small"
                    title="${response.message.sender.name}" />`;
        messageOfYou.html(`${senderAvatar} <span>${response.message.text}</span>`);
        divId = response.currentGroupId;
    } else {
        messageOfYou.text(response.message.text);
        divId = response.currentUserId;
    }

    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
        nineScrollRight(divId);
        $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }


    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("en").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text);

    $(`.person[data-chat=${divId}]`).on("action.moveConversationToTop", function () {
        let dataToMove = $(this).parent();
        $(this).closest("ul").prepend(dataToMove);
        $(this).off("action.moveConversationToTop");
    })
    $(`.person[data-chat=${divId}]`).trigger("action.moveConversationToTop");

})