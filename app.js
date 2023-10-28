const express = require("express");
const app = express();
const path = require("path");
const Chat = require("./model/session-chat-model");
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    credentials: true,
  })
);

app.user("/",(req,res,next)=>{
  res.send("<h1>chú trình</h1>")
})

// const session = require("express-session");
// const MongodbStore = require("connect-mongodb-session")(session);
// const store = new MongodbStore({
//   uri: "mongodb+srv://trinhtvfx22649:lcm7V5M9JoUitZEL@cluster0.xmpc1ki.mongodb.net/assm3?retryWrites=true&w=majority&appName=AtlasApp",
//   collection: "session",
// });
// app.use(
//   session({
//     secret: "my secret",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//     cookie: {
//       maxAge: 30 * 60 * 1000, // Đặt thời hạn cho phiên là 30 phút (30 * 60 giây * 1000 mili giây)
//     },
//   })
// );

// // nhận file ảnh
// const multer = require("multer");
// const fileStore = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const fileFileter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };
// app.use(
//   multer({ storage: fileStore, fileFilter: fileFileter }).array("images")
// );
// app.use("/images", express.static(path.join(__dirname, "images")));

// const bodyParser = require("body-parser");
// const cookieParser = require("cookie-parser");
// const mongoose = require("mongoose");
// app.use(bodyParser.json());
// app.use(cookieParser());

// const authRouter = require("./router/auth-router");
// const homeRouter = require("./router/home-router");
// const adminRouter = require("./router/admin-router");
// const chatRouter = require("./router/chat-router");
// app.use("/auth", authRouter);
// app.use("/admin", adminRouter);
// app.use("/chat", chatRouter);
// app.use(homeRouter);

// // handing err
// const { handingErrors } = require("./middleware/handing-errors");
// app.use(handingErrors);

mongoose
  .connect(
    "mongodb+srv://trinhtvfx22649:lcm7V5M9JoUitZEL@cluster0.xmpc1ki.mongodb.net/assm3?retryWrites=true&w=majority&appName=AtlasApp"
  )
  .then(() => {
    const server = app.listen(process.env.PORT||5000);
    // const io = require("socket.io")(server, {
    //   cors: {
    //     origin: ["http://localhost:3000", "http://localhost:3001"],
    //     methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
    //     credentials: true,
    //   },
    // });

    // io.on("connection", (socket) => {
    //   // thông báo kết nối đến client
    //   console.log("connected to client");

    //   // lắng nghe sự kiện submit tin nhắn của người dùng lên server
    //   socket.on("chat message", (msg) => {
    //     let message;
    //     if ("msgClient" in msg) {
    //       message = { msgClient: msg.msgClient };
    //     }
    //     if ("msgAdmin" in msg) {
    //       message = { msgAdmin: msg.msgAdmin };
    //     }

    //     Chat.findOne({ roomId: msg.roomId })
    //       .then((room) => {
    //         if (room) {
    //           room.content.push(message);
    //           return room.save();
    //         } else {
    //           const newRoom = new Chat({
    //             roomId: msg.roomId,
    //             content: message,
    //           });
    //           return newRoom.save();
    //         }
    //       })
    //       .then((room) => {
    //         // gửi tin nhắn cho client
    //         Chat.find().then((chats) => {
    //           console.log(chats);
    //           socket.broadcast.emit("chat message", chats);
    //           socket.emit("chat message", chats);
    //         });
    //       });
    //   });

    //   // kiểm tra kết nối
    //   socket.on("disconnect", () => {
    //     console.log("người dùng thoát");
    //   });
    // });
    console.log("connect successfuly!");
  });
