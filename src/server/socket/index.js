module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected new socket client:\t", socket.id);

    socket.on("disconnect", () => {});

    socket.on("spam", (msg) => {
      socket.broadcast.emit("serverSpam", msg);
    });
  });
};
