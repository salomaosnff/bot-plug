import { PlugMessage } from "./PlugAPI";

export interface BotCommand {
  name: string | string[]
  command: RegExp
  descritpion: string
  handle (args: RegExpMatchArray, message: PlugMessage): void
}