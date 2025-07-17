import { Scenes } from "telegraf";
import {
  PaginationData,
  createSquadScene,
  inviteMemberScene,
  kickMemberScene,
  chooseNicknameScene,
  recordDemoScene,
  recordVideoScene,
  battleScene,
  comboScene,
  changeSquadMemberRoleScene,
} from ".";
import { UserDto, DemoDto } from "@domain/dtos";
import { RawUser } from "@domain/types";
import { SquadData } from "./squad/types";

export interface SessionData extends Scenes.SceneSessionData {
  nickname?: string;
  demo?: { name?: string; text?: string };
  video?: { description?: string; demo?: DemoDto };
  pagination?: PaginationData<unknown>;
  battleId?: string;
  squadData?: SquadData;
}

export interface MyContext extends Scenes.SceneContext<SessionData> {
  user?: RawUser | UserDto;
}

export const stage = new Scenes.Stage<MyContext>([
  chooseNicknameScene,
  recordDemoScene,
  recordVideoScene,
  battleScene,
  comboScene,
  createSquadScene,
  inviteMemberScene,
  kickMemberScene,
  changeSquadMemberRoleScene,
]);
