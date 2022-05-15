const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('./config.js');
const Users = require('./models/user');
const jwt = require('jsonwebtoken');

// passport.use(new LocalStrategy({
//         usernameField: 'email',
//         passwordField: 'password'
//     }, function(email, password, cb) {
//         // This one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
//         return Users.findOne({email, password})
//                     .then(user => {
//                         if(!user) {
//                             // No user found 
//                             return cb(null, false, { message: 'Incorrect email or password' });
//                         }

//                         return cb(null, user,{ message: 'Logged in successfully' });
//                     })
//                     .catch((err) => {
//                         cb(err)
//                     })
// }));


// passport.use(new JWTStrategy({
//         jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//         secretOrKey: config.secretKey
//     }, function(jwtPayload, cb) {
//         //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
//         return UserModel.findOneById(jwtPayload.id)
//         .then(user => {
//             return cb(null, user);
//         })
//         .catch(err => {
//             return cb(err);
//         });
// }))

exports.local = passport.use(new LocalStrategy(Users.authenticate()));

passport.serializeUser(Users.serializeUser());
passport.deserializeUser(Users.deserializeUser());


exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
}

let options = {};

options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JWTStrategy(options, (jwt_payload, done) => {
    console.log('JWT payload : ', jwt_payload);
    Users.findOne({_id: jwt_payload._id}, (err, user) => {
        if(err) {
            return done(err, false);
        }
        else if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}));

exports.verifyUser = passport.authenticate('jwt', { session: false });

