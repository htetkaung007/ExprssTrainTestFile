//use express we exetend express
import express, { Request, Response } from "express";
//We need to install npm i -D @types/bodyparser &  npm i body parser --> for read from data form fornt end data
import bodyParser from "body-parser";
//use bcrypt for to make strong password (mix with original pwd)
import bcrypt from "bcryptjs";
//use jwt for define user for another time sever call
import jwt from "jsonwebtoken";
import fs from "fs";
import { checkAuth } from "./auth";
// to read form data we need i body parser so we read cookie we need cookeparser
import cookieParser from "cookie-parser";
const app = express();

const port = 3000;

app.use(express.static("public")); //This mean -->it read all file in public folder
//without this result --> undefined
app.use(bodyParser.urlencoded({ extended: true })); //this mean can read array or other
app.use(cookieParser());
interface Users {
  email: string;
  password: string;
}
let users: Users[] = [];
try {
  //json.parse --> json data to js data
  users = JSON.parse(fs.readFileSync("/data/user.json", "utf-8")); //if there has a data
} catch (error) {
  users = [];
}
app.post("/singup", (req: Request, res: Response) => {
  const { email, password } = req.body;
  //Validation
  if (!email || !password) {
    return res.status(405).send("user error");
  }
  //This state user password mix with somethings to make stong pwd
  const salt = bcrypt.genSaltSync(10); //create
  const hash = bcrypt.hashSync(password, salt); // and mix with password

  const newUser = { email, password: hash };
  users.push(newUser);
  console.log(users);
  fs.writeFileSync("./data/user.json", JSON.stringify(users, null, 2)); //2 mean space of json

  res.redirect("/");
});

app.post("/singin", (req: Request, res: Response) => {
  const { email, password } = req.body;
  //Validation
  if (!email || !password) {
    return res.status(405).send("user error");
  }
  const user = users.find((item) => item.email === email);
  if (!user) return res.status(404).send("Unregister User ");
  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).send("Invalid ");
  }
  //we create cookie key --> npm i jsonwebtoken -->jwt ("secretKey"--> can be anything)
  const token = jwt.sign({ email }, "secertKey", { expiresIn: "1h" });
  res.cookie("token", token); //send to web broweser --> application -->cookie and save it
  res.redirect("/");
});

app.get("/", checkAuth, (req: Request, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});
app.get("/data", checkAuth, (req: Request, res: Response) => {
  res.sendFile(__dirname + "/data/user.json");
});
app.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/singin.html");
});

app.listen(port, () => {
  console.log(`sever is listening at PORT ${port}`);
});
