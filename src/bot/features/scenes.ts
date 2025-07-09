import { Scenes } from "telegraf";
import chooseNicknameScene from "./chooseNickname/scene";
import recordDemoScene from "./recordDemo/scene";
import { PaginationData } from "./pagination/action";
import { UserDto } from "@domain/dtos";
import { RawUser } from "@domain/types";

export interface SessionData extends Scenes.SceneSessionData {
  nickname?: string;
  demo?: { name?: string; text?: string };
  pagination?: PaginationData<unknown>;
}

export interface MyContext extends Scenes.SceneContext<SessionData> {
  user?: RawUser | UserDto;
}

export const stage = new Scenes.Stage<MyContext>([
  chooseNicknameScene,
  recordDemoScene,
]);
