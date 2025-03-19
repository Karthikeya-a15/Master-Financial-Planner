
import debtController from "./debtController.js";
import mongoose from "mongoose";
import { debtSchema } from "../../schemas/netWorthSchemas.js";
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


jest.mock("../../models/Debt.js", () => ({
    __esModule: true,
    default: {
      findOne: jest.fn(), // Add if you use it in other tests
      findOneAndUpdate: jest.fn(),
      findById: jest.fn(),     // Add if you use it
      // ... other Mongoose methods as needed
    },
  }));
import Debt from "../../models/Debt.js";

jest.mock("mongoose");
jest.mock("../../models/Debt.js");
jest.mock("../../models/User.js");
jest.mock("../../schemas/netWorthSchemas.js");

describe("debtController", () => {
    it("should update debt data for a valid user, valid input, and valid selection", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { debt: "67b82107183c091d4d3990c8" } };
        const mockBody = {
            liquidFund: 15,
            fixedDeposit: 25,
            debtFunds: 35,
            governmentInvestments: 45,
            sipDebt: { sip1: 50, sip2: 60 },
            selection: "liquidFund" // Example selection
        };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        // Mock schema validation.  debtSchema needs to handle the *shape* of the input,
        // not necessarily the full request body.
        debtSchema.safeParse.mockImplementation(({liquidFund, fixedDeposit, debtFunds, governmentInvestments, sipDebt}) => {
            if(liquidFund && typeof liquidFund === 'number') return {success : true}
            if(fixedDeposit && typeof fixedDeposit === 'number') return {success : true}
            if(debtFunds && typeof debtFunds === 'number') return {success : true}
            if(governmentInvestments && typeof governmentInvestments === 'number') return {success: true}
            if (sipDebt) return { success: true };
            return {success : false, error : {format : ()=>"Validation Error"}}
        });

        // Mock mongoose session
        mongoose.startSession.mockResolvedValue(mockSession);

        User.findOne.mockResolvedValue(mockUser);
        Debt.findOneAndUpdate.mockResolvedValue({}); // Mock successful update

        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();
        await debtController(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ message: "Debt updated successfully to Networth" });
        expect(mongoose.startSession).toHaveBeenCalled();
        expect(mockSession.startTransaction).toHaveBeenCalled();
        expect(User.findOne).toHaveBeenCalledWith({ _id: mockUserId });
        expect(Debt.findOneAndUpdate).toHaveBeenCalled();
        expect(mockSession.commitTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
        //Because of mockImplementation we need to check it's call like this
        expect(debtSchema.safeParse).toHaveBeenCalled();

    });

    it("should return 403 if input is invalid", async () => {
        const mockBody = { liquidFund: "invalid", selection: "liquidFund" }; // Invalid type
        debtSchema.safeParse.mockReturnValue({ success: false, error: {format : ()=>"Validation Error"} });
        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await debtController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Debt inputs are wrong", err: "Validation Error" });
    });

    it("should return 403 if selection is not provided", async () => {
        const mockBody = { liquidFund: 15 }; // No selection
        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();

        await debtController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Selection not provided" });
    });

    it("should return 403 if debt data is NOT updated", async () => {
        const mockUserId = "67b82107183c091d4d3990c3";
        const mockUser = { _id: mockUserId, netWorth: { debt: "67b82107183c091d4d3990c8" } };
        const mockBody = { liquidFund: 15, selection: "liquidFund" };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };

        debtSchema.safeParse.mockReturnValue({success: true});
        mongoose.startSession.mockResolvedValue(mockSession);

        User.findOne.mockResolvedValue(mockUser);
        Debt.findOneAndUpdate.mockResolvedValue(null); // Update fails

        const req = createRequest({user: mockUserId, body: mockBody});
        const res = createResponse();
        await debtController(req, res);

        expect(res.statusCode).toBe(403);
        expect(res._getJSONData()).toEqual({ message: "Debt not added" });
    });

    it("should handle database errors and abort transaction", async () => {
        const mockBody = { liquidFund: 15, selection: "liquidFund" };
        const mockSession = {
            startTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            abortTransaction: jest.fn(),
            endSession: jest.fn(),
        };
        const mockError = new Error("Database error");

        debtSchema.safeParse.mockReturnValue({success : true});
        mongoose.startSession.mockResolvedValue(mockSession);
        User.findOne.mockRejectedValue(mockError);

        const req = createRequest({user: "67b82107183c091d4d3990c3", body: mockBody});
        const res = createResponse();
        await debtController(req, res);

        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({ message: "Internal error", err: "Database error" });
        expect(mockSession.abortTransaction).toHaveBeenCalled();
        expect(mockSession.endSession).toHaveBeenCalled();
    });
});