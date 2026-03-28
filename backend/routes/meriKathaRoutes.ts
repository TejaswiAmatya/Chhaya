import express from "express";
import {
  getStories,
  setStories,
  suneinStory,
} from "../controllers/meriKathaControllers";

const meriKathaRouter = express.Router();

meriKathaRouter.get("/stories", getStories);
meriKathaRouter.post("/stories", setStories);
meriKathaRouter.post("/stories/:id/sunein", suneinStory);

export default meriKathaRouter;
