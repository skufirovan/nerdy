import { Telegraf } from "telegraf";
import { MyContext } from "./scenes";
import {
  battleActions,
  changeSquadMemberRoleAction,
  createSquadAction,
  deleteDemoAction,
  deleteSquadAction,
  inviteMemberActions,
  kickMemberAction,
  leaveSquadAction,
  paginateActions,
  recordDemoAction,
  recordVideoAction,
  registerDeleteMessageAction,
  showActivitiesAction,
  showDemosAction,
  showEquipmentAction,
  showReferralAction,
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
  leaveSquadAction(bot);
  deleteSquadAction(bot);
  kickMemberAction(bot);
  changeSquadMemberRoleAction(bot);
  showReferralAction(bot);
};
