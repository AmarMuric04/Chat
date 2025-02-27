import express from "express";
import * as MessageController from "../controllers/message.js";
import isAuth from "../middleware/is-auth.js";

const router = express.Router();

router.post("/add-reaction", isAuth, MessageController.addReaction);

router.get("/get-messages/:chatId", isAuth, MessageController.getMessages);

router.post("/send-message", isAuth, MessageController.sendMessage);

router.post("/send-voice-message", isAuth, MessageController.sendVoiceMessage);

router.delete("/delete-message", isAuth, MessageController.deleteMessage);

router.post("/edit-message", isAuth, MessageController.editMessage);

router.post("/add-seen/:messageId", isAuth, MessageController.addSeen);

router.post(
  "/get-searched-messages",
  isAuth,
  MessageController.getSearchedMessages
);

export default router;
