const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(devId) {
  $(`.right .chat[data-chat = ${devId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });

  if ($(`.right .chat[data-chat = ${devId}]`)[0]) {
    $(`.right .chat[data-chat = ${devId}]`).scrollTop($(`.right .chat[data-chat = ${devId}]`)[0].scrollHeight);
  }
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
        if (this.getText().length > 0) {
          typingOn(divId)
        }
      },
      click: function () {
        textAndEmojiChat(divId)
      },
      blur: function () {
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.master-loader').css('display', 'none');
}

function spinLoading() {
  $('.master-loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $('.main-content').click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function () {
    let href = $(this).attr("href");
    let modalImagesId = href.replace("#", "");

    let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();

    let countRows = Math.ceil($(`#${modalImagesId}`).find('div.all-images>img').length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");
    $(`#${modalImagesId}`).find('div.all-images').photosetGrid({
      highresLinks: true,
      rel: 'withhearts-gallery',
      gutter: '2px',
      layout: layoutStr,
      onComplete: function () {
        $(`#${modalImagesId}`).find('.all-images').css({
          'visibility': 'visible'
        });
        $(`#${modalImagesId}`).find('.all-images a').colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: '90%',
          maxWidth: '90%'
        });
      }
    });

    $(`#${modalImagesId}`).on('hidden.bs.modal', function () {
      $(this).find("div.modal-body").html(originDataImage);
    })
  })

}



function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");

    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  })
}

function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function () {
    let divId = $(this).find("li").data("chat");
    $(".person").removeClass("active");
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");

    nineScrollRight(divId);

    enableEmojioneArea(divId);

    imageChat(divId);

    attachmentChat(divId);

    videoChat(divId);
  })
}

function bufferToBase64(buffer) {
  return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''))
}

$(document).ready(function () {

  showModalContacts();


  configNotification();


  nineScrollLeft();

  ajaxLoading();

  gridPhotos(5);


  flashMasterNotify();

  changeTypeChat();

  changeScreenChat();

  $("ul.people").find("a")[0].click();

});