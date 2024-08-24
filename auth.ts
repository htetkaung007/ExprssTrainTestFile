//we use this fn as a middleweare to check login or not

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// third parameter next(it's function) meaning goto  next step middleware
export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).redirect("./singin.html");
  }
  jwt.verify(token, "secertKey", (err: any) => {
    //if error go to this
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    //if not go next
    next(); // go to next sept if error not go there
  });
};
