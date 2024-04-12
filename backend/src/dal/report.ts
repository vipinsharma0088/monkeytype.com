import MonkeyError from "../utils/error";
import * as db from "../init/db";

const COLLECTION_NAME = "reports";

export async function getReports(
  reportIds: ObjectId[]
): Promise<MonkeyTypes.Report[]> {
  const query = { _id: { $in: reportIds } };
  return await db
    .collection<MonkeyTypes.Report>(COLLECTION_NAME)
    .find(query)
    .toArray();
}

export async function deleteReports(reportIds: ObjectId[]): Promise<void> {
  const query = { _id: { $in: reportIds } };
  await db.collection(COLLECTION_NAME).deleteMany(query);
}

export async function createReport(
  report: MonkeyTypes.Report,
  maxReports: number,
  contentReportLimit: number
): Promise<void> {
  if (report.type === "user" && report.contentId === report.uid) {
    throw new MonkeyError(400, "You cannot report yourself.");
  }

  const reportsCount = await db
    .collection<MonkeyTypes.Report>(COLLECTION_NAME)
    .estimatedDocumentCount();

  if (reportsCount >= maxReports) {
    throw new MonkeyError(
      503,
      "Reports are not being accepted at this time due to a large backlog of reports. Please try again later."
    );
  }

  const sameReports = await db
    .collection<MonkeyTypes.Report>(COLLECTION_NAME)
    .find({ contentId: report.contentId })
    .toArray();

  if (sameReports.length >= contentReportLimit) {
    throw new MonkeyError(
      409,
      "A report limit for this content has been reached."
    );
  }

  await db.collection<MonkeyTypes.Report>(COLLECTION_NAME).insertOne(report);
}
