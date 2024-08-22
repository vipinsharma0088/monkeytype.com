import request from "supertest";
import app from "../../../src/app";
import * as PresetDal from "../../../src/dal/preset";
import { ObjectId } from "mongodb";
import { PresetSettingGroupSchema } from "@monkeytype/contracts/schemas/presets";
import { ShowAverageSchema } from "@monkeytype/contracts/schemas/configs";
const mockApp = request(app);

describe("PresetController", () => {
  describe("get presets", () => {
    const getPresetsMock = vi.spyOn(PresetDal, "getPresets");

    afterEach(() => {
      getPresetsMock.mockReset();
    });

    it("should get the users presets", async () => {
      //GIVEN
      const presetOne = {
        _id: new ObjectId(),
        uid: "123456789",
        name: "test1",
        config: {
          showKeyTips: true,
          capsLockWarning: true,
          showOutOfFocusWarning: true,
          showAverage: ShowAverageSchema.Enum.off,
          settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
        },
      };
      const presetTwo = {
        _id: new ObjectId(),
        uid: "123456789",
        name: "test2",
        config: {
          showKeyTips: true,
          capsLockWarning: true,
          showOutOfFocusWarning: true,
          showAverage: ShowAverageSchema.Enum.off,
          settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
        },
      };

      getPresetsMock.mockResolvedValue([presetOne, presetTwo]);

      //WHEN
      const { body } = await mockApp
        .get("/presets")
        .set("authorization", "Uid 123456789")
        .expect(200);

      //THEN
      expect(body).toStrictEqual({
        message: "Presets retrieved",
        data: [
          {
            _id: presetOne._id.toHexString(),
            name: "test1",
            config: {
              showKeyTips: true,
              capsLockWarning: true,
              showOutOfFocusWarning: true,
              showAverage: ShowAverageSchema.Enum.off,
              settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
            },
          },
          {
            _id: presetTwo._id.toHexString(),
            name: "test2",
            config: {
              showKeyTips: true,
              capsLockWarning: true,
              showOutOfFocusWarning: true,
              showAverage: ShowAverageSchema.Enum.off,
              settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
            },
          },
        ],
      });

      expect(getPresetsMock).toHaveBeenCalledWith("123456789");
    });
    it("should return empty array if user has no presets", async () => {
      //GIVEN
      getPresetsMock.mockResolvedValue([]);

      //WHEN
      const { body } = await mockApp
        .get("/presets")
        .set("authorization", "Uid 123456789")
        .expect(200);

      //THEN
      expect(body).toStrictEqual({
        message: "Presets retrieved",
        data: [],
      });

      expect(getPresetsMock).toHaveBeenCalledWith("123456789");
    });
  });

  describe("add preset", () => {
    const addPresetMock = vi.spyOn(PresetDal, "addPreset");

    afterEach(() => {
      addPresetMock.mockReset();
    });

    it("should add the users preset", async () => {
      //GIVEN
      addPresetMock.mockResolvedValue({ presetId: "1" });

      //WHEN
      const { body } = await mockApp
        .post("/presets")
        .set("authorization", "Uid 123456789")
        .accept("application/json")
        .send({
          name: "new",
          config: {
            showKeyTips: true,
            capsLockWarning: true,
            showOutOfFocusWarning: true,
            showAverage: ShowAverageSchema.Enum.off,
            settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
          },
        })
        .expect(200);

      //THEN
      expect(body).toStrictEqual({
        message: "Preset created",
        data: { presetId: "1" },
      });

      expect(addPresetMock).toHaveBeenCalledWith("123456789", {
        name: "new",
        config: {
          showKeyTips: true,
          capsLockWarning: true,
          showOutOfFocusWarning: true,
          showAverage: ShowAverageSchema.Enum.off,
          settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
        },
      });
    });
    it("should fail with missing mandatory properties", async () => {
      //WHEN
      const { body } = await mockApp
        .post("/presets")
        .set("authorization", "Uid 123456789")
        .accept("application/json")
        .send({})
        .expect(422);

      expect(body).toStrictEqual({
        message: "Invalid request data schema",
        validationErrors: [`"name" Required`, `"config" Required`],
      });
      expect(addPresetMock).not.toHaveBeenCalled();
    });
    it("should fail with missing settingGroups properties", async () => {
      //WHEN
      const { body } = await mockApp
        .post("/presets")
        .set("authorization", "Uid 123456789")
        .accept("application/json")
        .send({
          name: "update",
          config: {},
        })
        .expect(422);

      expect(body).toStrictEqual({
        message: "Invalid request data schema",
        validationErrors: [`"config.settingGroups" Required`],
      });
      expect(addPresetMock).not.toHaveBeenCalled();
    });
  });

  describe("update preset", () => {
    const editPresetMock = vi.spyOn(PresetDal, "editPreset");

    afterEach(() => {
      editPresetMock.mockReset();
    });

    it("should update the users preset", async () => {
      //GIVEN
      editPresetMock.mockResolvedValue({} as any);

      //WHEN
      const { body } = await mockApp
        .patch("/presets")
        .set("authorization", "Uid 123456789")
        .accept("application/json")
        .send({
          _id: "1",
          name: "new",
          config: {
            showKeyTips: true,
            capsLockWarning: true,
            showOutOfFocusWarning: true,
            showAverage: ShowAverageSchema.Enum.off,
            settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
          },
        })
        .expect(200);

      //THEN
      expect(body).toStrictEqual({
        message: "Preset updated",
        data: null,
      });

      expect(editPresetMock).toHaveBeenCalledWith("123456789", {
        _id: "1",
        name: "new",
        config: {
          showKeyTips: true,
          capsLockWarning: true,
          showOutOfFocusWarning: true,
          showAverage: ShowAverageSchema.Enum.off,
          settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
        },
      });
    });
    it("should fail with missing mandatory properties", async () => {
      //WHEN
      const { body } = await mockApp
        .patch("/presets")
        .set("authorization", "Uid 123456789")
        .accept("application/json")
        .send({})
        .expect(422);

      expect(body).toStrictEqual({
        message: "Invalid request data schema",
        validationErrors: [
          `"_id" Required`,
          `"name" Required`,
          `"config" Required`,
        ],
      });
      expect(editPresetMock).not.toHaveBeenCalled();
    });
    it("should not fail with invalid preset", async () => {
      //WHEN
      const { body } = await mockApp
        .patch("/presets")
        .set("authorization", "Uid 123456789")
        .accept("application/json")
        .send({
          _id: "1",
          name: "update",
          extra: "extra",
          config: {
            extra: "extra",
            autoSwitchTheme: "yes",
            confidenceMode: "pretty",
            showKeyTips: true,
            capsLockWarning: true,
            showOutOfFocusWarning: true,
            showAverage: ShowAverageSchema.Enum.off,
            settingGroups: [PresetSettingGroupSchema.enum["hide elements"]],
          },
        })
        .expect(422);

      //THEN
      expect(body).toStrictEqual({
        message: "Invalid request data schema",
        validationErrors: [
          `"config.autoSwitchTheme" Expected boolean, received string`,
          `"config.confidenceMode" Invalid enum value. Expected 'off' | 'on' | 'max', received 'pretty'`,
          `"config" Unrecognized key(s) in object: 'extra'`,
          `Unrecognized key(s) in object: 'extra'`,
        ],
      });

      expect(editPresetMock).not.toHaveBeenCalled();
    });
  });
  describe("delete config", () => {
    const deletePresetMock = vi.spyOn(PresetDal, "removePreset");

    afterEach(() => {
      deletePresetMock.mockReset();
    });

    it("should delete the users preset", async () => {
      //GIVEN
      deletePresetMock.mockResolvedValue();

      //WHEN

      const { body } = await mockApp
        .delete("/presets/1")
        .set("authorization", "Uid 123456789")
        .expect(200);

      //THEN
      expect(body).toStrictEqual({
        message: "Preset deleted",
        data: null,
      });

      expect(deletePresetMock).toHaveBeenCalledWith("123456789", "1");
    });
    it("should fail without preset _id", async () => {
      //GIVEN
      deletePresetMock.mockResolvedValue();

      //WHEN
      await mockApp
        .delete("/presets/")
        .set("authorization", "Uid 123456789")
        .expect(404);

      expect(deletePresetMock).not.toHaveBeenCalled();
    });
  });
});
