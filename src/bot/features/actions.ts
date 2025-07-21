import { Telegraf } from "telegraf";
import { MyContext } from "./scenes";
import {
  battleActions,
  changeSquadMemberRoleAction,
  createSquadAction,
  deleteDemoAction,
  deleteSquadAction,
  inviteMemberActions,
  deleteMessageAction,
  kickMemberAction,
  leaveSquadAction,
  paginateActions,
  recordDemoAction,
  recordVideoAction,
  showActivitiesAction,
  showDemosAction,
  showEquipmentAction,
  showReferralAction,
  showSquadAction,
  showTopAction,
  showShopAction,
  equipmentShopAction,
  buyEquipmentAction,
  equipEquipmentAction,
  showDonationAction,
} from ".";

export const registerTelegramActions = (bot: Telegraf<MyContext>) => {
  deleteMessageAction(bot);
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
  showShopAction(bot);
  equipmentShopAction(bot);
  buyEquipmentAction(bot);
  equipEquipmentAction(bot);
  showDonationAction(bot);
};
