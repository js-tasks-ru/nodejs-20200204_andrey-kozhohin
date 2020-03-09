const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.handshake.query.token;
    if (!token) return next(new Error('anonymous sessions are not allowed'));
    const ses = await Session.findOne({token: token}).populate('user');
    if (!ses) return next(new Error('wrong or expired session token'));

    socket.user = ses.user;

    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      await Message.create({
        user: socket.user.displayName,
        chat: socket.user._id,
        text: msg, date: new Date()});
    });
  });

  return io;
}

module.exports = socket;
