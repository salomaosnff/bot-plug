import { Game } from "../game";
import { BlackList } from "../../../lib/Blacklist";
import { Bot } from "../../../lib/Bot";
import { PlugMessage } from "../../../lib/PlugAPI";

export class FrutasGame extends Game {
  name = 'Frutas'
  descritpion = 'Digite !frutas, se sairem 3 frutas iguais você ganha o primeiro lugar da fila.'
  command = /^frutas/i;

  private readonly frutas = ['🍍', '🍌', '🍒', '🍎', '🍉', '🍓', '🍐', '🍊', '🍇'];
  private readonly blacklist = new BlackList<string>(60000)
  
  checkBlackList (username: string) {
    const time = this.blacklist.timeOf(username);

    if (time > 0) {
      const minutes = Math.ceil(time / 60000)
      this.bot.sendMessageTo(username, `Por favor aguarde ${minutes} minuto(s) para jogar novamente.`);
      return true
    }

    return false
  }

  handle (arg:RegExpMatchArray, message: PlugMessage) {
    const username = message.un;

    if (this.checkBlackList(username)) {
      return;
    }

    const slots = new Array(3).fill(null).map(() => this.frutas[Math.floor(Math.random() * this.frutas.length)]);
    const set = new Set(slots);

    this.blacklist.add(username)

    if (set.size === 1) {
      this.bot.sendMessageTo(username, slots.join('') + ` Parabéns, você ganhou a primeira posição! :D`)
      if (!this.bot.moveDj(username, 1)) {
        this.bot.sendMessageTo(username, `Você não está na fila!`)
      }
    } else {
      this.bot.sendMessageTo(username, slots.join('') + ` Não foi dessa vez! :(`)
    }
  }
}