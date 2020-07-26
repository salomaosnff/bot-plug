import '../../lib/PlugAPI'
import { BotModule } from "../../lib/Module";
import { Game } from './game';

export class GameModule extends BotModule {
  constructor (private readonly games: Game[]) {
    super()
  }

  onRegister () {
    for (const game of this.games) {
      game.bot = this.bot;
      this.bot.commands.add(game)
      game.onRegister()
    }
  }
}