import { launch, Page, Browser } from 'puppeteer-core'
import { resolve } from 'path'
import { readFileSync } from 'fs';

let browser: Browser;

async function main () {
  browser = await launch({
    executablePath: '/usr/bin/brave',
    userDataDir: './.data',
    args: ['--disable-features=InfiniteSessionRestore'],
    defaultViewport: {
      isMobile: false,
      width: 1280,
      height: 600
    }
  })

  process.on('exit', () => browser.close())

  const pages = await browser.pages()
  const tab = pages[0]

  pages.slice(1).forEach(t => t.close())
  
  init(tab)
}

async function restart (tab: Page) {
  console.debug('Reiniciando...')
  tab.close()
  init(await browser.newPage())
  const pages = await browser.pages()
  pages.slice(1).forEach(t => t.close())
}

async function init (tab: Page) {
  console.log('Abrindo plug.dj/indiesponível')
  
  await tab.goto('https://plug.dj/indiesponível')
  console.log('Aguardando carregamento...')
  
  await tab.waitForSelector('#audience-canvas', { timeout: 60000 }).catch(async (err) => {
    restart(tab)
    throw err
  })
  await tab.waitFor(3000)

  console.log('Iniciando bot...')
  tab.on('console', consoleObj => console.log(consoleObj.text()));
  await tab.addScriptTag({ content: readFileSync(resolve(__dirname, 'dist/index.js'), 'utf-8') })

  await tab.evaluate('bot.init()')
}

main()