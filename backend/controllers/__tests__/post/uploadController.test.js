// File: uploadController.test.js
import { uploadImage } from "../../post/uploadController.js" // Adjust path
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import User from "../../../models/User.js";

jest.mock("@aws-sdk/client-s3", () => {
  const mockPutObjectCommand = jest.fn();
  const mockDeleteObjectCommand = jest.fn();
  return {
    S3Client: jest.fn(() => ({
      send: jest.fn().mockImplementation((command) => {
        if (command instanceof mockPutObjectCommand) {
          return Promise.resolve();
        } else if (command instanceof mockDeleteObjectCommand) {
          return Promise.resolve();
        }
        return Promise.reject(new Error("Invalid command"));
      }),
    })),
    PutObjectCommand: mockPutObjectCommand,
    DeleteObjectCommand: mockDeleteObjectCommand,
  };
});

jest.mock("../../../models/User.js");

describe("uploadImage", () => {
  let req;
  let res;
  let mockUser;

  beforeEach(() => {
    req = {
      user: "mockUserId",
      file: {
        buffer: Buffer.from("test image content"),
        originalname: "test.jpg",
        mimetype: "image/jpeg",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockUser = {
      _id: "mockUserId",
      imageURL: null
    };
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });  //chaining mock
    User.findOneAndUpdate.mockResolvedValue(mockUser);

    process.env.AWS_BUCKET_NAME = "test-bucket";
    process.env.AWS_REGION = "test-region";
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.AWS_BUCKET_NAME;
    delete process.env.AWS_REGION;
  });

  it("should upload image to S3 and update user data", async () => {
    await uploadImage(req, res);

    expect(S3Client).toHaveBeenCalled();
    expect(PutObjectCommand).toHaveBeenCalledWith(expect.objectContaining({
      Bucket: "test-bucket",
      Key: expect.stringContaining("profile-images/"),
      Body: Buffer.from("test image content"),
      ContentType: "image/jpeg",
    }));
    expect(User.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "mockUserId" },
      { $set: { imageURL: expect.stringContaining("https://test-bucket.s3.test-region.amazonaws.com/profile-images/") } },
    );
    expect(res.json).toHaveBeenCalledWith({ message: "Profile-Image uploaded successfully" });
  });
  //   mockUser.imageURL = "https://test-bucket.s3.test-region.amazonaws.com/profile-images/old.jpg";
  //   User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

  //   await uploadImage(req, res);

  //   expect(DeleteObjectCommand).toHaveBeenCalledWith({
  //     Bucket: "test-bucket",
  //     Key: "profile-images/old.jpg",
  //   });

  //   const s3ClientInstance = new S3Client();
  //   expect(s3ClientInstance.send).toHaveBeenCalledWith(expect.any(DeleteObjectCommand));
  // });

  it("should return 400 if no file is uploaded", async () => {
    req.file = null;
    await uploadImage(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "No file uploaded or invalid file type",
    });
  });

  it("should handle database errors and return 500 status", async () => {
    // Mock the database error
    User.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    await uploadImage(req, res);

    // Verify that the response status and JSON were called correctly
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "File upload failed",
      details: "Database error",
    });
  });

  it("should handle and replace spaces in file name", async () => {
    req.file.originalname = "test image.jpg";
    await uploadImage(req, res);
    expect(PutObjectCommand).toHaveBeenCalledWith(expect.objectContaining({
      Key: expect.stringMatching(/profile-images\/\d+_test\+image\.jpg/),
    }));
  });
  it("should not attempt to delete if old image name is null", async () => {
    mockUser.imageURL = "https://test-bucket.s3.test-region.amazonaws.com/";
    User.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    const s3ClientInstance = new S3Client();
    await uploadImage(req, res);
    expect(s3ClientInstance.send).not.toHaveBeenCalledWith(expect.any(DeleteObjectCommand));

  });
});