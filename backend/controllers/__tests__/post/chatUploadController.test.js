import chatUploadController from "../../post/chatUploadController"; // Adjust path
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

jest.mock("@aws-sdk/client-s3", () => {
  return {
    S3Client: jest.fn(() => ({
      send: jest.fn(),
    })),
    PutObjectCommand: jest.fn(),
  };
});

describe("chatUploadController", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      body: { roomId: "123" },
      file: {
        buffer: Buffer.from("test file content"),
        originalname: "test.txt",
        mimetype: "text/plain",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    process.env.AWS_BUCKET_NAME = "test-bucket";
    process.env.AWS_REGION = "test-region";
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.AWS_BUCKET_NAME;
    delete process.env.AWS_REGION;
  });

  it("should upload file to S3 and return 200 status", async () => {
    await chatUploadController(req, res);

    expect(S3Client).toHaveBeenCalled();
    expect(PutObjectCommand).toHaveBeenCalledWith(expect.objectContaining({
      Bucket: "test-bucket",
      Key: expect.stringContaining("chat/"),
      Body: Buffer.from("test file content"),
      ContentType: "text/plain",
    }));

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "File uploaded successfully",
      fileUrl: expect.stringContaining("https://test-bucket.s3.test-region.amazonaws.com/chat/"),
      roomId: "123",
    });
  });

  it("should return 400 if no file is uploaded", async () => {
    req.file = null;

    await chatUploadController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "No file uploaded" });
  });

  it("should handle S3 upload errors and return 500 status", async () => {
    const mockError = new Error("S3 upload error");

    // Mock the S3Client instance's send method to reject with an error
    S3Client.mockImplementation(() => ({
      send: jest.fn().mockRejectedValue(mockError),
    }));

    await chatUploadController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "File upload failed",
      error: "S3 upload error",
    });
  });

  it("should handle and replace spaces in file name", async () => {
    req.file.originalname = "test file.txt";
    await chatUploadController(req, res);
    expect(PutObjectCommand).toHaveBeenCalledWith(expect.objectContaining({
      Key: expect.stringMatching(/chat\/\d+_test\+file\.txt/),
    }));
  });
});