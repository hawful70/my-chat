function videoChat(divId) {
    $(`#video-chat-${divId}`).unbind("click").on("click", function () {
        let targetId = $(this).data('chat');
        let callerName = $("#navbar-username").text();

        let dataToEmit = {
            listenerId: targetId,
            callerName
        }

        // Step 01: check listener online or not
        socket.emit("caller-to-check-online", dataToEmit);
    })
}

function playVideoStream(videoTagId, stream) {
    let video = document.getElementById(videoTagId);
    video.srcObject = stream;
    video.onloadeddata = function () {
        video.play();
    }
}

function closeVideoStream(stream) {
    return stream.getTracks().forEach(track => track.stop());
}

$(document).ready(function () {
    // step 02: listener is offline
    socket.on("server-send-listener-is-offline", function (response) {
        alertify.notify("this user is not online at the moment", "error", 5);
    })

    let iceServerList = $("#ice-server-list").val();

    let getPeerId = "";
    const peer = new Peer({
        key: "peerjs",
        host: "peerjs-server-trungquandev.herokuapp.com",
        secure: true,
        debug: 3,
        port: 443,
        config: {
            'iceServers': JSON.parse(iceServerList)
        }
    });

    peer.on("open", function (peerId) {
        getPeerId = peerId;
    })

    // step 03: request peerId of listener
    socket.on("server-request-peer-id-of-listener", function (response) {
        let listenerName = $("#navbar-username").text();

        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName,
            listenerPeerId: getPeerId
        }

        // step 04: send peerId to caller
        socket.emit("listener-emit-peerId-to-server", dataToEmit);
    })

    let timerInterval;
    // step 05
    socket.on("server-send-peer-id-of-listener-to-caller", function (response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        }

        // step 06: request call to server
        socket.emit("caller-request-call-to-server", dataToEmit);

        Swal.fire({
            title: `Calling to &nbsp; <span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; <i class='fa fa-volume-control-phone'></i>`,
            html: `
                Time: <strong style="color: #d43f3a;"></strong> <br/><br/>
                <button id="btn-cancel-call" class="btn btn-danger"> Cancel the call </button>
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000,
            onBeforeOpen: () => {
                $("#btn-cancel-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);


                    // step 07: cancel call
                    socket.emit("caller-cancel-request-call-to-server", dataToEmit);
                });

                if (Swal.getContent().querySelector("strong")) {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000)
                }
            },
            onOpen: () => {
                // step 12
                socket.on("server-send-reject-call-to-caller", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);

                    Swal.fire({
                        type: "info",
                        title: `<span style="color: #2ECC71;">${response.listenerName}</span> &nbsp; is busy`,
                        backdrop: "rgba(85, 85, 85, 0.4)",
                        width: "52rem",
                        allowOutsideClick: false,
                        confirmButtonColor: '#2ECC71',
                        confirmButtonText: 'Yes, confirm!',
                    })
                });
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        }).then(result => {
            return false;
        })
    })

    // step 08
    socket.on("server-send-request-call-to-listener", function (response) {
        let dataToEmit = {
            callerId: response.callerId,
            listenerId: response.listenerId,
            callerName: response.callerName,
            listenerName: response.listenerName,
            listenerPeerId: response.listenerPeerId
        }

        Swal.fire({
            title: ` <span style="color: #2ECC71;">${response.callerName}</span> &nbsp; want to talk <i class='fa fa-volume-control-phone'></i>`,
            html: `
                Time: <strong style="color: #d43f3a;"></strong> <br/><br/>
                <button id="btn-reject-call" class="btn btn-danger"> Reject the call </button>
                <button id="btn-accept-call" class="btn btn-success"> Agree </button>
            `,
            backdrop: "rgba(85, 85, 85, 0.4)",
            width: "52rem",
            allowOutsideClick: false,
            timer: 30000,
            onBeforeOpen: () => {
                $("#btn-reject-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);

                    // step 10
                    socket.emit("listener-reject-request-call-to-server", dataToEmit);
                });
                $("#btn-accept-call").unbind("click").on("click", function () {
                    Swal.close();
                    clearInterval(timerInterval);

                    // step 11
                    socket.emit("listener-accept-request-call-to-server", dataToEmit);
                });

                if (Swal.getContent().querySelector("strong")) {
                    Swal.showLoading();
                    timerInterval = setInterval(() => {
                        Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
                    }, 1000)
                }
            },
            onOpen: () => {
                // step 09
                socket.on("server-send-cancel-request-call-to-listener", function (response) {
                    Swal.close();
                    clearInterval(timerInterval);
                });

            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        }).then(result => {
            return false;
        })
    })

    socket.on("server-send-accept-call-to-caller", function (response) {
        Swal.close();
        clearInterval(timerInterval);

        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        getUserMedia({
            video: true,
            audio: true
        }, function (stream) {
            $("#streamModal").modal("show");

            playVideoStream("local-stream", stream);
            var call = peer.call(response.listenerPeerId, stream);

            call.on('stream', function (remoteStream) {
                playVideoStream("remote-stream", remoteStream);
            });

            $("#streamModal").on("hidden.bs.modal", function () {
                closeVideoStream(stream);
            })

        }, function (err) {
            console.log('Failed to get local stream', err);
        });
    });

    socket.on("server-send-accept-call-to-listener", function (response) {
        Swal.close();
        clearInterval(timerInterval);

        var getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on('call', function (call) {
            getUserMedia({
                video: true,
                audio: true
            }, function (stream) {
                $("#streamModal").modal("show");
                playVideoStream("local-stream", stream);

                call.answer(stream); // Answer the call with an A/V stream.
                call.on('stream', function (remoteStream) {
                    playVideoStream("remote-stream", remoteStream);
                });

                $("#streamModal").on("hidden.bs.modal", function () {
                    closeVideoStream(stream);
                })
            }, function (err) {
                console.log('Failed to get local stream', err);
            });
        });
    });
});