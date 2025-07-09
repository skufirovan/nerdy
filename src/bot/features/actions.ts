import { Telegraf } from "telegraf";
import { MyContext } from "./scenes";
import { registerDeleteMessageAction } from "./deleteMessage/action";
import { showActivitiesAction } from "./showActivities/action";
import { recordDemoAction } from "./recordDemo/action";
import { paginateActions } from "./pagination/action";
import { showDemosAction } from "./showDemos/action";
import { deleteDemoAction } from "./deleteDemo/action";
import { showEquipmentAction } from "./showEquipment/action";
import { showTopAction } from "./showTop/action";

export const registerTelegramActions = (bot: Telegraf<MyContext>) => {
  registerDeleteMessageAction(bot);
  deleteDemoAction(bot);
  showActivitiesAction(bot);
  showTopAction(bot);
  showDemosAction(bot);
  showEquipmentAction(bot);
  recordDemoAction(bot);
  paginateActions(bot);
};
