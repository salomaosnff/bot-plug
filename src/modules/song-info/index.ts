import { BotModule } from "../../lib/Module";
import { PlugUser, PlugMedia, EVENTS, PlugMessage } from "../../lib/PlugAPI";
import { getInfo, getLyrics } from "./api";

interface AdvancePayload {
  dj: PlugUser
  media: PlugMedia
}

interface SongOptions {
  maxDuration: number
}

export class SongInfoModule extends BotModule {
  private autoSkipTimer: NodeJS.Timeout;
  private options: SongOptions;

  constructor(options: Partial<SongOptions> = {}) {
    super()

    this.options = {
      maxDuration: 5 * 60,
      ...options
    }
  }

  onRegister() {
    this.bot
      .on(EVENTS.ADVANCE, this.logger.bind(this))
      .on(EVENTS.ADVANCE, this.antiGemidao.bind(this))
      .on(EVENTS.ADVANCE, this.limiteTempo.bind(this))
      .on(EVENTS.ADVANCE, this.autoWoot.bind(this))
      ;

    this.bot.commands.add({
      name: 'info',
      descritpion: 'Obtém informações da música atual',
      command: /^info/i,
      handle: this.info.bind(this)
    })

    this.bot.commands.add({
      name: 'letra',
      descritpion: 'Obtém a letra da música atual',
      command: /^letra/i,
      handle: this.letra.bind(this)
    })
  }

  autoWoot() {
    this.bot.like()
  }

  logger(stat: AdvancePayload) {
    this.bot.sendMessage(`Reproduzindo: ${stat.media.title} - ${stat.media.author}`);
  }

  antiGemidao(stat: AdvancePayload) {
    clearTimeout(this.autoSkipTimer)

    const title = `${stat.media.title} - ${stat.media.author}`

    if (title.match(/gemid[aã]?o/gmi)) {
      this.bot.sendMessageTo(stat.dj.username, 'Esse é o gemido que sua mãe faz quando eu pego ela.')
      return this.bot.skip()
    }
  }

  limiteTempo(stat: AdvancePayload) {
    clearTimeout(this.autoSkipTimer)
    if (stat.media.duration > this.options.maxDuration) {
      this.bot.sendMessageTo(stat.dj.username, `Meu chapa, esta música ultrapassa o tempo máximo de ${this.options.maxDuration / 60} minutos, após esse tempo eu vou ter que pular. Beleza?`)
      this.autoSkipTimer = setTimeout(() => this.bot.skip(), this.options.maxDuration * 1000)
    }
  }

  async info(_, { un: username }: PlugMessage) {
    const info = await getInfo(this.bot.getMedia())

    if (!info) {
      return this.bot.sendMessageTo(username, `Não achei nada sobre essa música :(`);
    }

    this.bot.sendMessageTo(username, `Título: ${info.title}; Artista: ${info.artist}; Album: ${info.album}; Gênero: ${info.gender}`)
  }

  async letra(_, { un: username }: PlugMessage) {
    const letra = await getLyrics(this.bot.getMedia())

    if (!letra) {
      return this.bot.sendMessageTo(username, `Não achei a letra desta música :(`);
    }

    this.bot.sendMessageTo(username, letra)
  }
}