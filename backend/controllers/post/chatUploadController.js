import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: fromEnv()
});

const uploadToS3 = async (buffer, fileName, mimeType) => {
    const time = Date.now();
    const key = `chat/${time}_${fileName.replaceAll(" ", "+")}`;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
    };

    await s3Client.send(new PutObjectCommand(params));

    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

const chatUploadController = async (req, res) => {
    try {
        const { roomId } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const fileUrl = await uploadToS3(file.buffer, file.originalname, file.mimetype);

        res.status(200).json({
            message: "File uploaded successfully",
            fileUrl,
            roomId
        });
    } catch (error) {
        res.status(500).json({ message: "File upload failed", error : error.message });
    }
};

export default chatUploadController;