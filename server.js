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
    check("budget").isNumeric(),
    check("email").isEmail(),
    check("option").custom((value, { req }) => {
      // Check if the "option" field is a single choice (string) or an array
      if (typeof value === "string") {
        // Handle single choice validation here
        if (value.length === 0) {
          throw new Error("Option field is required.");
        }
        // Add any additional validation for single choice here
      } else if (Array.isArray(value)) {
        // Handle multiple choice validation here
        if (value.length === 0) {
          throw new Error("At least one option is required.");
        }
        // Add any additional validation for multiple choices here
      } else {
        throw new Error("Invalid option format.");
      }

      return true; // Validation passed
    }),
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

const port = process.env.PORT || 3018;

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is listening on port ${port}`);
});
