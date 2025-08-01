import { Scenes } from "telegraf";
import {
  PaginationData,
  createSquadScene,
  inviteMemberScene,
  kickMemberScene,
  userInitScene,
  recordDemoScene,
  recordVideoScene,
  battleScene,
  comboScene,
  changeSquadMemberRoleScene,
  minesweeperGameScene,
} from ".";
import { DemoDto } from "@domain/dtos";
import { RawUser } from "@domain/types";
import { SquadData } from "./squad/types";

export interface SessionData extends Scenes.SceneSessionData {
  referral?: bigint | null;
  demo?: { name?: string; text?: string; fileId?: string };
  video?: { description?: string; demo?: DemoDto };
  createSquad?: { name?: string };
  pagination?: PaginationData<unknown>;
  battleId?: string;
  squadData?: SquadData;
}

export interface MyContext extends Scenes.SceneContext<SessionData> {
  startPayload?: string;
  user?: RawUser;
}

export const stage = new Scenes.Stage<MyContext>([
  userInitScene,
  recordDemoScene,
  recordVideoScene,
  battleScene,
  comboScene,
  createSquadScene,
  inviteMemberScene,
  kickMemberScene,
  changeSquadMemberRoleScene,
  minesweeperGameScene,
]);
