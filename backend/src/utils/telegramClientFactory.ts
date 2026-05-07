import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

export const createClient = async (sessionString: string) => {
  // ✅ Strict validation (NO empty / invalid values allowed)
  if (!sessionString || typeof sessionString !== "string") {
    throw new Error("Invalid Telegram session string");
  }

  const stringSession = new StringSession(sessionString);

  const client = new TelegramClient(
    stringSession,
    Number(process.env.TELEGRAM_API_ID),
    process.env.TELEGRAM_API_HASH!,
    {
      connectionRetries: 5,
    }
  );

  await client.connect();

  return client;
};