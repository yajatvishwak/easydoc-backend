const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const shortid = require("shortid");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
const db = require("better-sqlite3")("db2.db");
app.get("/", (req, res) => {
  res.send("easy doc backend online");
});

// todo: create login signup

app.post("/signup", (req, res) => {
  const { username, password, usertype } = req.body;
  const uid = shortid.generate();
  const insert = db
    .prepare(
      "INSERT INTO usertable (uid,username, userpassword, usertype) VALUES (@uid,@username, @userpassword, @usertype)"
    )
    .run({ username, userpassword: password, usertype, uid });

  res.send({ message: "ok", uid: uid, usertype: usertype });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const select = db
    .prepare(
      "SELECT uid,usertype from usertable where username=@username and password=@password"
    )
    .get({ username, password });
  if (select) {
    res.send({ message: "ok", uid: select.uid, usertype: select.usertype });
  } else {
    res.send({ message: "notok" });
  }
});
app.post("/updatemed", (req, res) => {
  const { med, uid } = req.body;
  db.prepare("UPDATE usertable set med=@med where uid=@uid").run({
    med,
    uid,
  });
  res.send({ message: "ok" });
});
app.get("/getpatient/:uid", (req, res) => {
  const insert = db
    .prepare("SELECT * from usertable where uid=@uid")
    .get({ uid: req.params.uid });
  res.send({ message: "ok", payload: insert });
});
app.post("/createEmergency", (req, res) => {
  const { uid, cord } = req.body;
  const insert = db
    .prepare("INSERT INTO emergency (uid, cord) VALUES (@uid, @cord)")
    .run({ uid, cord });

  res.send({ message: "ok" });
});

app.post("/respond", (req, res) => {
  const { respid, eid } = req.body;
  db.prepare("UPDATE emergency set respid=@respid where eid=@eid").run({
    respid,
    eid,
  });
  res.send({ message: "ok" });
});

app.get("/getEmergencies", (req, res) => {
  const insert = db.prepare("SELECT * from Emergency").all();
  const fin = insert.map((item) => {
    const getname = db
      .prepare("SELECT username from usertable where uid=@uid")
      .get({ uid: item.uid });
    return { ...item, name: getname ? getname.username : "" };
  });
  const fin2 = fin.map((item) => {
    const getname = db
      .prepare("SELECT username from usertable where uid=@respid")
      .get({ respid: item.respid });
    return { ...item, respname: getname ? getname.username : "" };
  });
  res.send({ message: "ok", payload: fin2 });
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
