import express from "express";
import achievementControllers from "../controllers/achievementControllers.js";

const router = express.Router();

router.get("/", achievementControllers.getMyAchievements);

export default router;