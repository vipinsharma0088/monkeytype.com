import MonkeyTypes, { Id } from "@monkeytype/types";
import { hash } from "bcrypt";
import { randomBytes } from "crypto";
import _ from "lodash";
import { ObjectId } from "mongodb";
import * as ApeKeysDAL from "../../dal/ape-keys";
import MonkeyError from "../../utils/error";
import { base64UrlEncode } from "../../utils/misc";
import { MonkeyResponse } from "../../utils/monkey-response";

function cleanApeKey(apeKey: MonkeyTypes.ApeKey): Partial<MonkeyTypes.ApeKey> {
  return _.omit(apeKey, "hash", "_id", "uid", "useCount");
}

export async function getApeKeys(
  req: MonkeyTypes.Request
): Promise<MonkeyResponse> {
  const { uid } = req.ctx.decodedToken;

  const apeKeys = await ApeKeysDAL.getApeKeys(uid);
  const cleanedKeys = _(apeKeys).keyBy("_id").mapValues(cleanApeKey).value();

  return new MonkeyResponse("ApeKeys retrieved", cleanedKeys);
}

export async function generateApeKey(
  req: MonkeyTypes.Request
): Promise<MonkeyResponse> {
  const { name, enabled } = req.body;
  const { uid } = req.ctx.decodedToken;
  const { maxKeysPerUser, apeKeyBytes, apeKeySaltRounds } =
    req.ctx.configuration.apeKeys;

  const currentNumberOfApeKeys = await ApeKeysDAL.countApeKeysForUser(uid);

  if (currentNumberOfApeKeys >= maxKeysPerUser) {
    throw new MonkeyError(409, "Maximum number of ApeKeys have been generated");
  }

  const apiKey = randomBytes(apeKeyBytes).toString("base64url");
  const saltyHash = await hash(apiKey, apeKeySaltRounds);

  const apeKey: Id<MonkeyTypes.ApeKey> = {
    _id: new ObjectId(),
    name,
    enabled,
    uid,
    hash: saltyHash,
    createdOn: Date.now(),
    modifiedOn: Date.now(),
    lastUsedOn: -1,
    useCount: 0,
  };

  const apeKeyId = await ApeKeysDAL.addApeKey(apeKey);

  return new MonkeyResponse("ApeKey generated", {
    apeKey: base64UrlEncode(`${apeKeyId}.${apiKey}`),
    apeKeyId,
    apeKeyDetails: cleanApeKey(apeKey),
  });
}

export async function editApeKey(
  req: MonkeyTypes.Request
): Promise<MonkeyResponse> {
  const { apeKeyId } = req.params;
  const { name, enabled } = req.body;
  const { uid } = req.ctx.decodedToken;

  await ApeKeysDAL.editApeKey(uid, apeKeyId, name, enabled);

  return new MonkeyResponse("ApeKey updated");
}

export async function deleteApeKey(
  req: MonkeyTypes.Request
): Promise<MonkeyResponse> {
  const { apeKeyId } = req.params;
  const { uid } = req.ctx.decodedToken;

  await ApeKeysDAL.deleteApeKey(uid, apeKeyId);

  return new MonkeyResponse("ApeKey deleted");
}
