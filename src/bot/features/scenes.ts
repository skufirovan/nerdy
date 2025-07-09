import { Scenes } from "telegraf";
import chooseNicknameScene from "./chooseNickname/scene";
import recordDemoScene from "./recordDemo/scene";
import recordVideoScene from "./recordVideo/scene";
import { PaginationData } from "./pagination/action";
import { UserDto, DemoDto } from "@domain/dtos";
import { RawUser } from "@domain/types";

export interface SessionData extends Scenes.SceneSessionData {
  nickname?: string;
  demo?: { name?: string; text?: string };
  video?: { description?: string; demo?: DemoDto };
  pagination?: PaginationData<unknown>;
}

export interface MyContext extends Scenes.SceneContext<SessionData> {
  user?: RawUser | UserDto;
}

export const stage = new Scenes.Stage<MyContext>([
  chooseNicknameScene,
  recordDemoScene,
  recordVideoScene,
]);
