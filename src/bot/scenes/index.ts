import { Scenes } from "telegraf";
import chooseNicknameScene from "./chooseNickname";

export type SceneSession = Scenes.SceneSessionData & {};

export interface MyContext extends Scenes.SceneContext<SceneSession> {}

export const stage = new Scenes.Stage([chooseNicknameScene]);
