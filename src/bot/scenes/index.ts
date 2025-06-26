import { Scenes } from "telegraf";
import chooseNicknameScene from "./chooseNickname";
import UserDto from "@domain/dtos/UserDto";

export type SceneSession = Scenes.SceneSessionData & {};

export interface MyContext extends Scenes.SceneContext<SceneSession> {
  user: UserDto;
}

export const stage = new Scenes.Stage([chooseNicknameScene]);
