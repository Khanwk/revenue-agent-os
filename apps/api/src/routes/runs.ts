import { Router } from "express";
import { runStore } from "../core/run-store.js";
export const runsRouter=Router();
runsRouter.get("/",async(req,res,next)=>{try{res.json({runs:await runStore.list(req.user!.id,Number(req.query.limit)||30)});}catch(e){next(e);}});
runsRouter.get("/:id",async(req,res,next)=>{try{const run=await runStore.get(req.user!.id,req.params.id);if(!run){res.status(404).json({error:"Run not found"});return;}res.json({run});}catch(e){next(e);}});
