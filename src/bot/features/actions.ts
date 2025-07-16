import { Telegraf } from "telegraf";
import { MyContext } from "./scenes";
import {
  battleActions,
  createSquadAction,
  deleteDemoAction,
  inviteMemberActions,
  paginateActions,
  recordDemoAction,
  recordVideoAction,
  registerDeleteMessageAction,
  showActivitiesAction,
  showDemosAction,
  showEquipmentAction,
  showSquadAction,
  showTopAction,
} from ".";

export const registerTelegramActions = (bot: Telegraf<MyContext>) => {
  registerDeleteMessageAction(bot);
  deleteDemoAction(bot);
  showActivitiesAction(bot);
  showTopAction(bot);
  showDemosAction(bot);
  showEquipmentAction(bot);
  recordDemoAction(bot);
  recordVideoAction(bot);
  paginateActions(bot);
  battleActions(bot);
  showSquadAction(bot);
  createSquadAction(bot);
  inviteMemberActions(bot);
};
