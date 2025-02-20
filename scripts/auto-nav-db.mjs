import path from 'path'
import fs from 'fs/promises'

async function bootstrap() {
  const dirNameList = await fs.readdir(path.join(process.cwd(), 'views'))
  const savePath = path.join(process.cwd(), './database/navs.json')
  await fs.writeFile(savePath, JSON.stringify(dirNameList, null, '  '))
}

bootstrap()
