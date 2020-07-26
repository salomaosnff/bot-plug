import { PlugMessage } from "./PlugAPI";
import { Bot } from "./Bot";

export type CommandListener = (arg: string, username:string, message: PlugMessage) => void

export interface BotModuleConstructor {
  new(...args:any[]): BotModule
}

export abstract class BotModule {
  public bot: Bot

  onRegister() {}

  onInit() {}
}