import express from "express";
import {
  sendTelegramMessage,
  sendBulkTelegramMessages,
  getAllUsers,
  saveTelegramUser,
  updateParticipant,
  deleteParticipant,
  sendMessageToRAClients,
} from "../controllers/telegram.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { getClientsByRA } from "../controllers/telegram.controller";
const router = express.Router();

/**
 * Send message to one user
 */
//router.post("/send", sendTelegramMessage);

/**
 * Send bulk messages
 */
//router.post("/send-bulk", sendBulkTelegramMessages);

router.get('/participants', getAllUsers);

router.post('/save-user', saveTelegramUser);

router.put("/participant/:telegram_user_id", updateParticipant);
router.delete("/participant/:telegram_user_id", deleteParticipant);
router.post("/send-ra-message", authenticate, sendMessageToRAClients);

router.get("/ra/:id", authenticate, getClientsByRA);
export default router;


