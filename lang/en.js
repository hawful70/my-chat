export const transValidation = {
    email_incorrect: "email is incorrent",
    gender_incorrect: "gender is incorrent",
    password_incorrect: "password is at least 8 characters",
    password_confirmation_incorrect: "password confirm is not correct",
    update_username: "username is limited in 3 to 17 characters, no special characters",
    update_gender: "gender is incorrect. ",
    update_address: "address is limited in 30 characters",
    update_phone: "phone is required, start with 0, limit in 10 numbers",
    keyword: "You must input the keyword"
}

export const transError = {
    email_in_use: "email is exist",
    token_undefined: "You already actived account.",
    login_fail: "there is something wrong with your email or password",
    account_not_active: "you've not actived account yet.",
    acount_undefined: "your account not exist",
    server_error: "there is error in system. Please contact IT department to support.",
    avatar_type: "file type not correct, only accept jpg & png",
    avatar_size: "file size maximum 1MB",
    user_current_password: "Your current password in incorrect. ",
    conversation_not_found: "conversation not found",
    attachment_size: "attachment file size maximum 1MB",
}

export const transSuccess = {
    userCreated: (email) => {
        return `you are successfull to register with ${email}. Please check your email to verify account`
    },
    account_active_success: "your account is actived successfully. You can login with your email.",
    login_success: (username) => {
        return `Hello ${username}`;
    },
    logout_success: "Log out successfully",
    user_info_updated: "Update information successfully. ",
    user_password_updated: "Update password successfully"
}

export const transMail = {
    subject: "Awesome chat: confirm activate account",
    template: (linkVerify) => {
        return `
            <h2>this email's from Awesome chat</h2>
            <h3>please click the link below to activate account<h3>
            <h3><a href="${linkVerify}" target="blank">Confirm Awesome chat</a><h3>
        `
    },
    send_failed: "there is error during sending confirmation email. please contact admin to support"
}