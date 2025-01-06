import path from 'path'
import fs from 'fs/promises'

async function bootstrap() {
  const dirNameList = await fs.readdir(path.join(process.cwd(), 'demo'))
}

bootstrap()
