import { launch, Page, Browser } from 'puppeteer-core'
import { resolve } from 'path'
import { readFileSync } from 'fs';
import { url, browser as browserPath } from './config.json'

let browser: Browser;

async function main () {
  browser = await launch({
    executablePath: browserPath,
    userDataDir: './.data',
    args: ['--disable-features=InfiniteSessionRestore'],
    headless: true,
    defaultViewport: {
      isMobile: false,
      width: 1280,
      height: 600
    }
  })

  process.on('exit', () => browser.close())

  const [tab] = await browser.pages()
  
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
  console.log(`Abrindo ${url}`)
  
  await tab.goto(url)
  console.log('Aguardando carregamento...')
  
  await tab.waitForSelector('#audience-canvas', { timeout: 60000 }).catch(async (err) => {
    restart(tab)
    throw err
  })
  await tab.waitFor(3000)

  console.log('Iniciando bot...')
  tab.on('console', consoleObj => console.log(consoleObj.text()));
  await tab.addScriptTag({ content: readFileSync(resolve(__dirname, 'dist/index.js'), 'utf-8') })
}

main()