import { Game } from "../game";
import { BlackList } from "../../../lib/Blacklist";
import { PlugMessage } from "../../../lib/PlugAPI";

export class SubirGame extends Game {
  name = 'subir'
  descritpion = 'Se você tiver sorte, você irá para a primeira posição.'

  public readonly command = /^subir/i;
  private readonly blacklist = new BlackList<string>(5 * 60000)

  checkBlackList (username: string) {
    const time = this.blacklist.timeOf(username);

    if (time > 0) {
      const minutes = Math.ceil(time / 60000)
      this.bot.sendMessageTo(username, `Por favor aguarde ${minutes} minuto(s) para jogar novamente.`);
      return true
    }

    return false
  }

  handle(_, message: PlugMessage) {
    const username = message.un

    if (this.bot.checkDJ(username)) return;
    if(this.checkBlackList(username)) return;

    this.blacklist.add(username)

    if (Math.random() >= 0.5) {
      this.bot.sendMessageTo(username, `Subindo 🚀`)
      this.bot.moveDj(username, 1)
    } else {
      this.bot.sendMessageTo(username, `Que feio! Tentando furar a fila, volte para o fim da fila.`)
      this.bot.moveDj(username, this.bot.lastPosition)
    }
  }
}