import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import User from "../../models/User.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv()
});
  

// Upload buffer directly to S3
const uploadToS3 = async (buffer, fileName, mimeType) => {
    const time = Date.now();
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `profile-images/${time}_${fileName}`,
      Body: buffer,
      ContentType: mimeType,
    };
  
    const command = new PutObjectCommand(params);
    await s3Client.send(command);
  
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/profile-images/${time}_${fileName.replaceAll(" ","+")}`;
  };
// Controller function
export const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded or invalid file type" });
  }

  try {
    const id = req.user;
    const user= await User.findById(id).select("imageURL");
    if(user.imageURL){
        const oldFileName = user.imageURL.split(".amazonaws.com/")[1].replaceAll(" ","+");
        if(oldFileName){
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket:process.env.AWS_BUCKET_NAME,
                    Key:oldFileName,
                })
            );
        }
    }
    const imageUrl = await uploadToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
    await User.findOneAndUpdate(
        {_id : id},
        {
            $set : {
                imageURL : imageUrl
            }
        }
    )
    res.json({ message: "Profile-Image uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: "File upload failed", details: error.message });
  }
};