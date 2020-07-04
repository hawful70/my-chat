var userAvatar = null;
var userInfo = {};
var originAvatarSrc = null;
var originUserInfo = {};

var userUpdatePassword = {};

function callLogout() {
    let timerInterval;
    Swal.fire({
        position: 'top-end',
        title: 'The application will log out after 5s',
        html: "Time: <strong></strong>",
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000)
        },
        onClose: () => {
            clearInterval(timerInterval)
        }
    }).then(result => {
        $.get("/logout", function () {
            location.reload();
        })
    })
}

function updateUserInfo() {
    $("#input-change-avatar").bind("change", function () {
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

        if (typeof (FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty();
            let fileReader = new FileReader();
            fileReader.onload = function (element) {
                $("<img>", {
                    "src": element.target.result,
                    "class": "avatar img-circle",
                    "id": "user-modal-avatar",
                    "alt": "avatar"
                }).appendTo(imagePreview);
            }

            imagePreview.show();
            fileReader.readAsDataURL(fileData);

            let formData = new FormData();
            formData.append("avatar", fileData);
            userAvatar = formData;
        } else {
            alertify.notify("Your browser not support FileRead", "error", 7);
        }
    })

    $("#input-change-username").bind("change", function () {
        let username = $(this).val();
        let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

        if (!regexUsername.test(username) || username.length < 3 || username.length > 17) {
            alertify.notify("username is limited in 3 to 17 characters, no special characters", "error", 7);
            $(this).val(originUserInfo.username);
            delete userInfo.username;
            return false;
        }
        userInfo.username = username;
    })

    $("#input-change-gender-male").bind("click", function () {
        let gender = $(this).val();
        if (gender !== 'male') {
            alertify.notify("gender is incorrect. ", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
    })

    $("#input-change-gender-female").bind("click", function () {
        let gender = $(this).val();
        if (gender !== 'female') {
            alertify.notify("gender is incorrect. ", "error", 7);
            $(this).val(originUserInfo.gender);
            delete userInfo.gender;
            return false;
        }
        userInfo.gender = gender;
    })

    $("#input-change-address").bind("change", function () {
        let address = $(this).val();
        if (address.length < 3 || address.length > 30) {
            alertify.notify("address is limited in 30 characters", "error", 7);
            $(this).val(originUserInfo.address);
            delete userInfo.address;
            return false;
        }

        userInfo.address = address;
    })



    $("#input-change-phone").bind("change", function () {
        let phone = $(this).val();
        let regexPhone = new RegExp(/^(0)[0-9]{9,10}$/);
        if (!regexPhone.test(phone)) {
            alertify.notify("phone is required, start with 0, limit in 10 or 11 numbers", "error", 7);
            $(this).val(originUserInfo.phone);
            delete userInfo.phone;
            return false;
        }

        userInfo.phone = phone;
    })

    $("#input-current-password").bind("change", function () {
        let currentPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!regexPassword.test(currentPassword)) {
            alertify.notify("password is at least 8 characters, along with special characters", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.currentPassword;
            return false;
        }

        userUpdatePassword.currentPassword = currentPassword;
    })

    $("#input-new-password").bind("change", function () {
        let newPassword = $(this).val();
        let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!regexPassword.test(newPassword)) {
            alertify.notify("password is at least 8 characters, along with special characters", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.newPassword;
            return false;
        }

        userUpdatePassword.newPassword = newPassword;
    })

    $("#input-confirm-new-password").bind("change", function () {
        let confirmNewPassword = $(this).val();

        if (!userUpdatePassword.newPassword) {
            alertify.notify("You not input new password", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }

        if (confirmNewPassword !== userUpdatePassword.newPassword) {
            alertify.notify("Confirm password not match", "error", 7);
            $(this).val(null);
            delete userUpdatePassword.confirmNewPassword;
            return false;
        }

        userUpdatePassword.confirmNewPassword = confirmNewPassword;
    })
}

function resetUserInfo() {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);

    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === 'male') ? $("#input-change-gender-male").click(): $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);
}

function resetUserPassword() {
    userUpdatePassword = {}
    $("#input-current-password").val(null);
    $("#input-new-password").val(null);
    $("#input-confirm-new-password").val(null);
}

function callUpdateAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put",
        cache: false,
        contentType: false,
        processData: false,
        data: userAvatar,
        success: function (result) {
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            $("#navbar-avatar").attr("src", result.imageSrc);
            originAvatarSrc = result.imageSrc;

            resetUserInfo()
        },
        error: function (error) {
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            resetUserInfo()
        }
    })
}

function callUpdateUserInfo() {
    $.ajax({
        url: "/user/update-info",
        type: "put",
        data: userInfo,
        success: function (result) {
            $(".user-modal-alert-success").find("span").text(result.message);
            $(".user-modal-alert-success").css("display", "block");

            originUserInfo = Object.assign(originUserInfo, userInfo);

            $("#navbar-username").text(originUserInfo.username);

            resetUserInfo()
        },
        error: function (error) {
            $(".user-modal-alert-error").find("span").text(error.responseText);
            $(".user-modal-alert-error").css("display", "block");

            resetUserInfo()
        }
    })
}

function callUpdateUserPassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put",
        data: userUpdatePassword,
        success: function (result) {
            $(".user-modal-password-alert-success").find("span").text(result.message);
            $(".user-modal-password-alert-success").css("display", "block");
            resetUserPassword()
            callLogout();
        },
        error: function (error) {
            $(".user-modal-password-alert-error").find("span").text(error.responseText);
            $(".user-modal-password-alert-error").css("display", "block");
            resetUserPassword()
        }
    })
}

$(document).ready(function () {
    originAvatarSrc = $("#user-modal-avatar").attr("src");
    originUserInfo = {
        username: $("#input-change-username").val(),
        gender: $("#input-change-gender-male").is(":checked") ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(),
        phone: $("#input-change-phone").val()
    }

    updateUserInfo();

    $("#input-btn-update-user").bind("click", function () {
        if ($.isEmptyObject(userInfo) && !userAvatar) {
            alertify.notify("You must change information before update", "error", 7);
            return false;
        }

        if (userAvatar) {
            callUpdateAvatar()
        }

        if (!$.isEmptyObject(userInfo)) {
            callUpdateUserInfo()
        }

    })
    $("#input-btn-cancel-user").bind("click", function () {
        resetUserInfo()
    })

    $("#input-btn-update-user-password").bind("click", function () {
        if (!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
            alertify.notify("You must change password before update", "error", 7);
            return false;
        }

        Swal.fire({
            title: 'Are you sure to change password?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#2ECC71',
            cancelButtonColor: '#ff7675',
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, I dont!'
        }).then((result) => {
            if (result.value) {
                callUpdateUserPassword();
            } else {
                resetUserPassword();
            }
        })


    })

    $("#input-btn-cancel-user-password").bind("click", function () {
        resetUserPassword();
    })
})