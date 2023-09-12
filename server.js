require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const { validationResult, check } = require("express-validator");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.post(
  "/submit-form",
  [
    check("textbox").trim().isString().escape(),
    check("option").isArray(),
    check("budget").isNumeric(),
    check("email").isEmail(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Handle validation errors, e.g., return an error response
      return res.status(422).json({ errors: errors.array() });
    }
    const { textbox, option, budget, email } = req.body;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Replace with your email
        pass: process.env.EMAIL_PASSWORD, // Replace with your email password or app-specific password
      },
    });

    let optionsText;
    if (Array.isArray(option)) {
      optionsText = option.join(", ");
    } else {
      optionsText = option;
    }

    const mailOptions = {
      from: "geosurfaus@gmail.com",
      to: "geosurfaus@gmail.com",
      subject: "New Form Submission",
      text: `Comment: ${textbox}\nOptions: ${optionsText}\nBudget: ${budget}\nEmail: ${email}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.render("sent", { message: "message sent succesfully" });
      }
    });
  }
);

const port = process.env.PORT || 3015;

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is listening on port ${port}`);
});
