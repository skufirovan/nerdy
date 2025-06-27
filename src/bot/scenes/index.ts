import { Scenes } from "telegraf";
import chooseNicknameScene from "./chooseNickname";
import UserDto from "@domain/dtos/UserDto";

export interface SessionData extends Scenes.SceneSessionData {
  nickname?: string;
}

export interface MyContext extends Scenes.SceneContext<SessionData> {
  user?: UserDto;
}

export const stage = new Scenes.Stage<MyContext>([chooseNicknameScene]);
