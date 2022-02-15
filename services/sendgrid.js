import sgMail from "@sendgrid/mail";

function sendGrid (reciever) {

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: reciever,
  from: "pekker2022me@gmail.com",
  subject: "Welcome to Pekker!",
  text: "Welcome to Pekker!",
  html: "<b>Welcome to Pekker!</b>",
};
sgMail.send(msg).then(
  () => {},
  (error) => {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
);
}
export default sendGrid;
