const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const port = 8914;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.post("/submit-form", (req, res) => {
  const { textbox, option, budget, email } = req.body;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "geosurfaus@gmail.com", // Replace with your email
      pass: "gejkylkbjwchleyn", // Replace with your email password or app-specific password
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
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
