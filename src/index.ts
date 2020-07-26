import '@babel/polyfill'
import { Bot } from "./lib/Bot";
import { GameModule } from "./modules/game/index";
import { PutariasModule } from './modules/putarias/index';
import { UtilModule } from './modules/util/index';
import { SongInfoModule } from './modules/song-info/index';
import { FrutasGame } from './modules/game/games/frutas';
import { DadoGame } from './modules/game/games/dado';
import { RoletaGame } from './modules/game/games/roleta';
import { StaffModule } from './modules/staff';
import { SubirGame } from './modules/game/games/subir';

const bot = new Bot()
  .add(UtilModule)
  .add(PutariasModule)
  .add(StaffModule)
  .add(new SongInfoModule())
  .add(
    new GameModule([
      new FrutasGame(),
      new DadoGame(),
      new RoletaGame(),
      new SubirGame()
    ])
  )

// @ts-ignore
window.bot = bot;