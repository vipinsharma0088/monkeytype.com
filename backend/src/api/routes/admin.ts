// import joi from "joi";
import { Router } from "express";
import { authenticateRequest } from "../../middlewares/auth.js";
import * as AdminController from "../controllers/admin.js";
import { adminLimit } from "../../middlewares/rate-limit.js";
import { sendForgotPasswordEmail, toggleBan } from "../controllers/user.js";
import joi from "joi";
import { validate } from "../../middlewares/configuration.js";
import { checkIfUserIsAdmin } from "../../middlewares/permission.js";
import { asyncHandler } from "../../middlewares/utility.js";
import { validateRequest } from "../../middlewares/validation.js";

const router = Router();

router.use(
  validate({
    criteria: (configuration) => {
      return configuration.admin.endpointsEnabled;
    },
    invalidMessage: "Admin endpoints are currently disabled.",
  })
);

router.get(
  "/",
  adminLimit,
  authenticateRequest({
    noCache: true,
  }),
  checkIfUserIsAdmin(),
  asyncHandler(AdminController.test)
);

router.post(
  "/toggleBan",
  adminLimit,
  authenticateRequest({
    noCache: true,
  }),
  checkIfUserIsAdmin(),
  validateRequest({
    body: {
      uid: joi.string().required().token(),
    },
  }),
  asyncHandler(toggleBan)
);

router.post(
  "/report/accept",
  authenticateRequest({
    noCache: true,
  }),
  checkIfUserIsAdmin(),
  validateRequest({
    body: {
      reports: joi
        .array()
        .items(
          joi.object({
            reportId: joi.string().required(),
          })
        )
        .required(),
    },
  }),
  asyncHandler(AdminController.acceptReports)
);

router.post(
  "/report/reject",
  authenticateRequest({
    noCache: true,
  }),
  checkIfUserIsAdmin(),
  validateRequest({
    body: {
      reports: joi
        .array()
        .items(
          joi.object({
            reportId: joi.string().required(),
            reason: joi.string().optional(),
          })
        )
        .required(),
    },
  }),
  asyncHandler(AdminController.rejectReports)
);

router.post(
  "/sendForgotPasswordEmail",
  adminLimit,
  authenticateRequest({
    noCache: true,
  }),
  checkIfUserIsAdmin(),
  validateRequest({
    body: {
      email: joi.string().email().required(),
    },
  }),
  asyncHandler(sendForgotPasswordEmail)
);

export default router;
