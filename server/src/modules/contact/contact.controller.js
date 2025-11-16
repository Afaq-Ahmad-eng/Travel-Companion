import { uploadBufferToImageKit } from "../../utils/megaUpload.js";
import { encryptData } from "../../utils/secure.js";
import { saveComplaint } from "./contact.service.js";
export const contactInfo = async (req,res,next) =>{
    console.log("we are coontact info function ",req.user);
    
    console.log("We get data from the contact ",req.body);
    
    const contactinfo = req.body;
    const file = req.files[0];

  const folderName = 'Smart-Travel-Companion-Issuse-images';
    let pictureUrl = null;
    
    const url = await uploadBufferToImageKit(file.buffer, file.originalname, folderName);
    console.log("Our Picture Url ", url);
    
    pictureUrl = encryptData(url);

    console.log("User id type ",typeof(contactinfo.userId));
    

     const userContactData = {
        userId: Number(contactinfo.userId),
        subject: contactinfo.subject,
        description: contactinfo.description,
        category: contactinfo.category,
        fileUrl: pictureUrl
    }

    const responseFromDB = await saveComplaint(userContactData);

    res.status(200).json({
        message: "We reached to the contact info endpoint sucessfully ",
        contactData: userContactData
    })
} 