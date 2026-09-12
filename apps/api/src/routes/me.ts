import { Router } from "express";
import { getUsage } from "../usage/usage.js";
export const meRouter=Router();
meRouter.get("/",async(req,res,next)=>{try{res.json({user:{id:req.user!.id,email:req.user!.email},usage:await getUsage(req.user!.id)});}catch(e){next(e);}});
