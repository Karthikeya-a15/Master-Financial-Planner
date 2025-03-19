import miscellaneousController from "./miscellaneousController.js";
import mongoose from "mongoose";
import { miscellaneousSchema } from "../../schemas/netWorthSchemas.js";
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
jest.mock("../../models/miscellaneous.js", () => ({
    __esModule: true, // Important for ES modules
    default: { // Mock the default export (the model)
        findOne: jest.fn(),
        findOneAndUpdate: jest.fn(),
        findById: jest.fn(),
      // Add other common Mongoose methods you might use in other tests
    },
  }));
import miscellaneous from "../../models/miscellaneous.js";



jest.mock("mongoose");
jest.mock("../../models/miscellaneous.js");
jest.mock("../../models/User.js");
jest.mock("../../schemas/netWorthSchemas.js");

describe("miscellaneousController", () => {
    it("should update miscellaneous data for a valid user and valid input", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { miscellaneous: "67b82107183c091d4d3990d2" } };
        const mockBody = { otherInsuranceProducts: 12, smallCase: 6 };
        const mockExistingMisc = { otherInsuranceProducts: 10, smallCase: 5 };

        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        // Mock schema validation
        miscellaneousSchema.safeParse.mockReturnValue({ success: true });

        // Mock mongoose session
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockResolvedValue(mockUser);
        miscellaneous.findOne.mockResolvedValue(mockExistingMisc);
        miscellaneous.findOneAndUpdate.mockImplementation(() => ({
            toObject: () => mockExistingMisc,
            otherInsuranceProducts: 12, smallCase: 6
        }));
        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();
        await miscellaneousController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Miscellaneous updated successfully to Networth" });
        expect(mongoose.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
        expect(miscellaneous.findOneAndUpdate).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        expect(miscellaneousSchema.safeParse).toHaveBeenCalledWith(mockBody);
    });

    it("should return 403 if input is invalid", async () => {
        const mockBody = { otherInsuranceProducts: "invalid" };
        const mockValidationError = { format: () => "Validation Error" };

        miscellaneousSchema.safeParse.mockReturnValue({ success: false, error: mockValidationError });
        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await miscellaneousController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Miscellaneous inputs are wrong", err: "Validation Error" });
        expect(miscellaneousSchema.safeParse).toHaveBeenCalledWith(mockBody);
    });

    it("should return 403 if miscellaneous data is NOT updated", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { miscellaneous: "67b82107183c091d4d3990d2" } };
        const mockBody = { otherInsuranceProducts: 12, smallCase: 6 };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        miscellaneousSchema.safeParse.mockReturnValue({ success: true });
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockResolvedValue(mockUser);
        miscellaneous.findOneAndUpdate.mockResolvedValue(null); // Update fails
        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();
        await miscellaneousController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Miscellaneous not updated" });
    });

    it("should handle database errors and abort transaction", async () => {
        const mockBody = { otherInsuranceProducts: 12, smallCase: 6 };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        const mockError = new Error("Database error");
        miscellaneousSchema.safeParse.mockReturnValue({ success: true });
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockRejectedValue(mockError); // Simulate error

        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await miscellaneousController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal error", err: "Database error" });
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });
});