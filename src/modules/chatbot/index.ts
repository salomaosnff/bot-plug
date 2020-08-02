import { BotModule } from "../../lib/Module";
import { EVENTS, PlugMessage } from "../../lib/PlugAPI";

interface ChatBrain {
  input: {
    [tag:string]: string[]
  }
  output: {
    [tag:string]: string[]
  }
}

export class ChatBot extends BotModule {
  private readonly brain:ChatBrain = require('./chat.json');

  onRegister () {
    this.bot.commands.add({
      name: 'chatbot @<tag> <...inputs>;<...?outputs>',
      command: /^chatbot\s+#(\w+)\s+(?:(.*?)\s*)(?:;\s*(.+))?$/,
      descritpion: 'Adiciona uma mensagem ao bot',
      handle: ([_, tag, input, output], msg) => this.train(tag, input, output, msg.un)
    })

    this.bot.commands.add({
      name: 'chatbot dump',
      command: /^chatbot\s+dump/,
      descritpion: 'Backup da memória',
      handle: (_, msg) => this.dump(msg.un)
    })

    this.bot.on(EVENTS.CHAT, this.reply.bind(this))
  }

  train (tag:string, input:string, output:string, user: string) {
    tag = tag.trim().toLowerCase()

    const inputs = input.toLowerCase().trim().split(/\s*\|\s*/)
    const outputs = output.split(/\s*\|\s*/).map(o => o.trim())

    const tagInput = (this.brain.input[tag] ?? []).concat(inputs)
    const tagOutput = (this.brain.output[tag] ?? []).concat(outputs)
    
    this.brain.input[tag] = [...new Set(tagInput)];
    this.brain.output[tag] = [...new Set(tagOutput)];

    this.bot.sendMessageTo(user, `Ok, da proxima vez irei lembrar disso.`);
  }

  reply(message: PlugMessage) {
    const bot = this.bot.getUser();
    
    if (!message.message.startsWith(`@${bot.username} `)) return;

    const input = message.message.substring(bot.username.length + 2).trim().toLowerCase();
    
    for (const tag in this.brain.input) {
      const inputs = this.brain.input[tag];

      if (inputs.some(m => m === input)) {
        const outputs = this.brain.output[tag] || [];
        
        if (!outputs.length) break;

        return this.bot.sendMessageTo(message.un, this.bot.random(outputs));
      }
    }

    this.bot.markedToDelete.add(message.cid)

    this.bot.sendMessageTo(message.un, 'Não sei te responder isso...')
  }

  dump(user:string) {
    if(!window.dump) {
      return this.bot.sendMessageTo(user, 'Dump não está disponível!')
    }

    window.dump(this.brain)
  }
}