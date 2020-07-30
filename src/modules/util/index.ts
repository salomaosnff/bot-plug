import { BotModule } from "../../lib/Module";
import { EVENTS, PlugUser } from "../../lib/PlugAPI";

export class UtilModule extends BotModule {
  onRegister () {
    this.bot.on(EVENTS.USER_JOIN, (user: PlugUser) => this.boasVindas(user))
    
    this.bot.commands.add({
      name: 'dj',
      descritpion: 'Exibe informações do DJ atual',
      command: /^dj\b/,
      handle: (args, message) => this.verDj(message.un)
    })

    this.bot.commands.add({
      name: 'ping',
      descritpion: 'Pong!',
      command: /^ping\b/,
      handle: (args, message) => this.ping(message.un)
    })

    this.bot.commands.add({
      name: 'comandos',
      descritpion: 'Lista todos os comandos',
      command: /^comandos\b/i,
      handle: (args, message) => this.comandos(message.un)
    })

    this.bot.commands.add({
      name: 'ajuda',
      descritpion: 'Exibe a ajuda de um comando',
      command: /^ajuda\s(.*)/i,
      handle: ([_, comando], message) => this.ajuda(comando, message.un)
    })

    this.bot.commands.add({
      name: 'key',
      descritpion: 'Te dá uma chave do youtube',
      command: /^key\b/i,
      handle: (_, message) => this.key(message.un)
    })
  }


  private boasVindas(user: PlugUser) {
    this.bot.sendMessage(`Seja bem vindo!, ${user.username}!`)
  }

  private verDj(username: string) {
    const dj = this.bot.getDj()
    if (!dj) this.bot.sendMessageTo(username, `Não ninguém tocando :(`)
    this.bot.sendMessageTo(username, `Nome: ${dj.username}; Nível: ${dj.level}; Idioma: ${dj.language}`)
  }

  private ping(username: string) {
    this.bot.sendMessageTo(username, 'Pong!')
  }

  private comandos (username:string) {
    const commands = [...this.bot.commands].map(c =>Array.isArray(c.name) ? c.name[0] : c.name).join(', ')
    this.bot.sendMessageTo(username, commands)
    setTimeout(() => {
      this.bot.sendMessageTo(username, `Dica: Digite !ajuda <comando> para obter ajuda para um comando específico.`)
    }, 3000)
  }

  private ajuda (comando:string, username:string) {
    comando = comando.toLowerCase()
    const result = [...this.bot.commands].find(c => {
      if (typeof c.name === 'string') {
        return c.name.toLowerCase() === comando
      }

      return c.name.some(cmd => cmd.toLowerCase() === comando)
    })

    if (result) {
      return this.bot.sendMessageTo(username, result.descritpion)
    }

    this.bot.sendMessageTo(username, `Não encontrei ajuda para o comando "${comando}"`)
  }

  key (username: string) {
    this.bot.sendMessageTo(username, `Digite isso na barra de URL de seu navegador: javascript:gapi.client.setApiKey("AIzaSyCD22z2RuS540hYYnjYOB8pkd_Am9cpCZQ")`)
  }
}