module.exports = function Game(app, express, server, io, sessionObj) {

    const colors = require('colors');

    const crypto = require('crypto');
    const sqlite3 = require('sqlite3');
    const passport = require('passport');
    const passportInit = passport.initialize();
    const passportSession = passport.session();
    const LocalStrategy = require('passport-local').Strategy

    //const app = require("https-localhost")()
    const fs = require("fs");

    var passedArgs = process.argv.slice(2);
    console.log(passedArgs)

    //var io = require('socket.io')(server)
    //var passportSocketIo = require('passport.socketio');


    //var sharedsession = require("express-socket.io-session");



    /*

        app.use(passportInit);
        app.use(passportSession);*/


    //Obviously these aren't actually constants per all caps naming convention, but just emphasizing how important these "hashes" are
    var USERS = [];
    var GUESTS = {};
    var GUEST_ROOM_HASH = {};
    var ROOM_LOGS = {};

    var possibleUsers = []; //TODO get rid of this lol
    var lastChats = [];

    var roomCounter = 0;






    const { Sequelize, Model, DataTypes } = require('sequelize');
    //const sequelize = new Sequelize('sqlite');
    const sequelize = new Sequelize('database', 'username', 'password', {
        host: 'localhost',
        storage: './oneshotChat.sqlite',
        dialect: 'sqlite',
        // one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' 
        logging: false,
    });

    class User extends Model {}
    User.init({
        username: DataTypes.STRING,
        salt: DataTypes.STRING,
        password: DataTypes.STRING,
        //birthday: DataTypes.DATE
        color: DataTypes.STRING,
        sessionID: DataTypes.STRING,
        online: false,
        room: DataTypes.STRING,
    }, { sequelize, modelName: 'user' });



    function makeUser(name, color, pin, callback) {
        if (name && color && pin != undefined) {
            User.create({
                username: name,
                color: color,
                pin: pin,
                room: "admin"
            }).then(() => {
                callback();
            }).catch(() => {
                console.log('Something went wrong with creating user')
            });
        } else {
            console.log('Missing data to create user')
        }
    }

    function getUser(id, callback) {
        User.findOne({ where: { id: id } }).then(user => {
            callback(user)
        }).catch(e => {

        });
    }

    function getUsers(callback) {
        User.findAll().then(users => {
            callback(users)
        }).catch(e => {

        })
    }


    function pullUser(sessionID, callback) {
        User.findOne({ where: { sessionID: sessionID } }).then(user => {
            callback(user);
        })
    }




    (async () => {
        if (passedArgs[0] == 'purge') {
            console.log('P U R G I N G  DB'.red)
            await sequelize.sync({ force: true });
            let contents = [
                /*['Nick', '?notThatSecure?', 'salt', '#7EBB1D'],
                ['Heather', '?extremelyBadLogin?', 'uhhh', '#A44AB6'],*/
                //these aren't even injected lol
            ]

            contents.forEach(stuff => {
                let person = User.create({
                    username: stuff[0],
                    //birthday: new Date(1980, 6, 20)
                    salt: stuff[2],
                    color: stuff[3],
                    password: hashPassword(stuff[1], stuff[2]),
                    room: "admin",
                });
            })
            await sequelize.sync();
        } else {
            await sequelize.sync();
        }


        const users = await User.findAll();
        users.forEach(user => {
            possibleUsers.push({ id: user.id, username: user.username, color: user.color });

        })

        console.log('[[ OneSHot user Count  %i ]]', users.length)
        console.log('=====[[ oneshotChat Start ]]===='.underline.bgCyan)




    })();

    function hashPassword(password, salt) {
        var hash = crypto.createHash('sha256');
        hash.update(password);
        hash.update(salt);
        return hash.digest('hex');
    }

    passport.use(new LocalStrategy({ usernameField: "username", passwordField: "password" }, function(username, password, done) {
        console.log('? attempt login for ', username)
        User.findOne({ where: { username: username } }).then(user => {
            console.log('DEV_ONESHOT:hash check::', username, password, user.salt)
            var hash = hashPassword(password, user.salt);
            if (user.password == hash) {
                return done(null, user);
            }
            return done(null, false);
        }).catch(e => {
            return done(null, false);
        })
    }));


    app.use(express.static(__dirname + '/public'));
    //app.use('dev.makeavoy.com', express.static(__dirname + '/public'))

    app.get('/*', function(req, res, next) {
        res.setHeader('Last-Modified', (new Date()).toUTCString());
        res.setHeader('Cache-Control', 'no-cache'); //max-age=14400');
        res.header('Content-Security-Policy', "img-src 'self'");
        next();
    });

    app.post('/login', function(req, res, next) {
        passport.authenticate('local', function(error, user, info) {

            console.log('* session ', req.sessionID)
            if (user) {
                console.log('- login for ', user.username, ':', user.id)
            } else {
                console.log('- bad login'.yellow)
            }

            if (error) {
                res.status(401).send({ message: error });
            } else if (!user) {
                res.status(401).send({ message: info });
            } else {
                user.sessionID = req.sessionID;
                user.online = true;
                USERS[req.sessionID] = user;
                user.save();
                res.status(200).send({ id: user.id, message: 'logged in!' });
                //next();
            }
        })(req, res);
        //},
    });

    //function(req, res) {
    //    res.status(200).send({ message: 'logged in!' });
    //});

    app.post('/getUsers', function(req, res, next) {
        console.log('* sending users ', possibleUsers.length)
        res.send({ users: possibleUsers });
    })
    app.post('/lastChats', function(req, res, next) {
        res.send({ array: lastChats });
    })


    const oneshotSpace = io.of('/oneshot'); ///'/dand-dev');

    oneshotSpace.use(function(socket, next) {
        console.log('* passed session through io socket')
        sessionObj(socket.request, {}, next); //socket.request.res || {}
    });


    // oneshotSpace.use((socket, next) => {
    //     // ensure the user has sufficient rights
    //     next();
    // });


    // adminNamespace.on('connection', socket => {
    //   socket.on('delete user', () => {

    //   });
    // });

    var me;
    //var users = [];
    var sockets = [];

    var count = -1;

    oneshotSpace.on('connection', function(socket) {
        console.log('oneshot connecting...');
        if (!socket.request.session) {
            console.log("! socket session doesn't exist!".red);
            return;
        }

        console.log('socket session id ', socket.request.session.id)

        evaluateUser(socket.request.session, user => {

            if (!user) { //well we should have something!
                socket.disconnect('reauth');
                console.log('- kicked null user'.yellow)
            } else {
                //socket nodes
                user.socketId = socket.id;
                if (user.guest) {
                    console.log('-socket connected to a guest:', user.username);
                    socket.join('' + user.room)
                    socket.emit('guest', user ? user.username : 'Unknown');
                    oneshotSpace.to('' + user.room).emit('join', user ? user.username : 'Unknown');
                } else {
                    console.log('-socket connected to user:', user.username);

                    //let user = USERS[socket.request.session.id];
                    socket.join('' + user.room)
                    oneshotSpace.to('' + user.room).emit('join', user ? user.username : 'Unknown');
                    let conversation = ROOM_LOGS[user.room];
                    socket.emit('admin', user.username, Object.values(GUESTS), conversation);

                    socket.on('switch', function(room) {
                        let user = getUserObject(socket.request.session);
                        oneshotSpace.to('' + user.room).emit('leave', user.username);

                        socket.join('' + room);
                        let conversation = ROOM_LOGS[room];
                        socket.emit('switched', room, conversation);
                        user.room = room;
                        oneshotSpace.to('' + user.room).emit('join', user.username);
                        user.save();
                    });
                    socket.on('deleteRoom', function(room) {
                        socket.join('admin');
                        deleteRoom(room)
                        let conversation = ROOM_LOGS[room];
                        socket.emit('admin', user.username, Object.values(GUESTS), conversation);
                    })
                    socket.on('deleteAllRooms', function() {
                        socket.join('admin');
                        let array = Object.values(GUESTS)
                        array.forEach(guest => {
                            deleteRoom(guest.room)
                        })
                    })


                    socket.on('sysMessage', function(m, type) {
                        oneshotSpace.emit('sysMessage', m, type)
                    })
                }


            }
        });

        socket.on('disconnect', function() {
            /*if(socket.request.session.id) {
                let user = USERS[socket.request.session.id];
                user.online = false;
                user.save();
            }*/
            let user = getUserObject(socket.request.session);
            if (user) {
                if (user.room) {
                    let timestamp = Date.now()
                    let conversation = ROOM_LOGS[user.room];
                    if (!conversation)
                        ROOM_LOGS[user.room] = [
                            [timestamp, 'System', user.username + ' closed chat']
                        ]
                    else
                        conversation.push([timestamp, 'System', user.username + ' closed chat']);

                    oneshotSpace.to('' + user.room).emit('leave', user.username);
                }
                if (user.socket)
                    user.socket = undefined
            }

            console.log('lost connection to user')
        });
        socket.on('message', function(m) {
            let user = getUserObject(socket.request.session);
            //lastChats.push([user.id, m]);
            //if (lastChats.length > 10)
            //lastChats.shift()
            if (user) {
                let timestamp = Date.now()
                if (user.room) {
                    let conversation = ROOM_LOGS[user.room];
                    if (!conversation)
                        ROOM_LOGS[user.room] = [
                            [timestamp, user.username, m]
                        ]
                    else
                        conversation.push([timestamp, user.username, m]);
                }
                oneshotSpace.to('' + user.room).emit('message', user.username, m, timestamp)
            } else {
                socket.disconnect('kicked')
            }
            /*User.findOne({ which: { username: user } }).then(o => {
                console.log('messaged with id ', o ? o.username : undefined, " message: ", m);
            })*/
        });

        /*socket.on('reboot', function(crypt) {
            if(crypt == 'dingo') {
                console.log('!!! DESTROY THE MAP!!!');
                users = [];
                objects = [];
                oneshotSpace.emit('reboot')
            }
        });*/





    });

    function save() {
        /*if(land){
            land.save();
            oneshotSpace.emit('sysMessage', 'server land saved','success')
        }*/
    }

    setInterval(function() {
        save()
    }, 600000) //10 minutes


    function getUserId(session) {
        if (session) {
            let user = USERS[session.id];
            if (user) {
                return user.id
            }
        }
    }

    function getUserObject(session) {
        if (session) {
            let user = USERS[session.id];
            if (user) {
                return user;
            } else {
                let guest = GUESTS[session.id];
                return guest;
            }
        }
    }

    function evaluateUser(session, callback) {
        let user = getUserObject(session)
        if (!user) {
            pullUser(session.id, result => {
                if (result) {
                    USERS[session.id] = result;
                    callback(result)
                } else {
                    //USERS[session.id]={username:"guest"}
                    let guest = { username: "Guest " + roomCounter, guest: true, session: session.id, room: '' + roomCounter }
                    let admins = Object.values(USERS);

                    //socket.emit('admin', user.username, Object.values(GUESTS));
                    GUESTS[session.id] = guest;
                    GUEST_ROOM_HASH[guest.room] = guest;
                    roomCounter++;

                    admins.forEach(admin => {
                        if (admin.socketId) {
                            let socket = oneshotSpace.sockets.get(admin.socketId)
                            if (socket)
                                socket.emit('admin', admin.username, Object.values(GUESTS));
                        }


                    });
                    curl('👀 New Guest has joined MakeAvoy room!')

                    callback(guest)
                }
            })
        } else {
            callback(user)
        }

    }

    function deleteRoom(room) {
        let conversation = ROOM_LOGS[room];
        let guest = GUEST_ROOM_HASH[room];

        if (conversation) {
            writeLog('Room' + room, conversation)
        }


        delete ROOM_LOGS[room];
        delete GUEST_ROOM_HASH[room];
        if (guest && guest.socketId) {

            let socket = oneshotSpace.sockets.get(guest.socketId)
            if (socket)
                socket.disconnect('kicked');
        }
        //oneshotSpace.socketsLeave(''+room);

        if (guest && guest.session) {
            delete GUESTS[guest.session];
        }

    }

    function writeLog(filename, array) {
        writeFile(filename, JSON.stringify(array)) //yes im petty enough to save a json call because if it has to keep checking it could really add bloat
    }

    function writeFile(filename, text, iter) {
        fs.writeFile(
            './RoomLogs/' + filename + '.txt',

            text, { flag: "wx" },
            function(err) {
                if (err) {
                    if (iter && iter < 52) {
                        console.log("file " + filename + " already exists, testing next");
                        writeFile(filename + "_", text, iter == undefined ? 0 : iter);
                    } else {
                        console.log("file" + filename + " is boy howdy broken that's 52 undercores")
                    }
                } else {
                    console.log("Succesfully written " + filename);
                }
            }
        );
    }

    async function curl(m) {
        const { stdout, stderr } = await exec('curl --data "key=KL354T&title=Maker&msg=' + m + '" https://api.simplepush.io/send');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    }

}