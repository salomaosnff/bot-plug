import { Game } from "../game";

interface RoletaOptions {
  time: number
  interval: number
}

export class RoletaGame extends Game {
  name = ['roleta', 'roulette']
  descritpion = 'Quando a roleta iniciar, digite !entrar para entrar na roleta, se você for sorteado você ganha o primeiro lugar na fila.'
  command = /^(?:roleta|roulette)/i;
  
  public started = false;
  private users = new Set<string>();
  private timer: NodeJS.Timeout;
  private interval: NodeJS.Timeout;
  private readonly options: RoletaOptions;

  constructor (options: Partial<RoletaOptions> = {}) {
    super()

    this.options = Object.assign({
      time: 1,
      interval: 10
    }, options)


    this.options.time *= 60000;
    this.options.interval *= 60000;

    this.interval = setInterval(() => this.start(), this.options.interval)
  }

  onRegister () {
    this.bot.commands.add({
      name: 'entrar',
      descritpion: 'Entra na roleta caso ela esteja iniciada.',
      command: /^entrar/i,
      handle: (_, message) => this.join(message.un)
    })

    this.bot.commands.add({
      name: 'sair',
      descritpion: 'Sai da roleta caso ela esteja iniciada.',
      command: /^sair/i,
      handle: (_, message) => this.leave(message.un)
    })
  }

  handle (_, m) {
    if (!this.bot.checkStaff(m.un)) return;
    if (this.bot.getWaitList().length < 2) return;
    this.start()
  }

  start () {
    this.started = true;
    this.bot.sendMessage('@djs A roleta foi iniciada, digite !entrar para entrar e concorrer ao primeiro lugar na fila.')

    clearTimeout(this.timer)
    clearInterval(this.interval)

    this.timer = setTimeout(() => this.run(), this.options.time);
    this.interval = setInterval(() => this.start(), this.options.interval)

    return this;
  }

  stop () {
    clearTimeout(this.timer)
    this.bot.sendMessage('A roleta foi interrompida.')
    return this
  }

  join(username: string) {
    if (!this.started) return this.bot.sendMessageTo(username, `A roleta não está iniciada.`)
    if (!this.bot.userIsInWaitList(username)) return this.bot.sendMessageTo(username, `Para entrar na roleta você deve antes entrar na fila.`)
    
    this.users.add(username);
    this.bot.sendMessageTo(username, 'entrou na roleta!')
    
    return this
  }

  leave(username: string) {
    if (!this.started) return this.bot.sendMessageTo(username, `A roleta não está iniciada.`)
    this.users.delete(username)
    this.bot.sendMessageTo(username, 'saiu da roleta!')
    return this
  }

  run() {
    this.started = false
    if (!this.users.size) return this.bot.sendMessage(`Ninguém ganhou a roleta pois não houve participantes.`)
    
    const users = [...this.users];
    const user = this.bot.random(users)
    
    this.bot.sendMessage(`@${user} ganhou a roleta, e será movido para a primeira posição. :D`)
    this.bot.moveDj(user, 1)
    
    this.users.clear()

    return this
  }
}