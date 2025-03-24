import adminLoginController from "../../admin/adminLoginController.js";
import jwt from "jsonwebtoken";
import { loginSchema } from "../../../schemas/adminSchema.js";

jest.mock("jsonwebtoken");
jest.mock("../../../schemas/adminSchema.js")

jest.mock("../../../models/Admin", () => {
    return {
        __esModule: true,
        default: {
            findOne: jest.fn(),
        },
    };
});
import Admin from "../../../models/Admin";
describe("adminLoginController", () => {
    let req, res;

    beforeEach(() => {
        req = { body: { email: "admin@example.com", password: "password123" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it("should return a token on successful login", async () => {
        const mockAdmin = {
            validatePassword: jest.fn().mockResolvedValue(true),
            save: jest.fn(),
            _id: "12345"
        };
        loginSchema.safeParse.mockImplementation(
            ({ email, password}) => {
                if(email) return { success : true} ;
                if(password) return { success : true} ;

                return { success : false, error : { format: () => "Invalid input"}}
            },
        );
        Admin.findOne.mockResolvedValue(mockAdmin);
        jwt.sign.mockReturnValue("mockToken");

        await adminLoginController(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "Login Successful",
            token: "mockToken"
        });
    });

    it("should handle invalid credentials", async () => {
        const mockAdmin = { validatePassword: jest.fn().mockResolvedValue(false) };
        Admin.findOne.mockResolvedValue(mockAdmin);

        await adminLoginController(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should handle errors", async () => {
        Admin.findOne.mockRejectedValueOnce(new Error("Database error"));

        await adminLoginController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: "Internal error",
            error: "Database error"
        });
    });
});
