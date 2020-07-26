import './PlugAPI'
import { BotModule, CommandListener, BotModuleConstructor } from './Module';
import { EVENTS, PlugMessage, PlugMedia } from './PlugAPI';
import { BotDatabase } from './Database';
import { BotCommand } from './Command';
import { BlackList } from './Blacklist';

export class Bot {
  public readonly db = new BotDatabase()
  public readonly commands = new Set<BotCommand>();
  public readonly modules = new Set<BotModule>();

  private markedToDelete = new BlackList<number>();

  private btn_like: HTMLButtonElement;

  get lastPosition () {
    return window.API.getWaitList().length;
  }

  add(module: BotModule | BotModuleConstructor) {
    if (typeof module === 'function') {
      module = new module()
    }

    module.bot = this
    
    this.modules.add(module);

    module.onRegister()
    
    return this
  }

  private commandListener(cmd: string, message: PlugMessage = null) {
    
    for (const command of this.commands) {
      const match = cmd.match(command.command)

      if (match) {
        command.handle(match, message)
        return true
      }
    }

    return this.sendMessageTo(message.un, 'Não conheço este comando...')
  }
  
  async initDatabase() {
    this.db.transaction(async (runner) => {
      console.log('TRANSACAO', runner)
      // await runner.query(`
      //   CREATE TABLE IF NOT EXISTS medias (
      //     id INTEGER PRIMARY KEY,
      //     title TEXT NOT NULL,
      //     author TEXT NOT NULL,
      //     last_play DATETIME DEFAULT CURRENT_TIMESTAMP,
      //     last_play_user TEXT
      //   );
      // `)
    })
  }

  skip () {
    window.API.moderateForceSkip()
    return this
  }

  getDj() {
    return window.API.getDJ()
  }

  getUser(username?: string) {
    return window.API.getUser(username)
  }

  getMedia (): PlugMedia {
    return window.API.getMedia();
  }

  getWaitList () {
    return window.API.getWaitList()
  }

  userIsInWaitList(username: string) {
    return this.getWaitList().some(u => u.username === username)
  }

  moveDj(username: string, position: number) {
    const user = window.API.getWaitList().find(u => u.username === username)
    
    if (user) {
      window.API.moderateMoveDJ(user.id, position)
      return true
    }
    
    return false
  }

  async init() {
    this.btn_like = document.querySelector('.btn-like') as HTMLButtonElement;

    await this.initDatabase();

    this.on(EVENTS.CHAT, (message: PlugMessage) => {
      const match = message.message.match(/^\!([\s\S]+)\b/)

      if (message.un === this.getUser().username) {
        this.markedToDelete
          .add(message.cid, 30000, () => this.deleteMessage(message.cid))
      }
      
      if (!match) {
        if (message.message.includes(window.API.getUser().username)) {
          return this.sendMessageTo(message.un, 'Homi, num fale comigo não... Eu sou um bot! >:(');
        }
        return
      }
      
      this.commandListener(match[1], message)
    })
    
    for (const module of this.modules) {
      module.onInit()
    }

    this.sendMessage('Opa, tô na área!')
    this.like()

    return this
  }

  join () {
    window.API.djJoin()
    return this
  }

  sendMessage (message: string) {
    window.API.sendChat(message)
    return this;
  }

  deleteMessage(cid: number) {
    window.API.moderateDeleteChat(cid)
    return this;
  }

  sendMessageTo(username: string, message: string) {
    return this.sendMessage(`@${username} ${message}`)
  }

  on(event: EVENTS, listener: Function) {
    window.API.on(event, listener)
    return this
  }

  like () {
    this.btn_like.click();
    return this
  }
}