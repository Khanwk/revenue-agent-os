import { Router } from "express";
import {
  getCompanyProfile,
  saveCompanyProfile,
} from "../profile/profile-store.js";
export const profileRouter = Router();
profileRouter.get("/", async (_req, res, next) => {
  try {
    res.json({ profile: await getCompanyProfile() });
  } catch (e) {
    next(e);
  }
});
profileRouter.put("/", async (req, res) => {
  try {
    res.json({ profile: await saveCompanyProfile(req.body) });
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid company profile",
    });
  }
});
