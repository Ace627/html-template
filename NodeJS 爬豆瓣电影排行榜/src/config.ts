import path from 'path'

/** 输出目录 */
export const OUTPUT_DIR = path.join(import.meta.dirname, '../database')

/** 输出文件路径 */
export const OUTPUT_FILE_PATH = path.join(OUTPUT_DIR, `douban_top250_${Date.now()}.json`)

/** 豆瓣电影 Top 250 基础爬取路径 */
export const DOUBAN_BASE_URL = `https://movie.douban.com/top250?start=`

/** 每个分页有多少条目数 */
export const PAGE_SIZE = 25
