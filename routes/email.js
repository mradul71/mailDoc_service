const router = require("express").Router();
const File = require("../models/file");

router.post("/", async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;
  if(!uuid || !emailTo || !emailFrom) {
      return res.status(422).send({ error: 'All fields are required.'});
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid });
    if(file.sender) {
      return res.status(422).send({ error: 'Email already sent once.'});
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();
    // send mail
    const sendMail = require('../services/mailService');
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: 'inShare',
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({
                emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/download/${response.uuid}`,
                size: parseInt(file.size/1000) + ' KB',
                expires: '24 hours'
            })
    }).then(() => {
      return res.render("success", {message: "Email sent successfully"});
    }).catch(err => {
      return res.status(500).render("success", {message: 'Error in email sending.'});
    });
} catch(err) {
  return res.status(500).render("success", { message: 'Something went wrong.'});
}

})

module.exports = router;