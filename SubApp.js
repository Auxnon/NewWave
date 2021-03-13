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

    var USERS = [];
    var possibleUsers = []; //TODO get rid of this lol
    var lastChats = [];
   



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
        sheet: DataTypes.JSON,
        equipment:DataTypes.JSON,
    }, { sequelize, modelName: 'user' });



    function makeUser(name, color, pin, callback) {
        if(name && color && pin != undefined) {
            User.create({
                username: name,
                color: color,
                pin: pin
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
        if(passedArgs[0] == 'purge') {
            console.log('P U R G I N G  DB'.red)
            await sequelize.sync({ force: true });
            let contents = [
                ['Nick', '42069', 'salt', '#7EBB1D'],
            ]

            contents.forEach(stuff => {
                let person = User.create({
                    username: stuff[0],
                    //birthday: new Date(1980, 6, 20)
                    salt: stuff[2],
                    color: stuff[3],
                    password: hashPassword(stuff[1], stuff[2])
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
            if(user.password == hash) {
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
            if(user) {
                console.log('- login for ', user.username, ':', user.id)
            } else {
                console.log('- bad login'.yellow)
            }

            if(error) {
                res.status(401).send({ message: error });
            } else if(!user) {
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
    var users = [];
    var sockets = [];

    var count = -1;

    oneshotSpace.on('connection', function(socket) {
        console.log('oneshot connecting...');
        if(!socket.request.session) {
            console.log("! socket session doesn't exist!".red);
            return;
        }

        console.log('socket session id ', socket.request.session.id)

        evaluateUser(socket.request.session, username => {

            if(!username) { //guest
                //socket.disconnect('reauth');
                //console.log('- kicked null user'.yellow)
            } else {
                //socket nodes

                console.log('-socket connected to user:', username);
                let user = USERS[socket.request.session.id];

                socket.broadcast.emit('join', user ? user.username : 'Unknown');

                socket.on('disconnect', function() {
                    /*if(socket.request.session.id) {
                        let user = USERS[socket.request.session.id];
                        user.online = false;
                        user.save();
                    }*/
                    console.log('lost connection to user')
                });
                socket.on('message', function(m) {
                    let userId = getUserId(socket.request.session);
                    lastChats.push([userId, m]);
                    if(lastChats.length > 10)
                        lastChats.shift()
                    oneshotSpace.emit('message', userId, m)
                    /*User.findOne({ which: { username: user } }).then(o => {
                        console.log('messaged with id ', o ? o.username : undefined, " message: ", m);
                    })*/
                });
         



                socket.on('make', function(obj) {
                    obj.id = createObject(obj);
                    oneshotSpace.emit('make', obj) //io.sockets
                });

                socket.on('chat', function(id, message) {
                    oneshotSpace.emit('chat', id, message);
                });

                /*socket.on('reboot', function(crypt) {
                    if(crypt == 'dingo') {
                        console.log('!!! DESTROY THE MAP!!!');
                        users = [];
                        objects = [];
                        oneshotSpace.emit('reboot')
                    }
                });*/


                socket.on('sysMessage', function(m) {
                    oneshotSpace.emit('sysMessage', m)
                })

            }
        })

    });

    function save(){
        /*if(land){
            land.save();
            oneshotSpace.emit('sysMessage', 'server land saved','success')
        }*/
    }

    setInterval(function(){
        save()
    },600000) //10 minutes


    function getUserId(session) {
        if(session) {
            let user = USERS[session.id];
            if(user) {
                return user.id
            }
        }
    }

    function getUsername(session) {
        if(session) {
            let user = USERS[session.id];
            if(user) {
                return user.username
            }
        }
    }

    function evaluateUser(session, callback) {
        let username = getUsername(session)
        if(!username) {
            pullUser(session.id, result => {
                if(result) {
                    USERS[session.id] = result;
                    callback(result.username)
                } else {
                    callback(undefined)
                }
            })
        } else {
            callback(username)
        }

    }

}