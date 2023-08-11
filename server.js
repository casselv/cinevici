const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 8090;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.post("/submit-form", (req, res) => {
  const { textbox, option, budget } = req.body;

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
    from: "geosurfaus@gmail.com", // Replace with your email
    to: "geosurfaus@gmail.com", // Replace with the recipient's email
    subject: "New Form Submission",
    text: `Comment: ${textbox}\nOptions: ${optionsText}\nBudget: ${budget}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
