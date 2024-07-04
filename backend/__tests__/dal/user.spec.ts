import _ from "lodash";
import { updateStreak } from "../../src/dal/user";
import * as UserDAL from "../../src/dal/user";
import * as UserTestData from "../__testData__/users";
import { ObjectId } from "mongodb";

const mockPersonalBest = {
  acc: 1,
  consistency: 1,
  difficulty: "normal" as const,
  lazyMode: true,
  language: "no",
  punctuation: false,
  raw: 230,
  wpm: 215,
  timestamp: 13123123,
};

const mockResultFilter: SharedTypes.ResultFilters = {
  _id: "id",
  name: "sfdkjhgdf",
  pb: {
    no: true,
    yes: true,
  },
  difficulty: {
    normal: true,
    expert: false,
    master: false,
  },
  mode: {
    words: false,
    time: true,
    quote: false,
    zen: false,
    custom: false,
  },
  words: {
    "10": false,
    "25": false,
    "50": false,
    "100": false,
    custom: false,
  },
  time: {
    "15": false,
    "30": true,
    "60": false,
    "120": false,
    custom: false,
  },
  quoteLength: {
    short: false,
    medium: false,
    long: false,
    thicc: false,
  },
  punctuation: {
    on: false,
    off: true,
  },
  numbers: {
    on: false,
    off: true,
  },
  date: {
    last_day: false,
    last_week: false,
    last_month: false,
    last_3months: false,
    all: true,
  },
  tags: {
    none: true,
  },
  language: {
    english: true,
  },
  funbox: {
    none: true,
  },
};

const mockDbResultFilter = { ...mockResultFilter, _id: new ObjectId() };

describe("UserDal", () => {
  it("should be able to insert users", async () => {
    // given
    const newUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    // when
    await UserDAL.addUser(newUser.name, newUser.email, newUser.uid);
    const insertedUser = await UserDAL.getUser("userId", "test");

    // then
    expect(insertedUser.email).toBe(newUser.email);
    expect(insertedUser.uid).toBe(newUser.uid);
    expect(insertedUser.name).toBe(newUser.name);
  });

  it("should error if the user already exists", async () => {
    // given
    const newUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    // when
    await UserDAL.addUser(newUser.name, newUser.email, newUser.uid);

    // then
    // should error because user already exists
    await expect(
      UserDAL.addUser(newUser.name, newUser.email, newUser.uid)
    ).rejects.toThrow("User document already exists");
  });

  it("isNameAvailable should correctly check if a username is available", async () => {
    // given
    await UserDAL.addUser("user1", "user1@email.com", "userId1");
    await UserDAL.addUser("user2", "user2@email.com", "userId2");

    const testCases = [
      {
        name: "user1",
        whosChecking: "userId1",
        expected: true,
      },
      {
        name: "USER1",
        whosChecking: "userId1",
        expected: true,
      },
      {
        name: "user2",
        whosChecking: "userId1",
        expected: false,
      },
    ];

    // when, then
    for (const { name, expected, whosChecking } of testCases) {
      const isAvailable = await UserDAL.isNameAvailable(name, whosChecking);
      expect(isAvailable).toBe(expected);
    }
  });

  it("updatename should not allow unavailable usernames", async () => {
    // given
    const mockUsers = [...Array(3).keys()]
      .map((id) => ({
        name: `Test${id}`,
        email: `mockemail@email.com${id}`,
        uid: `userId${id}`,
      }))
      .map(({ name, email, uid }) => UserDAL.addUser(name, email, uid));
    await Promise.all(mockUsers);

    const userToUpdateNameFor = await UserDAL.getUser("userId0", "test");
    const userWithNameTaken = await UserDAL.getUser("userId1", "test");

    // when, then
    await expect(
      UserDAL.updateName(
        userToUpdateNameFor.uid,
        userWithNameTaken.name,
        userToUpdateNameFor.name
      )
    ).rejects.toThrow("Username already taken");
  });

  it("same usernames (different casing) should be available only for the same user", async () => {
    await UserDAL.addUser("User1", "user1@test.com", "uid1");

    await UserDAL.addUser("User2", "user2@test.com", "uid2");

    const user1 = await UserDAL.getUser("uid1", "test");
    const user2 = await UserDAL.getUser("uid2", "test");

    await UserDAL.updateName(user1.uid, "user1", user1.name);

    const updatedUser1 = await UserDAL.getUser("uid1", "test");

    // when, then
    expect(updatedUser1.name).toBe("user1");

    await expect(
      UserDAL.updateName(user2.uid, "USER1", user2.name)
    ).rejects.toThrow("Username already taken");
  });

  it("updatename should not allow invalid usernames", async () => {
    // given
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);

    const invalidNames = [
      null, // falsy
      undefined, // falsy
      "", // empty
      " ".repeat(16), // too long
      ".testName", // cant begin with period
      "asdasdAS$", // invalid characters
    ];

    // when, then
    invalidNames.forEach(
      async (invalidName) =>
        await expect(
          UserDAL.updateName(
            testUser.uid,
            invalidName as unknown as string,
            testUser.name
          )
        ).rejects.toThrow("Invalid username")
    );
  });

  it("UserDAL.updateName should change the name of a user", async () => {
    // given
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);

    // when
    await UserDAL.updateName(testUser.uid, "renamedTestUser", testUser.name);

    // then
    const updatedUser = await UserDAL.getUser(testUser.uid, "test");
    expect(updatedUser.name).toBe("renamedTestUser");
  });

  it("clearPb should clear the personalBests of a user", async () => {
    // given
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };
    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);
    await UserDAL.getUsersCollection().updateOne(
      { uid: testUser.uid },
      {
        $set: {
          personalBests: {
            time: { 20: [mockPersonalBest] },
            words: {},
            quote: {},
            zen: {},
            custom: {},
          },
        },
      }
    );

    const { personalBests } =
      (await UserDAL.getUser(testUser.uid, "test")) ?? {};
    expect(personalBests).toStrictEqual({
      time: { 20: [mockPersonalBest] },
      words: {},
      quote: {},
      custom: {},
      zen: {},
    });
    // when
    await UserDAL.clearPb(testUser.uid);

    // then
    const updatedUser = (await UserDAL.getUser(testUser.uid, "test")) ?? {};
    expect(_.values(updatedUser.personalBests).filter(_.isEmpty)).toHaveLength(
      5
    );
  });

  it("autoBan should automatically ban after configured anticheat triggers", async () => {
    // given
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);

    // when
    Date.now = vi.fn(() => 0);
    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);
    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);
    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);

    // then
    const updatedUser = await UserDAL.getUser(testUser.uid, "test");
    expect(updatedUser.banned).toBe(true);
    expect(updatedUser.autoBanTimestamps).toEqual([0, 0, 0]);
  });

  it("autoBan should not ban ban if triggered once", async () => {
    // given
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);

    // when
    Date.now = vi.fn(() => 0);
    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);

    // then
    const updatedUser = await UserDAL.getUser(testUser.uid, "test");
    expect(updatedUser.banned).toBe(undefined);
    expect(updatedUser.autoBanTimestamps).toEqual([0]);
  });

  it("autoBan should correctly remove old anticheat triggers", async () => {
    // given
    const testUser = {
      name: "Test",
      email: "mockemail@email.com",
      uid: "userId",
    };

    await UserDAL.addUser(testUser.name, testUser.email, testUser.uid);

    // when
    Date.now = vi.fn(() => 0);
    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);
    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);

    Date.now = vi.fn(() => 36000000);

    await UserDAL.recordAutoBanEvent(testUser.uid, 2, 1);

    // then
    const updatedUser = await UserDAL.getUser(testUser.uid, "test");
    expect(updatedUser.banned).toBe(undefined);
    expect(updatedUser.autoBanTimestamps).toEqual([36000000]);
  });

  describe("addResultFilterPreset", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.addResultFilterPreset("non existing uid", mockResultFilter, 5)
      ).rejects.toThrow(
        "Unknown user or maximum number of custom filters reached for user."
      );
    });

    it("should return error if user has reached maximum", async () => {
      // given
      const { uid } = await UserTestData.createUser({
        resultFilterPresets: [mockDbResultFilter],
      });

      // when, then
      await expect(
        UserDAL.addResultFilterPreset(uid, mockResultFilter, 1)
      ).rejects.toThrow(
        "Unknown user or maximum number of custom filters reached for user."
      );
    });

    it("should handle zero maximum", async () => {
      // given
      const { uid } = await UserTestData.createUser();

      // when, then
      await expect(
        UserDAL.addResultFilterPreset(uid, mockResultFilter, 0)
      ).rejects.toThrow(
        "Unknown user or maximum number of custom filters reached for user."
      );
    });

    it("addResultFilterPreset success", async () => {
      // given
      const { uid } = await UserTestData.createUser({
        resultFilterPresets: [mockDbResultFilter],
      });

      // when
      const result = await UserDAL.addResultFilterPreset(
        uid,
        { ...mockResultFilter },
        2
      );

      // then
      const read = await UserDAL.getUser(uid, "read");
      const createdFilter = read.resultFilterPresets ?? [];

      expect(result).toStrictEqual(createdFilter[1]?._id);
    });
  });

  describe("removeResultFilterPreset", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.removeResultFilterPreset(
          "non existing uid",
          new ObjectId().toHexString()
        )
      ).rejects.toThrow("Unknown user or custom filter not found");
    });

    it("should return error if filter is unknown", async () => {
      // given
      const { uid } = await UserTestData.createUser({
        resultFilterPresets: [mockDbResultFilter],
      });

      // when, then
      await expect(
        UserDAL.removeResultFilterPreset(uid, new ObjectId().toHexString())
      ).rejects.toThrow("Unknown user or custom filter not found");
    });
    it("should remove filter", async () => {
      // given
      const filterOne = { ...mockDbResultFilter, _id: new ObjectId() };
      const filterTwo = { ...mockDbResultFilter, _id: new ObjectId() };
      const filterThree = { ...mockDbResultFilter, _id: new ObjectId() };
      const { uid } = await UserTestData.createUser({
        resultFilterPresets: [filterOne, filterTwo, filterThree],
      });

      // when, then
      await UserDAL.removeResultFilterPreset(uid, filterTwo._id.toHexString());

      const read = await UserDAL.getUser(uid, "read");
      expect(read.resultFilterPresets).toStrictEqual([filterOne, filterThree]);
    });
  });

  describe("addTag", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.addTag("non existing uid", "tagName")
      ).rejects.toThrow(
        "Unknown user or maximum number of tags reached for user."
      );
    });

    it("should return error if user has reached maximum", async () => {
      // given
      const { uid } = await UserTestData.createUser({
        tags: new Array(15).fill(0).map(() => ({
          _id: new ObjectId(),
          name: "any",
          personalBests: {} as any,
        })),
      });

      // when, then
      await expect(UserDAL.addTag(uid, "new")).rejects.toThrow(
        "Unknown user or maximum number of tags reached for user."
      );
    });

    it("addTag success", async () => {
      // given
      const emptyPb: SharedTypes.PersonalBests = {
        time: {},
        words: {},
        quote: {},
        zen: {},
        custom: {},
      };
      const { uid } = await UserTestData.createUser({
        tags: [
          {
            _id: new ObjectId(),
            name: "first",
            personalBests: emptyPb,
          },
        ],
      });

      // when
      await UserDAL.addTag(uid, "newTag");

      // then
      const read = await UserDAL.getUser(uid, "read");
      expect(read.tags).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "first", personalBests: emptyPb }),
          expect.objectContaining({ name: "newTag", personalBests: emptyPb }),
        ])
      );
    });
  });

  describe("editTag", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.editTag(
          "non existing uid",
          new ObjectId().toHexString(),
          "newName"
        )
      ).rejects.toThrow("Unknown user or tag not found");
    });

    it("should fail if tag not found", async () => {
      // given
      const tagOne: MonkeyTypes.DBUserTag = {
        _id: new ObjectId(),
        name: "one",
        personalBests: {} as any,
      };
      const { uid } = await UserTestData.createUser({
        tags: [tagOne],
      });

      // when, then
      await expect(
        UserDAL.editTag(uid, new ObjectId().toHexString(), "newName")
      ).rejects.toThrow("Unknown user or tag not found");
    });

    it("editTag success", async () => {
      // given
      const tagOne: MonkeyTypes.DBUserTag = {
        _id: new ObjectId(),
        name: "one",
        personalBests: {} as any,
      };
      const { uid } = await UserTestData.createUser({
        tags: [tagOne],
      });

      // when
      await UserDAL.editTag(uid, tagOne._id.toHexString(), "newTagName");

      // then
      const read = await UserDAL.getUser(uid, "read");
      expect(read.tags ?? [][0]).toStrictEqual([
        { ...tagOne, name: "newTagName" },
      ]);
    });
  });
  describe("removeTag", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.removeTag("non existing uid", new ObjectId().toHexString())
      ).rejects.toThrow("Unknown user or tag not found");
    });

    it("should return error if tag is unknown", async () => {
      // given
      const tagOne: MonkeyTypes.DBUserTag = {
        _id: new ObjectId(),
        name: "one",
        personalBests: {} as any,
      };
      const { uid } = await UserTestData.createUser({
        tags: [tagOne],
      });

      // when, then
      await expect(
        UserDAL.removeTag(uid, new ObjectId().toHexString())
      ).rejects.toThrow("Unknown user or tag not found");
    });
    it("should remove tag", async () => {
      // given
      const tagOne = {
        _id: new ObjectId(),
        name: "tagOne",
        personalBests: {} as any,
      };
      const tagTwo = {
        _id: new ObjectId(),
        name: "tagTwo",
        personalBests: {} as any,
      };
      const tagThree = {
        _id: new ObjectId(),
        name: "tagThree",
        personalBests: {} as any,
      };

      const { uid } = await UserTestData.createUser({
        tags: [tagOne, tagTwo, tagThree],
      });

      // when, then
      await UserDAL.removeTag(uid, tagTwo._id.toHexString());

      const read = await UserDAL.getUser(uid, "read");
      expect(read.tags).toStrictEqual([tagOne, tagThree]);
    });
  });

  describe("removeTagPb", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.removeTagPb("non existing uid", new ObjectId().toHexString())
      ).rejects.toThrow("Unknown user or tag not found");
    });

    it("should return error if tag is unknown", async () => {
      // given
      const tagOne: MonkeyTypes.DBUserTag = {
        _id: new ObjectId(),
        name: "one",
        personalBests: {} as any,
      };
      const { uid } = await UserTestData.createUser({
        tags: [tagOne],
      });

      // when, then
      await expect(
        UserDAL.removeTagPb(uid, new ObjectId().toHexString())
      ).rejects.toThrow("Unknown user or tag not found");
    });
    it("should remove tag pb", async () => {
      // given
      const tagOne = {
        _id: new ObjectId(),
        name: "tagOne",
        personalBests: {
          custom: { custom: [mockPersonalBest] },
        } as SharedTypes.PersonalBests,
      };
      const tagTwo = {
        _id: new ObjectId(),
        name: "tagTwo",
        personalBests: {
          custom: { custom: [mockPersonalBest] },
        } as SharedTypes.PersonalBests,
      };
      const tagThree = {
        _id: new ObjectId(),
        name: "tagThree",
        personalBests: {
          custom: { custom: [mockPersonalBest] },
        } as SharedTypes.PersonalBests,
      };

      const { uid } = await UserTestData.createUser({
        tags: [tagOne, tagTwo, tagThree],
      });

      // when, then
      await UserDAL.removeTagPb(uid, tagTwo._id.toHexString());

      const read = await UserDAL.getUser(uid, "read");
      expect(read.tags).toStrictEqual([
        tagOne,
        {
          ...tagTwo,
          personalBests: {
            time: {},
            words: {},
            quote: {},
            zen: {},
            custom: {},
          },
        },
        tagThree,
      ]);
    });
  });

  it("updateProfile should appropriately handle multiple profile updates", async () => {
    await UserDAL.addUser("test name", "test email", "TestID");

    await UserDAL.updateProfile(
      "TestID",
      {
        bio: "test bio",
      },
      {
        badges: [],
      }
    );

    const user = await UserDAL.getUser("TestID", "test add result filters");
    expect(user.profileDetails).toStrictEqual({
      bio: "test bio",
    });
    expect(user.inventory).toStrictEqual({
      badges: [],
    });

    await UserDAL.updateProfile(
      "TestID",
      {
        keyboard: "test keyboard",
        socialProfiles: {
          twitter: "test twitter",
        },
      },
      {
        badges: [
          {
            id: 1,
            selected: true,
          },
        ],
      }
    );

    const updatedUser = await UserDAL.getUser(
      "TestID",
      "test add result filters"
    );
    expect(updatedUser.profileDetails).toStrictEqual({
      bio: "test bio",
      keyboard: "test keyboard",
      socialProfiles: {
        twitter: "test twitter",
      },
    });
    expect(updatedUser.inventory).toStrictEqual({
      badges: [
        {
          id: 1,
          selected: true,
        },
      ],
    });

    await UserDAL.updateProfile(
      "TestID",
      {
        bio: "test bio 2",
        socialProfiles: {
          github: "test github",
          website: "test website",
        },
      },
      {
        badges: [
          {
            id: 1,
          },
        ],
      }
    );

    const updatedUser2 = await UserDAL.getUser(
      "TestID",
      "test add result filters"
    );
    expect(updatedUser2.profileDetails).toStrictEqual({
      bio: "test bio 2",
      keyboard: "test keyboard",
      socialProfiles: {
        twitter: "test twitter",
        github: "test github",
        website: "test website",
      },
    });
    expect(updatedUser2.inventory).toStrictEqual({
      badges: [
        {
          id: 1,
        },
      ],
    });
  });

  it("resetUser should reset user", async () => {
    await UserDAL.addUser("test name", "test email", "TestID");

    await UserDAL.updateProfile(
      "TestID",
      {
        bio: "test bio",
        keyboard: "test keyboard",
        socialProfiles: {
          twitter: "test twitter",
          github: "test github",
        },
      },
      {
        badges: [],
      }
    );

    await UserDAL.incrementBananas("TestID", "100");
    await UserDAL.incrementXp("TestID", 15);

    await UserDAL.resetUser("TestID");
    const resetUser = await UserDAL.getUser(
      "TestID",
      "test add result filters"
    );

    expect(resetUser.profileDetails).toStrictEqual({
      bio: "",
      keyboard: "",
      socialProfiles: {},
    });

    expect(resetUser.inventory).toStrictEqual({
      badges: [],
    });

    expect(resetUser.bananas).toStrictEqual(0);
    expect(resetUser.xp).toStrictEqual(0);
    expect(resetUser.streak).toStrictEqual({
      length: 0,
      lastResultTimestamp: 0,
      maxLength: 0,
    });
  });

  it("getInbox should return the user's inbox", async () => {
    await UserDAL.addUser("test name", "test email", "TestID");

    const emptyInbox = await UserDAL.getInbox("TestID");

    expect(emptyInbox).toStrictEqual([]);

    await UserDAL.addToInbox(
      "TestID",
      [
        {
          subject: `Hello!`,
        } as any,
      ],
      {
        enabled: true,
        maxMail: 100,
      }
    );

    const inbox = await UserDAL.getInbox("TestID");

    expect(inbox).toStrictEqual([
      {
        subject: "Hello!",
      },
    ]);
  });

  it("addToInbox discards mail if inbox is full", async () => {
    await UserDAL.addUser("test name", "test email", "TestID");

    const config = {
      enabled: true,
      maxMail: 1,
    };

    await UserDAL.addToInbox(
      "TestID",
      [
        {
          subject: "Hello 1!",
        } as any,
      ],
      config
    );

    await UserDAL.addToInbox(
      "TestID",
      [
        {
          subject: "Hello 2!",
        } as any,
      ],
      config
    );

    const inbox = await UserDAL.getInbox("TestID");

    expect(inbox).toStrictEqual([
      {
        subject: "Hello 2!",
      },
    ]);
  });

  it("addToInboxBulk should add mail to multiple users", async () => {
    await UserDAL.addUser("test name", "test email", "TestID");
    await UserDAL.addUser("test name 2", "test email 2", "TestID2");

    await UserDAL.addToInboxBulk(
      [
        {
          uid: "TestID",
          mail: [
            {
              subject: `Hello!`,
            } as any,
          ],
        },
        {
          uid: "TestID2",
          mail: [
            {
              subject: `Hello 2!`,
            } as any,
          ],
        },
      ],
      {
        enabled: true,
        maxMail: 100,
      }
    );

    const inbox = await UserDAL.getInbox("TestID");
    const inbox2 = await UserDAL.getInbox("TestID2");

    expect(inbox).toStrictEqual([
      {
        subject: "Hello!",
      },
    ]);

    expect(inbox2).toStrictEqual([
      {
        subject: "Hello 2!",
      },
    ]);
  });

  it("updateStreak should update streak", async () => {
    await UserDAL.addUser("testStack", "test email", "TestID");

    const testSteps = [
      {
        date: "2023/06/07 21:00:00 UTC",
        expectedStreak: 1,
      },
      {
        date: "2023/06/07 23:00:00 UTC",
        expectedStreak: 1,
      },
      {
        date: "2023/06/08 00:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/08 23:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/09 00:00:00 UTC",
        expectedStreak: 3,
      },
      {
        date: "2023/06/11 00:00:00 UTC",
        expectedStreak: 1,
      },
    ];

    for (const { date, expectedStreak } of testSteps) {
      const milis = new Date(date).getTime();
      Date.now = vi.fn(() => milis);

      const streak = await updateStreak("TestID", milis);

      await expect(streak).toBe(expectedStreak);
    }
  });

  it("positive streak offset should award streak correctly", async () => {
    await UserDAL.addUser("testStack", "test email", "TestID");

    await UserDAL.setStreakHourOffset("TestID", 10);

    const testSteps = [
      {
        date: "2023/06/06 21:00:00 UTC",
        expectedStreak: 1,
      },
      {
        date: "2023/06/07 01:00:00 UTC",
        expectedStreak: 1,
      },
      {
        date: "2023/06/07 09:00:00 UTC",
        expectedStreak: 1,
      },
      {
        date: "2023/06/07 10:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/07 23:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/08 00:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/08 01:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/08 09:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/08 10:00:00 UTC",
        expectedStreak: 3,
      },
      {
        date: "2023/06/10 10:00:00 UTC",
        expectedStreak: 1,
      },
    ];

    for (const { date, expectedStreak } of testSteps) {
      const milis = new Date(date).getTime();
      Date.now = vi.fn(() => milis);

      const streak = await updateStreak("TestID", milis);

      await expect(streak).toBe(expectedStreak);
    }
  });

  it("negative streak offset should award streak correctly", async () => {
    await UserDAL.addUser("testStack", "test email", "TestID");

    await UserDAL.setStreakHourOffset("TestID", -4);

    const testSteps = [
      {
        date: "2023/06/06 19:00:00 UTC",
        expectedStreak: 1,
      },
      {
        date: "2023/06/06 20:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/07 01:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/07 19:00:00 UTC",
        expectedStreak: 2,
      },
      {
        date: "2023/06/07 20:00:00 UTC",
        expectedStreak: 3,
      },
      {
        date: "2023/06/09 23:00:00 UTC",
        expectedStreak: 1,
      },
    ];

    for (const { date, expectedStreak } of testSteps) {
      const milis = new Date(date).getTime();
      Date.now = vi.fn(() => milis);

      const streak = await updateStreak("TestID", milis);

      await expect(streak).toBe(expectedStreak);
    }
  });
  describe("incrementTestActivity", () => {
    it("ignores user without migration", async () => {
      // given
      const user = await UserTestData.createUserWithoutMigration();

      //when
      await UserDAL.incrementTestActivity(user, 1712102400000);

      //then
      const read = await UserDAL.getUser(user.uid, "");
      expect(read.testActivity).toBeUndefined();
    });
    it("increments for new year", async () => {
      // given
      const user = await UserTestData.createUser({
        testActivity: { "2023": [null, 1] },
      });

      //when
      await UserDAL.incrementTestActivity(user, 1712102400000);

      //then
      const read = (await UserDAL.getUser(user.uid, "")).testActivity || {};
      expect(read).toHaveProperty("2024");
      const year2024 = read["2024"];
      expect(year2024).toHaveLength(94);
      //fill previous days with null
      expect(year2024.slice(0, 93)).toEqual(new Array(93).fill(null));
      expect(year2024[93]).toEqual(1);
    });
    it("increments for existing year", async () => {
      // given
      const user = await UserTestData.createUser({
        testActivity: { "2024": [null, 5] },
      });

      //when
      await UserDAL.incrementTestActivity(user, 1712102400000);

      //then
      const read = (await UserDAL.getUser(user.uid, "")).testActivity || {};
      expect(read).toHaveProperty("2024");
      const year2024 = read["2024"];
      expect(year2024).toHaveLength(94);

      expect(year2024[0]).toBeNull();
      expect(year2024[1]).toEqual(5);
      expect(year2024.slice(2, 91)).toEqual(new Array(89).fill(null));
      expect(year2024[93]).toEqual(1);
    });
    it("increments for existing day", async () => {
      // given
      let user = await UserTestData.createUser({ testActivity: {} });
      await UserDAL.incrementTestActivity(user, 1712102400000);
      user = await UserDAL.getUser(user.uid, "");

      //when
      await UserDAL.incrementTestActivity(user, 1712102400000);

      //then
      const read = (await UserDAL.getUser(user.uid, "")).testActivity || {};
      const year2024 = read["2024"];
      expect(year2024[93]).toEqual(2);
    });
  });
  describe("getPartialUser", () => {
    it("should throw for unknown user", async () => {
      expect(async () =>
        UserDAL.getPartialUser("1234", "stack", [])
      ).rejects.toThrowError("User not found\nStack: stack");
    });

    it("should get streak", async () => {
      //GIVEN
      let user = await UserTestData.createUser({
        streak: {
          hourOffset: 1,
          length: 5,
          lastResultTimestamp: 4711,
          maxLength: 23,
        },
      });

      //WHEN
      const partial = await UserDAL.getPartialUser(user.uid, "streak", [
        "streak",
      ]);

      //THEN
      expect(partial).toStrictEqual({
        _id: user._id,
        streak: {
          hourOffset: 1,
          length: 5,
          lastResultTimestamp: 4711,
          maxLength: 23,
        },
      });
    });
  });
  describe("updateEmail", () => {
    it("throws for nonexisting user", async () => {
      expect(async () =>
        UserDAL.updateEmail("unknown", "test@example.com")
      ).rejects.toThrowError("User not found\nStack: update email");
    });
    it("should update", async () => {
      //given
      const { uid } = await UserTestData.createUser({ email: "init" });

      //when
      await expect(UserDAL.updateEmail(uid, "next")).resolves.toBe(true);

      //then
      const read = await UserDAL.getUser(uid, "read");
      expect(read.email).toEqual("next");
    });
  });
  describe("resetPb", () => {
    it("throws for nonexisting user", async () => {
      expect(async () => UserDAL.resetPb("unknown")).rejects.toThrowError(
        "User not found\nStack: reset pb"
      );
    });
    it("should reset", async () => {
      //given
      const { uid } = await UserTestData.createUser({
        personalBests: { custom: { custom: [{ acc: 1 } as any] } } as any,
      });

      //when
      await UserDAL.resetPb(uid);

      //then
      const read = await UserDAL.getUser(uid, "read");
      expect(read.personalBests).toStrictEqual({
        time: {},
        words: {},
        quote: {},
        zen: {},
        custom: {},
      });
    });
  });
  describe("linkDiscord", () => {
    it("throws for nonexisting user", async () => {
      expect(async () =>
        UserDAL.linkDiscord("unknown", "", "")
      ).rejects.toThrowError("User not found\nStack: link discord");
    });
    it("should update", async () => {
      //given
      const { uid } = await UserTestData.createUser({
        discordId: "discordId",
        discordAvatar: "discordAvatar",
      });

      //when
      await UserDAL.linkDiscord(uid, "newId", "newAvatar");

      //then
      const read = await UserDAL.getUser(uid, "read");
      expect(read.discordId).toEqual("newId");
      expect(read.discordAvatar).toEqual("newAvatar");
    });
  });
  describe("unlinkDiscord", () => {
    it("throws for nonexisting user", async () => {
      expect(async () => UserDAL.unlinkDiscord("unknown")).rejects.toThrowError(
        "User not found\nStack: unlink discord"
      );
    });
    it("should update", async () => {
      //given
      const { uid } = await UserTestData.createUser({
        discordId: "discordId",
        discordAvatar: "discordAvatar",
      });

      //when
      await UserDAL.unlinkDiscord(uid);

      //then
      const read = await UserDAL.getUser(uid, "read");
      expect(read.discordId).toBeUndefined();
      expect(read.discordAvatar).toBeUndefined();
    });
  });
  describe("updateInbox", () => {
    it("claims rewards", async () => {
      //GIVEN
      const rewardOne: SharedTypes.MonkeyMail = {
        id: "b5866d4c-0749-41b6-b101-3656249d39b9",
        body: "test",
        subject: "reward one",
        timestamp: 1,
        read: false,
        rewards: [
          { type: "xp", item: 400 },
          { type: "xp", item: 600 },
          { type: "badge", item: { id: 4 } },
        ],
      };
      const rewardTwo: SharedTypes.MonkeyMail = {
        id: "3692b9f5-84fb-4d9b-bd39-9a3217b3a33a",
        body: "test",
        subject: "reward two",
        timestamp: 2,
        read: false,
        rewards: [{ type: "xp", item: 2000 }],
      };
      const rewardThree: SharedTypes.MonkeyMail = {
        id: "0d73b3e0-dc79-4abb-bcaf-66fa6b09a58a",
        body: "test",
        subject: "reward three",
        timestamp: 3,
        read: true,
        rewards: [{ type: "xp", item: 2000 }],
      };

      let user = await UserTestData.createUser({
        xp: 100,
        inbox: [rewardOne, rewardTwo, rewardThree],
      });

      //WNEN
      await UserDAL.updateInbox(
        user.uid,
        [rewardOne.id, rewardTwo.id, rewardThree.id],
        []
      );

      //THEN
      const { xp, inbox } = await UserDAL.getUser(user.uid, "");
      expect(xp).toEqual(3100);

      //inbox is sorted by timestamp
      expect(inbox).toStrictEqual([
        { ...rewardThree },
        { ...rewardTwo, read: true, rewards: [] },
        { ...rewardOne, read: true, rewards: [] },
      ]);
    });

    it("removes", async () => {
      //GIVEN
      const rewardOne = {
        id: "b5866d4c-0749-41b6-b101-3656249d39b9",
        body: "test",
        subject: "reward one",
        timestamp: 0,
        read: false,
        rewards: [],
      };
      const rewardTwo = {
        id: "3692b9f5-84fb-4d9b-bd39-9a3217b3a33a",
        body: "test",
        subject: "reward two",
        timestamp: 0,
        read: true,
        rewards: [],
      };
      const rewardThree = {
        id: "0d73b3e0-dc79-4abb-bcaf-66fa6b09a58a",
        body: "test",
        subject: "reward three",
        timestamp: 0,
        read: false,
        rewards: [],
      };

      let user = await UserTestData.createUser({
        xp: 100,
        inbox: [rewardOne, rewardTwo, rewardThree],
      });

      //WNEN
      await UserDAL.updateInbox(user.uid, [], [rewardOne.id, rewardTwo.id]);

      //THEN
      const { inbox } = await UserDAL.getUser(user.uid, "");
      expect(inbox).toStrictEqual([rewardThree]);
    });

    it("updates badge", async () => {
      //GIVEN
      const rewardOne: SharedTypes.MonkeyMail = {
        id: "b5866d4c-0749-41b6-b101-3656249d39b9",
        body: "test",
        subject: "reward one",
        timestamp: 2,
        read: false,
        rewards: [
          { type: "xp", item: 400 },
          { type: "badge", item: { id: 4 } },
        ],
      };
      const rewardTwo: SharedTypes.MonkeyMail = {
        id: "3692b9f5-84fb-4d9b-bd39-9a3217b3a33a",
        body: "test",
        subject: "reward two",
        timestamp: 1,
        read: false,
        rewards: [{ type: "badge", item: { id: 5 } }],
      };
      const rewardThree: SharedTypes.MonkeyMail = {
        id: "0d73b3e0-dc79-4abb-bcaf-66fa6b09a58a",
        body: "test",
        subject: "reward three",
        timestamp: 0,
        read: true,
        rewards: [{ type: "badge", item: { id: 6 } }],
      };

      let user = await UserTestData.createUser({
        inbox: [rewardOne, rewardTwo, rewardThree],
        inventory: { badges: [{ id: 1, selected: true }] },
      });

      //WNEN
      await UserDAL.updateInbox(
        user.uid,
        [rewardOne.id, rewardTwo.id, rewardThree.id, rewardOne.id],
        []
      );

      //THEN
      const { inbox, inventory } = await UserDAL.getUser(user.uid, "");
      expect(inbox).toStrictEqual([
        { ...rewardOne, read: true, rewards: [] },
        { ...rewardTwo, read: true, rewards: [] },
        { ...rewardThree },
      ]);
      expect(inventory?.badges).toStrictEqual([
        { id: 1, selected: true },
        { id: 4 },
        { id: 5 },
      ]);
    });

    it("does not claim reward multiple times", async () => {
      //GIVEN
      const rewardOne: SharedTypes.MonkeyMail = {
        id: "b5866d4c-0749-41b6-b101-3656249d39b9",
        body: "test",
        subject: "reward one",
        timestamp: 0,
        read: false,
        rewards: [
          { type: "xp", item: 400 },
          { type: "xp", item: 600 },
          { type: "badge", item: { id: 4 } },
        ],
      };
      const rewardTwo: SharedTypes.MonkeyMail = {
        id: "3692b9f5-84fb-4d9b-bd39-9a3217b3a33a",
        body: "test",
        subject: "reward two",
        timestamp: 0,
        read: false,
        rewards: [{ type: "xp", item: 2000 }],
      };
      const rewardThree: SharedTypes.MonkeyMail = {
        id: "0d73b3e0-dc79-4abb-bcaf-66fa6b09a58a",
        body: "test",
        subject: "reward three",
        timestamp: 0,
        read: true,
        rewards: [{ type: "xp", item: 2000 }],
      };

      let user = await UserTestData.createUser({
        xp: 100,
        inbox: [rewardOne, rewardTwo, rewardThree],
      });

      const count = 100;
      const calls = new Array(count)
        .fill(0)
        .map(() =>
          UserDAL.updateInbox(
            user.uid,
            [rewardOne.id, rewardTwo.id, rewardOne.id, rewardThree.id],
            []
          )
        );

      await Promise.all(calls);

      //THEN

      const { xp } = await UserDAL.getUser(user.uid, "");
      expect(xp).toEqual(3100);
    });
  });
  describe("isDiscordIdAvailable", () => {
    it("should return true for available discordId", async () => {
      await expect(UserDAL.isDiscordIdAvailable("myId")).resolves.toBe(true);
    });

    it("should return false if discordId is taken", async () => {
      // given
      await UserTestData.createUser({
        discordId: "myId",
      });

      // when, then
      await expect(UserDAL.isDiscordIdAvailable("myId")).resolves.toBe(false);
    });
  });
  describe("updateLbMemory", () => {
    it("should return error if uuid not found", async () => {
      // when, then
      await expect(
        UserDAL.updateLbMemory(
          "non existing uid",
          "time",
          "15",
          "english",
          4711
        )
      ).rejects.toThrow("User not found\nStack: update lb memory");
    });

    it("updates on empty lbMemory", async () => {
      //GIVEN
      const { uid } = await UserTestData.createUser({});

      //WHEN
      await UserDAL.updateLbMemory(uid, "time", "15", "english", 4711);

      //THEN
      const read = await UserDAL.getUser(uid, "read");
      expect(read.lbMemory).toStrictEqual({
        time: {
          "15": {
            english: 4711,
          },
        },
      });
    });
    it("updates on empty lbMemory.mode", async () => {
      //GIVEN
      const { uid } = await UserTestData.createUser({
        lbMemory: { custom: {} },
      });

      //WHEN
      await UserDAL.updateLbMemory(uid, "time", "15", "english", 4711);

      //THEN
      const read = await UserDAL.getUser(uid, "read");
      expect(read.lbMemory).toStrictEqual({
        custom: {},
        time: {
          "15": {
            english: 4711,
          },
        },
      });
    });
    it("updates on empty lbMemory.mode.mode2", async () => {
      //GIVEN
      const { uid } = await UserTestData.createUser({
        lbMemory: { time: { "30": {} } },
      });

      //WHEN
      await UserDAL.updateLbMemory(uid, "time", "15", "english", 4711);

      //THEN
      const read = await UserDAL.getUser(uid, "read");
      expect(read.lbMemory).toStrictEqual({
        time: {
          "15": {
            english: 4711,
          },
          "30": {},
        },
      });
    });
  });
});
