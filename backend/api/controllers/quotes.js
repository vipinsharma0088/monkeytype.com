const { v4: uuidv4 } = require("uuid");
const ReportDAO = require("../../dao/report");
const UserDAO = require("../../dao/user");
const MonkeyError = require("../../handlers/error");

class QuotesController {
  static async reportQuote(req, res) {
    const { uid } = req.decodedToken;

    const user = await UserDAO.getUser(uid);
    if (user.cannotReport) {
      throw new MonkeyError(403, "You don't have permission to do this");
    }

    const { quoteId, quoteLanguage, reason, comment } = req.body;

    const newReport = {
      id: uuidv4(),
      type: "Quote",
      reportedAt: new Date().getTime(),
      reporterId: uid,
      reporterName: user.name,
      details: {
        contentId: `${quoteLanguage}-${quoteId}`,
        reason,
        comment,
      },
      status: "pending",
    };

    await ReportDAO.createReport(newReport);

    res.sendStatus(200);
  }
}

module.exports = QuotesController;
