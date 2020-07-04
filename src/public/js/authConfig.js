localStorage.setItem("isActiveLoginForm", false)

function getActiveForm() {
  return localStorage.getItem("isActiveLoginForm");
}

function showRegisterForm(isRemoveMes) {
  localStorage.setItem("isActiveLoginForm", false)
  $('.loginBox').fadeOut('fast', function () {
    $('.registerBox').fadeIn('fast');
    $('.login-footer').fadeOut('fast', function () {
      $('.register-footer').fadeIn('fast');
    });
    $('.modal-title').html('Register new account');
  });
  if (isRemoveMes) {
    removeMessage();
  }

}

function showLoginForm(isRemoveMes) {
  localStorage.setItem("isActiveLoginForm", true)
  $('#loginModal .registerBox').fadeOut('fast', function () {
    $('.loginBox').fadeIn('fast');
    $('.register-footer').fadeOut('fast', function () {
      $('.login-footer').fadeIn('fast');
    });

    $('.modal-title').html('Login');
  });
  if (isRemoveMes) {
    removeMessage();
  }
}

function removeMessage() {
  var dangerElem = $('.modal-body').find('.alert-danger');
  var successElem = $('.modal-body').find('.alert-success');
  if (dangerElem.length > 0) {
    $(".modal-body").find('.alert-danger').removeClass("alert-danger")
  }
  if (successElem.length > 0) {
    $(".modal-body").find('.alert-success').removeClass("alert-success")
  }
}

function openLoginModal(isRemoveMes) {
  setTimeout(function () {
    $('#loginModal').modal('show');
    showLoginForm(isRemoveMes);
  }, 230);
}

function openRegisterModal(isRemoveMes) {
  setTimeout(function () {
    $('#loginModal').modal('show');
    showRegisterForm(isRemoveMes);
  }, 230);
}