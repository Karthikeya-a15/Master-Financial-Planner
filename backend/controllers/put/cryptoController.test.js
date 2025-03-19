import cryptoController from "./cryptoController.js";
import mongoose from "mongoose";
import { cryptoSchema } from "../../schemas/netWorthSchemas.js";
import { createRequest, createResponse } from 'node-mocks-http';

jest.mock("../../models/User.js", () => {
    const mockUserSchema = {
        methods: {
            hashPassword: jest.fn(), // Provide a mock function
            validatePassword: jest.fn()
        },
        // Add other required mock schema properties if needed
    };
    return {
        __esModule: true, // Important for ES modules
        default: {
            findOne: jest.fn(),
        // ... any other User methods you use in your test ...
    },
      userSchema: mockUserSchema, // Export the mock schema
    }
});
import User from "../../models/User.js";


jest.mock("../../models/CryptoCurrency.js", () => ({
    __esModule: true,
    default: {
      findOne: jest.fn(),
      findOneAndUpdate: jest.fn(),
      findById: jest.fn(),
      // ... other Mongoose methods as needed
    },
  }));
import CryptoCurrency from "../../models/CryptoCurrency.js";

jest.mock("mongoose");
jest.mock("../../models/CryptoCurrency.js");
jest.mock("../../models/User.js");
jest.mock("../../schemas/netWorthSchemas.js");

describe("cryptoController", () => {
    it("should update crypto data for a valid user and valid input", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" } };
        const mockBody = { crypto: 15 };
        const mockExistingCrypto = { crypto: 5 }; // Example existing data

        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        // Mock schema validation
        cryptoSchema.safeParse.mockReturnValue({ success: true });

        // Mock mongoose session
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockResolvedValue(mockUser);
        CryptoCurrency.findOne.mockResolvedValue(mockExistingCrypto);
        CryptoCurrency.findOneAndUpdate.mockResolvedValue({});  //Mock successful update

        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();

        await cryptoController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Crypto updated successfully to Networth" });
        expect(mongoose.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
        expect(CryptoCurrency.findOneAndUpdate).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        expect(cryptoSchema.safeParse).toHaveBeenCalledWith(mockBody);
    });

    it("should return 403 if input is invalid", async () => {
        const mockBody = { invalidInput: "invalid" };
        const mockValidationError = { format: () => "Validation Error" };

        // Mock schema validation to fail
        cryptoSchema.safeParse.mockReturnValue({ success: false, error: mockValidationError });
        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await cryptoController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Crypto inputs are wrong", err: "Validation Error" });
        expect(cryptoSchema.safeParse).toHaveBeenCalledWith(mockBody);
    });

    it("should return 403 if crypto data is NOT updated", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { cryptocurrency: "67b82107183c091d4d3990c6" } };
        const mockBody = { crypto: 15 };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        cryptoSchema.safeParse.mockReturnValue({ success: true });
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockResolvedValue(mockUser);
        CryptoCurrency.findOneAndUpdate.mockResolvedValue(null); // Update fails
        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();
        await cryptoController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Crypto not updated" });
    });

    it("should handle database errors and abort transaction", async () => {
        const mockBody = { crypto: 15 };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        const mockError = new Error("Database error");

        cryptoSchema.safeParse.mockReturnValue({ success: true });
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockRejectedValue(mockError);
        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();

        await cryptoController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal error", err: "Database error" });
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });
});