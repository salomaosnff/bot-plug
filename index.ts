import { launch, Page, Browser } from 'puppeteer-core'
import { resolve, join } from 'path'
import { readFileSync, writeFileSync } from 'fs';
import { url, browser as browserPath, headless } from './config.json'

let browser: Browser;

async function main () {
  browser = await launch({
    executablePath: browserPath,
    userDataDir: './.data',
    headless: headless,
    defaultViewport: null
  })

  process.on('exit', () => browser.close())
  
  restart()
}

async function restart () {
  const [tab, ...pages] = await browser.pages()

  for (const page of pages) {
    await page.close()
  }
  
  init(tab)
}

async function init (tab: Page) {
  console.log(`Abrindo ${url}`)
  
  await tab.goto(url)
  console.log('Aguardando carregamento...')
  
  await tab.waitForSelector('#audience-canvas', { timeout: 60000 }).catch(async (err) => {
    restart()
    throw err
  })
  await tab.waitFor(3000)

  console.log('Iniciando bot...')
  tab.on('console', consoleObj => console.log(consoleObj.text()));
  
  await tab.exposeFunction('dump', (data) => writeFileSync(join(__dirname, 'src/modules/chatbot/chat.json'), JSON.stringify(data)))
  await tab.addScriptTag({ content: readFileSync(resolve(__dirname, 'dist/index.js'), 'utf-8') })
}

main()