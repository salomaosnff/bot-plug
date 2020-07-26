import { BotModule } from "../../lib/Module";
import { ROLE } from "../../lib/PlugAPI";

export class StaffModule extends BotModule {
  onRegister () {
    this.bot.commands.add({
      name: ['pular', 'skip'],
      descritpion: 'Pula o Dj atual',
      command: /^(?:pular|skip)/,
      handle: (_, message) => this.skip(message.un)
    })

    this.bot.commands.add({
      name: ['mutar', 'mute'],
      descritpion: 'Muta alguém aceita s, m, l como argumentos.',
      command: /^(?:mutar|mute)\s+@?(.+)(?:\s+([sml]))?(?:\s+(.+))?/,
      handle: ([_, username, tempo, motivo], msg) => this.mute(msg.un, username, tempo, motivo)
    })
  }

  skip (username:string) {    
    if (!this.bot.checkStaff(username)) {
      return;
    }
    this.bot.skip()
  }

  mute (username: string, user: string, tempo: string = 's', motivo: string  = 'Não informado') {
    if (!this.bot.checkStaff(username)) return;
    this.bot.mute(user, tempo)
    this.bot.sendMessage(`@${user} foi mutado(a). Motivo: ${motivo}`)
  }
}