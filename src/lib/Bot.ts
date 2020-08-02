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

  public readonly markedToDelete = new BlackList<number>(60000, (cid) => this.deleteMessage(cid));

  private btn_like: HTMLButtonElement;

  get lastPosition() {
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

  skip() {
    window.API.moderateForceSkip()
    return this
  }

  getDj() {
    return window.API.getDJ()
  }

  getUser(userId?: string) {
    return window.API.getUser(userId)
  }

  getUserByName(username: string) {
    return window.API.getUsers().find(u => u.username === username)
  }

  getMedia(): PlugMedia {
    return window.API.getMedia();
  }

  getWaitList() {
    return window.API.getWaitList()
  }

  getStaff() {
    return window.API.getStaff()
  }

  userIsInWaitList(username: string) {
    return this.getWaitList().some(u => u.username === username)
  }

  mute(username: string, duration: string = 's') {
    window.API.moderateMuteUser(this.getUserByName(username).id, 1, duration)
    return this;
  }

  unmute(username: string) {
    window.API.moderateUnmuteUser(this.getUserByName(username).id)
    return this;
  }

  moveDj(username: string, position: number) {
    const user = window.API.getWaitList().find(u => u.username === username)

    if (user) {
      window.API.moderateMoveDJ(user.id, position)
      return true
    }

    return false
  }

  random<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)]
  }

  getUsers() {
    return window.API.getUsers()
  }

  checkStaff(username: string) {
    const staffs = this.getStaff()

    if (staffs.some(s => s.username === username)) {
      return true
    }

    this.sendMessageTo(username, 'Você não tem permissão para isso.')
    return false
  }

  checkDJ(username: string) {
    const dj = this.getDj();

    if (dj.username === username) {
      this.sendMessageTo(username, 'Você não pode fazer isso pois você está tocando.');
      return true
    }

    return false
  }

  async init() {
    this.btn_like = document.querySelector('.btn-like') as HTMLButtonElement;

    await this.initDatabase();

    this.on(EVENTS.CHAT, (message: PlugMessage) => {
      const match = message.message.match(/^\!([\s\S]+)\b/)

      if (message.un === this.getUser().username || match) {
        this.markedToDelete.add(message.cid)
      }

      if (!match) return;

      this.commandListener(match[1], message)
    })

    for (const module of this.modules) {
      module.onInit()
    }

    this.sendMessage('Opa, tô na área!')
    this.like()

    return this
  }

  join() {
    window.API.djJoin()
    return this
  }

  sendMessage(message: string) {
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

  like() {
    this.btn_like.click();
    return this
  }
}