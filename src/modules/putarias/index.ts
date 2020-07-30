import { BotModule } from "../../lib/Module";
import { PlugMessage } from "../../lib/PlugAPI";
import {frases as ednaldo } from './ednaldo.json'
import { lixo, massa } from './frases.json'
import * as respostas from './respostas.json'

export class PutariasModule extends BotModule {
  onRegister () {
    this.bot.commands.add({
      name: 'dedada',
      descritpion: 'Dá uma dedada em alguém',
      command: /^dedada\s+(.+)/i,
      handle: ([_, pessoa], message) => this.dedada(pessoa, message.un)
    })

    this.bot.commands.add({
      name: ['responda', 'responde'],
      descritpion: 'Responde uma pergunta com sim ou não.',
      command: /^(?:respond[ea])\s+(.+)/i,
      handle: (_, message) => this.responda(message.un)
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

    this.bot.commands.add({
      name: ['ednaldo', 'ednaldo pereira'],
      descritpion: 'Elogia a música atual',
      command: /^ednaldo(?:\s+pereira)?/i,
      handle: (_, message) => this.ednaldo(message)
    })

    this.bot.commands.add({
      name: 'escolha',
      descritpion: 'Escolhe um item entre uma lista de coisas',
      command: /^escolha\s+(.*)/i,
      handle: ([_, lista], message) => this.escolha(lista, message.un)
    })

    this.bot.commands.add({
      name: ['alguem', 'escolhaAlguem'],
      descritpion: 'Escolhe uma pessoa da sala e menciona.',
      command: /^(?:escolha)?alguem/i,
      handle: (_, message) => this.escolhaAlguem(message.un)
    })
  }

  dedada (pessoa:string, username: string) {
    if (pessoa.trim() === this.bot.getUser().username) {
      return this.bot.sendMessageTo(username, 'Vai dedar o cu do cãokkkkkkkkkkkkkkk')
    }
    this.bot.sendMessage(`${username} deu uma dedada em ${pessoa} taporrakkkkkkkkkkkkkkkkkkkkk`)
  }

  responda (username: string) {
    const r = this.bot.random(['0', '1', '2']);
    const resposta = this.bot.random(respostas[r]) as string

    this.bot.sendMessageTo(username, resposta);
  }

  escolhaAlguem (username: string) {
    const botId = this.bot.getUser().id
    const users = this.bot.getUsers().filter(u => u.id !== botId);
    const user = this.bot.random(users);
    this.bot.sendMessageTo(username, `Eu escolho @${user.username}`)
  }

  elogiar () {
    const { username } = this.bot.getDj()
    this.bot.sendMessageTo(username, this.bot.random(massa))
  }

  depreciar () {
    const { username } = this.bot.getDj()
    this.bot.sendMessageTo(username, this.bot.random(lixo))
  }

  ednaldo (message: PlugMessage) {
    const frase = this.bot.random(ednaldo)
    this.bot.deleteMessage(message.cid)
    this.bot.sendMessage(frase)
  }

  escolha (lista: string, username:string) {
    const items = lista.split(/\s+ou\s+|,\s+/)
    const item = this.bot.random(items)

    this.bot.sendMessageTo(username, item)
  }
}