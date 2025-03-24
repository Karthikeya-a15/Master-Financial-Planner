import financialGoalsController, {
  getSipAmountDistribution,
  getAmountDistribution,
  sumOfSip,
} from "../../put/financialGoalsController.js";
import mongoose from "mongoose";
import goalSchema from "../../../schemas/goalSchema.js";

jest.mock("../../../models/User.js", () => {
  const mockUserSchema = {
    methods: {
      hashPassword: jest.fn(), 
      validatePassword: jest.fn(),
    },
  };
  return {
    __esModule: true, 
    default: {
      findOne: jest.fn(),
    },
    userSchema: mockUserSchema, 
  };
});
import User from "../../../models/User.js";

jest.mock("../../../models/Goals.js", () => ({
  __esModule: true,
  default : {
    findOneAndUpdate : jest.fn()
  }
}))
import Goals from "../../../models/Goals.js";

jest.mock("../../../models/returnsAndAssets.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findById: jest.fn(), 
  },
}));
import RAM from "../../../models/returnsAndAssets.js";

jest.mock("mongoose");
jest.mock("../../../models/User.js");
jest.mock("../../../models/Goals.js");
jest.mock("../../../schemas/goalSchema.js");
jest.mock("../../../models/returnsAndAssets.js");

describe("financialGoalsController", () => {
  let req, res;

  beforeEach(() => {
    req = { user: "67b82107183c091d4d3990c3", body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should update financial goals for a valid user and valid input", async () => {
    const mockUser = {
      _id: req.user,
      goals: "67b82107183c091d4d3990d7",
      ram: "67b82107183c091d4d3990d9",
    };
    const mockBody = {
      goals: [{ name: "Goal 1", amount: 1000, time: 5, sipRequired: 50 }],
    };
    const mockRAM = {
      shortTerm: { debt: 50, domesticEquity: 30, usEquity: 10, gold: 5, crypto: 5, realEstate: 0 },
      mediumTerm: { debt: 30, domesticEquity: 40, usEquity: 15, gold: 10, crypto: 5, realEstate: 0 },
      longTerm: { debt: 10, domesticEquity: 50, usEquity: 20, gold: 10, crypto: 5, realEstate: 5 },
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    goalSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockResolvedValue(mockUser);
    RAM.findById.mockResolvedValue(mockRAM);

    const sipAmountDistribution = getSipAmountDistribution(mockBody.goals, mockRAM);
    const sipAssetAllocation = sumOfSip(getSipAmountDistribution(mockBody.goals, mockRAM));

    Goals.findOneAndUpdate.mockResolvedValue(
      { _id : mockUser.goals },
      {
        goals : mockBody.goals,
        sipAmountDistribution,
        sipAssetAllocation
      },
      {
        new : true
      }
    )

    req.body = mockBody;
    await financialGoalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User Goals are Updated" });
    expect(mongoose.startSession).toHaveBeenCalled();
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ _id: req.user });
    expect(Goals.findOneAndUpdate).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(goalSchema.safeParse).toHaveBeenCalledWith(mockBody);
  });

  test("should return 403 if input is invalid", async () => {
    const mockBody = { goals: "invalid" };
    goalSchema.safeParse.mockReturnValue({ success: false, error: { format: () => "Validation Error" } });
    req.body = mockBody;

    await financialGoalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Financial Goals input are Wrong", error: "Validation Error" });
  });

  test("should handle database errors and abort transaction", async () => {
    const mockBody = {
      goals: [{ name: "Goal 1", amount: 1000, time: 5, sipRequired: 50 }],
    };
    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };
    const mockError = new Error("Database error");

    goalSchema.safeParse.mockReturnValue({ success: true });
    mongoose.startSession.mockResolvedValue(mockSession);
    User.findOne.mockRejectedValue(mockError);

    req.body = mockBody;
    await financialGoalsController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal error", err: "Database error" });
    expect(mockSession.abortTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
  });
});

describe("getSipAmountDistribution", () => {
  const mockReturnsAndAssets = {
    shortTerm: {
      debt: 50,
      domesticEquity: 30,
      usEquity: 10,
      gold: 5,
      crypto: 5,
      realEstate: 0,
    },
    mediumTerm: {
      debt: 30,
      domesticEquity: 40,
      usEquity: 15,
      gold: 10,
      crypto: 5,
      realEstate: 0,
    },
    longTerm: {
      debt: 10,
      domesticEquity: 50,
      usEquity: 20,
      gold: 10,
      crypto: 5,
      realEstate: 5,
    },
  };

  it("should calculate SIP amount distribution correctly for a single short-term goal", () => {
    const goals = [{ sipRequired: 100, time: 2 }];
    const expectedDistribution = [
      getAmountDistribution(100, mockReturnsAndAssets.shortTerm),
    ];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(
      expectedDistribution,
    );
  });

  it("should calculate SIP amount distribution correctly for a single medium-term goal", () => {
    const goals = [{ sipRequired: 200, time: 5 }];
    const expectedDistribution = [
      getAmountDistribution(200, mockReturnsAndAssets.mediumTerm),
    ];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(
      expectedDistribution,
    );
  });

  it("should calculate SIP amount distribution correctly for a single long-term goal", () => {
    const goals = [{ sipRequired: 300, time: 10 }];
    const expectedDistribution = [
      getAmountDistribution(300, mockReturnsAndAssets.longTerm),
    ];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(
      expectedDistribution,
    );
  });

  it("should calculate SIP amount distribution correctly for multiple goals", () => {
    const goals = [
      { sipRequired: 300, time: 10 },
      { sipRequired: 200, time: 5 },
      { sipRequired: 100, time: 2 },
    ];
    const expectedDistribution = [
      getAmountDistribution(300, mockReturnsAndAssets.longTerm),
      getAmountDistribution(200, mockReturnsAndAssets.mediumTerm),
      getAmountDistribution(100, mockReturnsAndAssets.shortTerm),
    ];
    expect(getSipAmountDistribution(goals, mockReturnsAndAssets)).toEqual(
      expectedDistribution,
    );
  });
});

describe("getAmountDistribution", () => {
  it("should correctly distribute SIP amount based on plan", () => {
    const sip = 100;
    const plan = {
      debt: 50,
      domesticEquity: 30,
      usEquity: 10,
      gold: 5,
      crypto: 5,
      realEstate: 0,
    };
    const expectedDistribution = {
      debt: 50, // 50% of 100
      domesticEquity: 30, // 30% of 100
      usEquity: 10, // 10% of 100
      gold: 5, // 5% of 100
      crypto: 5, // 5% of 100
      realEstate: 0, // 0% of 100
    };
    expect(getAmountDistribution(sip, plan)).toEqual(expectedDistribution);
  });

  it("should handle zero values in plan correctly", () => {
    const sip = 200;
    const plan = {
      debt: 0,
      domesticEquity: 100,
      usEquity: 0,
      gold: 0,
      crypto: 0,
      realEstate: 0,
    };
    const expectedDistribution = {
      debt: 0, // 0% of 200
      domesticEquity: 200, // 100% of 200
      usEquity: 0, // 0% of 200
      gold: 0, // 0% of 200
      crypto: 0, // 0% of 200
      realEstate: 0, // 0% of 200
    };
    expect(getAmountDistribution(sip, plan)).toEqual(expectedDistribution);
  });
});

describe("sumOfSip", () => {
  it("should correctly sum SIP amounts across multiple goals", () => {
    const sipAmountDistribution = [
      {
        domesticEquity: 10,
        usEquity: 5,
        debt: 20,
        gold: 2,
        crypto: 1,
        realEstate: 0,
      },
      {
        domesticEquity: 20,
        usEquity: 10,
        debt: 30,
        gold: 5,
        crypto: 2,
        realEstate: 3,
      },
      {
        domesticEquity: 30,
        usEquity: 15,
        debt: 40,
        gold: 8,
        crypto: 3,
        realEstate: 5,
      },
    ];
    const expectedSum = {
      domesticEquity: 60, // 10 + 20 + 30
      usEquity: 30, // 5 + 10 + 15
      debt: 90, // 20 + 30 + 40
      gold: 15, // 2 + 5 + 8
      crypto: 6, // 1 + 2 + 3
      realEstate: 8, // 0 + 3 + 5
    };
    expect(sumOfSip(sipAmountDistribution)).toEqual(expectedSum);
  });

  it("should handle empty input array correctly", () => {
    const sipAmountDistribution = [];
    const expectedSum = {
      domesticEquity: 0,
      usEquity: 0,
      debt: 0,
      gold: 0,
      crypto: 0,
      realEstate: 0,
    };
    expect(sumOfSip(sipAmountDistribution)).toEqual(expectedSum);
  });
});