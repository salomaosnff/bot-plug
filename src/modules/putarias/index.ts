import { BotModule } from "../../lib/Module";

export class PutariasModule extends BotModule {
  onRegister () {
    this.bot.commands.add({
      name: 'dedada',
      descritpion: 'Dá uma dedada em alguém',
      command: /^(?:dedada)\s+(.*)/i,
      handle: ([_, pessoa], message) => this.dedada(pessoa, message.un)
    })
    this.bot.commands.add({
      name: ['responda', 'responde'],
      descritpion: 'Responde uma pergunta com sim ou não.',
      command: /^(?:respond[ea])\s+(.*)/i,
      handle: ([_, pergunta], message) => this.responda(pergunta, message.un)
    })

    this.bot.commands.add({
      name: ['massa', 'top', 'legal'],
      descritpion: 'Elogia a música atual',
      command: /^(?:massa|top|legal)/,
      handle: (_, message) => this.elogiar()
    })

    this.bot.commands.add({
      name: ['lixo', 'porcaria', 'poiqueira'],
      descritpion: 'Elogia a música atual',
      command: /^(?:lixo|porcaria|poiquera)/,
      handle: (_, message) => this.depreciar()
    })
  }

  dedada (pessoa:string, username: string) {
    if (pessoa.trim() === this.bot.getUser().username) {
      return this.bot.sendMessageTo(username, 'Vai dedar o cu do cãokkkkkkkkkkkkkkk')
    }
    this.bot.sendMessage(`${username} deu uma dedada em ${pessoa} taporrakkkkkkkkkkkkkkkkkkkkk`)
  }

  responda (pergunta: string, username: string) {
    if (pergunta.match(/guei|gay/i)) return this.bot.sendMessageTo(username, 'Eu não tenho nada a ver com o toba dos outros.')
    const resposta = Math.random() >= 0.5 ? 'Sim' : 'Não';
    this.bot.sendMessageTo(username, resposta);
  }

  elogiar () {
    const { username } = this.bot.getDj()
    this.bot.sendMessageTo(username, `Essa aí é melhor que uma coquinha gelada.`)
  }

  depreciar () {
    const { username } = this.bot.getDj()
    this.bot.sendMessageTo(username, `Homi, tire essa poiquera...`)
  }
}