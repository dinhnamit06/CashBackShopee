export const DEMO_TELEGRAM_BOT_URL =
  "https://t.me/hoantienvn_shopee_bot_demo";
export const DEMO_ZALO_GROUP_URL = "https://zalo.me/g/hoantienvn_demo";

export type BotLinkCommands = {
  telegram: string;
  zalo: string;
};

export function isValidBotLinkCode(value: string): boolean {
  return /^\d{6}$/.test(value);
}

export function buildBotLinkCommands(
  linkCode: string
): BotLinkCommands | null {
  if (!isValidBotLinkCode(linkCode)) return null;

  return {
    telegram: `/lienket ${linkCode}`,
    zalo: `lienket ${linkCode}`,
  };
}
