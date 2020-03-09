const User = require('../../models/User');
module.exports = function authenticate(strategy, email, displayName, done) {
  if (email) {
    async function getUser() {
      return await User.findOne({email: email});
    }

    async function saveUser(user) {
      try {
        return await user.save({validateBeforeSave: true});
      } catch (error) {
        done(error, false);
      }
    }

    getUser().then((result) => {
      if (result) {
        done(null, result);
      } else {
        const user = new User({
          email: email,
          displayName: displayName,
        });
        saveUser(user).then((result) => {
          if (result) done(null, result);
        });
      }
    });
  } else {
    done(null, false, `Не указан email`);
  }
};

/*
так лучше

if (!email) {
    done(null, false, 'Не указан email');
    return;
  }
  User.findOne({email: email}).then((user) => {
    if (!user) {
      user = new User({email, displayName});
      user.save().then(
          (result) => {
            done(null, user);
          },
          (err) => {
            done(err, false, err.errors.email.message);
          });
    } else {
      done(null, user);
    }
  });

 */
