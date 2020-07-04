import passportSocketIo from 'passport.socketio';

const configSocketIo = (io, cookieParser, sessionStore) => {
    io.use(passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: process.env.SECTION_KEY,
        secret: process.env.SECTION_SECRET,
        store: sessionStore,
        success: (data, accept) => {
            if (!data.user.logged_in) {
                return accept("Invalid user", false);
            }
            return accept(null, true);
        },
        fail: (data, message, error, accept) => {
            if (error) {
                console.log('failed connection to socket.io:', message);
                return accept(new Error(message), false);
            }
        }
    }));
}

module.exports = configSocketIo;