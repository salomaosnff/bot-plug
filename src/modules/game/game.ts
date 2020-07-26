import { Bot } from "../../lib/Bot";
import { BotCommand } from "../../lib/Command";
import { PlugMessage } from "../../lib/PlugAPI";

export abstract class Game implements BotCommand {
  public abstract name: string | string[];
  public abstract command: RegExp;
  public abstract descritpion: string;
  public bot: Bot;

  abstract handle (args: RegExpMatchArray, message: PlugMessage): void

  onRegister () {}
}