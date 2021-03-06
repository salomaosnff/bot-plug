import { Game } from "../game";
import { BlackList } from "../../../lib/Blacklist";
import { PlugMessage } from "../../../lib/PlugAPI";

export class DadoGame extends Game {
  name = ['dado', 'dice']
  descritpion = 'Digite !dado <numero> se você acertar o número sorteado você ganha o primeiro lugar da fila.'

  public readonly command = /^(?:dados?|dice)\s*(.*)?/i;
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

  handle([_, num], message: PlugMessage) {
    const username = message.un

    if (this.bot.checkDJ(username)) return;
    if(this.checkBlackList(username)) return;

    const numero = Number(num);
    
    if (Number.isNaN(numero) || numero < 1 || numero > 6) {
      return this.bot.sendMessageTo(username, 'Você deve escolher um número de 1 à 6.')
    }

    const result = Math.ceil(Math.random() * 6);

    this.blacklist.add(username)

    if (result === numero) {
      this.bot.sendMessageTo(username, `[ ${result} ] Parabéns :D! Você acertou o número e será movido(a) para a 1 primeira posição da fila.`)
    } else {
      this.bot.sendMessageTo(username, `[ ${result} ] Não foi dessa vez! :(`)
    }
  }
}