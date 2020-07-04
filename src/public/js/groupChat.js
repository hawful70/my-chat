function addFriendsToGroup() {
    $('ul#group-chat-friends').find('div.add-user').unbind("click").bind('click', function () {
        let uid = $(this).data('uid');
        $(this).remove();
        let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

        let promise = new Promise(function (resolve, reject) {
            $('ul#friends-added').append(html);
            $('#groupChatModal .list-user-added').show();
            resolve(true);
        });
        promise.then(function (success) {
            $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
        });
    });
}

function cancelCreateGroup() {
    $('#btn-cancel-group-chat').unbind("click").bind('click', function () {
        $('#groupChatModal .list-user-added').hide();
        if ($('ul#friends-added>li').length) {
            $('ul#friends-added>li').each(function (index) {
                $(this).remove();
            });
        }
    });
}

function callSearchFriends(element) {
    if (element.which === 13 || element.type === "click") {
        let keyword = $("#input-search-friends-to-add-group-chat").val();

        if (!keyword.length) {
            alertify.notify("You must input the keyword", "error", 7);
            return false;
        }

        $.get(`/contact/search-friends/${keyword}`, function (data) {
            $("ul#group-chat-friends").html(data);
            addFriendsToGroup();
            cancelCreateGroup();
        })
    }
}

function removeSearchFriend() {
    $("#groupChatModal").on("hidden.bs.modal", function () {
        $("#input-search-friends-to-add-group-chat").val("");
        $("ul#group-chat-friends").empty();;
    })
}

function callCreateGroupChat() {
    $("#btn-create-group-chat").unbind("click").on("click", function () {
        let countUsers = $("ul#friends-added").find("li");
        if (countUsers.length < 2) {
            alertify.notify("Please add more friends to create group, at least 2 people", "error", 7);
            return false;
        }
        let groupChatName = $("#input-name-group-chat").val();
        if (!groupChatName.length) {
            alertify.notify("Please type your group name", "error", 7);
            return false;
        }

        const arrayIds = [];
        $("ul#friends-added").find("li").each(function (index, item) {
            arrayIds.push({
                "userId": $(item).data("uid")
            })
        })

        Swal.fire({
            title: `Are you sure to create a new group ${groupChatName} ?`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, I dont!'
        }).then((result) => {
            if (!result.value) {
                return false;
            }
            $.post("/group-chat/add-new", {
                arrayIds: arrayIds,
                groupChatName: groupChatName
            }, function (data) {
                $("#input-name-group-chat").val("");
                $('#btn-cancel-group-chat').click();
                $("#groupChatModal").modal("hide");

                let subGroupChatName = data.groupChat.name;
                if (subGroupChatName.length > 15) {
                    subGroupChatName = subGroupChatName.substr(0, 12) + `<span>...</span>`
                }
                let leftSideGroup = `
                <a href="javascript:void(0)" class="room-chat" data-target="#to_${data.groupChat._id}">
                    <li class="person" data-chat="${data.groupChat._id}">
                        <div class="left-avatar">
                            <img src="images/users/group-avatar.png" alt="" />
                        </div>
                        <span class="name">
                            <span class="group-chat-name">Group:
                                ${subGroupChatName}
                            </span>
                        </span>
                        <span class="time">
                        </span>
                        <span class="preview">
                        </span>
                    </li>
                </a>`
                $("#all-chat").find("ul").prepend(leftSideGroup);
                $("#group-chat").find("ul").prepend(leftSideGroup);

                let rightSideGroup = `
                <div class="right tab-pane" data-chat="${data.groupChat._id}"
                    id="to_${data.groupChat._id}">
                    <div class="top">
                        <span>To: <span class="name">${data.groupChat.name}</span></span>
                        <span class="chat-menu-right">
                            <a href="#attachsModal_${data.groupChat._id}" class="show-attachs" data-toggle="modal">
                                Attach files
                                <i class="fa fa-paperclip"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                                Pictures
                                <i class="fa fa-photo"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                                <span class="show-number-members">${data.groupChat.userAmount}</span>
                                <i class="fa fa-users"></i>
                            </a>
                        </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${data.groupChat._id}">
                        </div>
                    </div>
                    <div class="write" data-chat="${data.groupChat._id}">
                        <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}"
                            data-chat="${data.groupChat._id}" />
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${data.groupChat._id}">
                                <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                                    class="image-chat chat-in-group" data-chat="${data.groupChat._id}" />
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attach-chat-${data.groupChat._id}">
                                <input type="file" id="attach-chat-${data.groupChat._id}" name="my-attach-chat"
                                    class="attach-chat chat-in-group" data-chat="${data.groupChat._id}" />
                                <i class="fa fa-paperclip"></i>
                            </label>
                        </div>
                    </div>
                </div>`

                $("#screen-chat").prepend(rightSideGroup);

                changeScreenChat();

                let imageModalChat = `
                <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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
                <div class="modal fade" id="attachsModal_${data.groupChat._id}" role="dialog">
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

                socket.emit("new-group-created", {
                    groupChat: data.groupChat
                })

                socket.emit("check-status");

            }).fail(function (response) {
                alertify.notify(response.responseText, "error", 7);
            })
        })
    })
}

$(document).ready(function () {
    $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends)
    $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends)
    removeSearchFriend();
    callCreateGroupChat();

    socket.on("response-new-group-created", function (data) {
        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
            subGroupChatName = subGroupChatName.substr(0, 12) + `<span>...</span>`
        }
        let leftSideGroup = `
                <a href="javascript:void(0)" class="room-chat" data-target="#to_${data.groupChat._id}">
                    <li class="person" data-chat="${data.groupChat._id}">
                        <div class="left-avatar">
                            <img src="images/users/group-avatar.png" alt="" />
                        </div>
                        <span class="name">
                            <span class="group-chat-name">Group:
                                ${subGroupChatName}
                            </span>
                        </span>
                        <span class="time">
                        </span>
                        <span class="preview">
                        </span>
                    </li>
                </a>`
        $("#all-chat").find("ul").prepend(leftSideGroup);
        $("#group-chat").find("ul").prepend(leftSideGroup);

        let rightSideGroup = `
                <div class="right tab-pane" data-chat="${data.groupChat._id}"
                    id="to_${data.groupChat._id}">
                    <div class="top">
                        <span>To: <span class="name">${data.groupChat.name}</span></span>
                        <span class="chat-menu-right">
                            <a href="#attachsModal_${data.groupChat._id}" class="show-attachs" data-toggle="modal">
                                Attach files
                                <i class="fa fa-paperclip"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                                Pictures
                                <i class="fa fa-photo"></i>
                            </a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)">&nbsp;</a>
                        </span>
                        <span class="chat-menu-right">
                            <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                                <span class="show-number-members">${data.groupChat.userAmount}</span>
                                <i class="fa fa-users"></i>
                            </a>
                        </span>
                    </div>
                    <div class="content-chat">
                        <div class="chat" data-chat="${data.groupChat._id}">
                        </div>
                    </div>
                    <div class="write" data-chat="${data.groupChat._id}">
                        <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}"
                            data-chat="${data.groupChat._id}" />
                        <div class="icons">
                            <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                            <label for="image-chat-${data.groupChat._id}">
                                <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                                    class="image-chat chat-in-group" data-chat="${data.groupChat._id}" />
                                <i class="fa fa-photo"></i>
                            </label>
                            <label for="attach-chat-${data.groupChat._id}">
                                <input type="file" id="attach-chat-${data.groupChat._id}" name="my-attach-chat"
                                    class="attach-chat chat-in-group" data-chat="${data.groupChat._id}" />
                                <i class="fa fa-paperclip"></i>
                            </label>
                        </div>
                    </div>
                </div>`

        $("#screen-chat").prepend(rightSideGroup);

        changeScreenChat();

        let imageModalChat = `
                <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
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
                <div class="modal fade" id="attachsModal_${data.groupChat._id}" role="dialog">
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

        socket.emit("member-received-group-chat", {
            groupChatId: data.groupChat._id
        })

        socket.emit("check-status");
    })
})