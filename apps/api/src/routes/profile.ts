import { Router } from "express";
import { getCompanyProfile, saveCompanyProfile } from "../profile/profile-store.js";
export const profileRouter=Router();
profileRouter.get("/",async(req,res,next)=>{try{res.json({profile:await getCompanyProfile(req.user!.id)});}catch(e){next(e);}});
profileRouter.put("/",async(req,res,next)=>{try{res.json({profile:await saveCompanyProfile(req.user!.id,req.body)});}catch(e){next(e);}});
