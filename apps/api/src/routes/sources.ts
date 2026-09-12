import { Router } from "express";
import { getSourceStatuses } from "../sources/index.js";
export const sourcesRouter=Router();
sourcesRouter.get("/",async(req,res,next)=>{try{res.json({sources:await getSourceStatuses(req.user!.id)});}catch(e){next(e);}});
