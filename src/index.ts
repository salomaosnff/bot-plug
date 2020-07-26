import '@babel/polyfill'
import { Bot } from "./lib/Bot";
import { GameModule } from "./modules/game/index";
import { PutariasModule } from './modules/putarias/index';
import { UtilModule } from './modules/util/index';
import { SongInfoModule } from './modules/song-info/index';
import { FrutasGame } from './modules/game/games/frutas';
import { DadoGame } from './modules/game/games/dado';
import { RoletaGame } from './modules/game/games/roleta';

const bot = new Bot()
  .add(UtilModule)
  .add(PutariasModule)
  .add(new SongInfoModule())
  .add(
    new GameModule([
      new FrutasGame(),
      new DadoGame(),
      new RoletaGame()
    ])
  )

// @ts-ignore
window.bot = bot;