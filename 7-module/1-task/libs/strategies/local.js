const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User')

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {

        User.find({email: email}, function(err, user) {
            if(user.length === 0) {
                return done(err, false, 'Нет такого пользователя');
            }

            user[0].checkPassword(password).then((result) => {
                if(result) {
                    return done(null, user[0]);
                }
                return done(null, false, 'Неверный пароль');
            });
        });
    }
);
