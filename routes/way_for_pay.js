import express from "express";
import axios from "axios";
export const router = express.Router();
import { auth } from "../middleware/auth.js";
import User from "../models/users.js";
import crypto from "crypto";

router.post("/buy", auth, async (req, res) => {
  const date = new Date().getTime();
   
  const string = `${process.env.MERCHANT_ACCOUNT};www.pekker.me;Order${date};${date};${req.body.params.price};UAH;Premium account;1;${req.body.params.price}`;
  const key = process.env.MERCHANT_SIGNATURE;

  const hash = crypto.createHmac("md5", key).update(string).digest("hex");

  let info = await axios.post("https://api.wayforpay.com/api", {
    transactionType: "CREATE_INVOICE",
    merchantAccount: process.env.MERCHANT_ACCOUNT,
    merchantAuthType: "SimpleSignature",
    merchantDomainName: "www.pekker.me",
    merchantSignature: hash,
    apiVersion: 1,
    language: "ru",
    serviceUrl: "https://api.pekker.me/wayforpay/result",
    orderReference: `Order${date}`,
    orderDate: date,
    amount: req.body.params.price,
    currency: "UAH",
    orderTimeout: 86400,
    productName: ["Premium account"],
    productPrice: [req.body.params.price],
    productCount: [1],
    paymentSystems: "card;privat24;googlePay;applePay",
    clientFirstName: req.body.params.firstName,
    clientLastName: req.body.params.lastName,
    clientEmail: req.user.email,
  });
  console.log(info.data);
  return res.status(200).json(info.data.invoiceUrl);
});

router.post("/result", async (req, res) => {
  console.log(req.body);
  
  console.log(req.body.reasonCode);

  if (req.body.reasonCode === "1100") {
    console.log("OK");
    /* await User.findByIdAndUpdate({ _id: req.user.id, isPremium: true }); */
  }
  const date = new Date().getTime();
  const string = `${req.body.orderReference};${req.body.status};${date}`;
  const key = process.env.MERCHANT_SIGNATURE;

  const hash = crypto.createHmac("md5", key).update(string).digest("hex");
  return res.status(200).json({
    orderReference: req.body.orderReference,
    status: "accept",
    time: date,
    signature: key,
  });
});
