import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import cookieParser from 'cookie-parser';

import configViewEngine from './config/viewEngine';
import connectDB from './config/connectDB';
import initPassportLocal from './controllers/passportController/local';
import initPassportFacebook from './controllers/passportController/facebook';
import initRoutes from './routes/web';
import initSockets from './sockets/index';
import configSocketIo from './config/socketIo';
import * as configApp from "./config/app";
import events from 'events';

const app = express();

events.EventEmitter.defaultMaxListeners = configApp.app.app_max_events;

let server = http.createServer(app);
let io = socketio(server);

const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({
    url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    autoReconnect: true
    //autoRemove: "native"
})

connectDB();

app.use(session({
    key: process.env.SECTION_KEY,
    secret: process.env.SECTION_SECRET,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

configViewEngine(app);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(connectFlash());

app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

initPassportLocal()
initPassportFacebook();
initRoutes(app);

configSocketIo(io, cookieParser, sessionStore);
initSockets(io);

const PORT = process.env.PORT || 6000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));