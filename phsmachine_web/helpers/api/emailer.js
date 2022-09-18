const sgMail = require("@sendgrid/mail");
const fs = require('fs');
import { readJsonFile } from "./"
import logger from "../../services/logger"

const setApiKey = async () => { 
    const key = await readJsonFile("apikey.json")
    sgMail.setApiKey(key.sendGrid);
}

setApiKey()

const getFileContent = (template_content) => {
    let contents = fs.readFileSync(`assets/mails/${template_content.template_name}`, 'utf-8');
    return contents;
}

const transTemplate = (template_content) => {
    var template = require('es6-template-strings');
    return template(getFileContent(template_content), {...template_content})
}

const sendMail = async(msg) => {
    try{
        //TODO UNCOMMENT
        //const sent = await sgMail.send(msg);
        logger.info(`Email Sent -> ${msg.to}`);
        //return sent;
    }catch(e){
        logger.error(`Email Not Sent -> ${msg.to}`)
        logger.error(e.stack)
    }
}

const sendEmail = async(userEmail, template_content) => {
    const { subject } = template_content
    /**
     * user_email : string
     * template_content : {
     *  template_name : string
     *  ...other content
     * }
     */
    
    let mailOptions = {
        from: "phscapstonesystem@gmail.com",
        to: userEmail,
        subject,    
        html: transTemplate(template_content)
    };
    sendMail(mailOptions)
}

module.exports = sendEmail