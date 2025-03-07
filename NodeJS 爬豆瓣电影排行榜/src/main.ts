import fs from 'fs'
import axios from 'axios'
import { sleep } from '@/utils'
import * as cheerio from 'cheerio'
import randomUseragent from 'random-useragent'
import { OUTPUT_DIR, DOUBAN_BASE_URL, OUTPUT_FILE_PATH, PAGE_SIZE } from '@/config'

// 输出目录不存在则创建一个
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

/**
 * 获取豆瓣电影 Top250 指定页面的 HTML 内容
 * @param {number} pageNo 页码（默认第1页）
 * @returns {Promise<string | null>} - 成功返回页面HTML字符串，失败返回null‌
 */
async function getPageString(pageNo: number = 1): Promise<string | null> {
  const url = DOUBAN_BASE_URL + `${(pageNo - 1) * PAGE_SIZE}`
  try {
    // 随机 User-Agent 规避基础反爬策略‌
    const response = await axios.get(url, { headers: { 'User-Agent': randomUseragent.getRandom() }, timeout: 10000 })
    const pageHTML = response.data as string
    return response.status === 200 ? pageHTML : null
  } catch (error: any) {
    throw new Error(`请求第 ${pageNo} 页失败: ${error.message}`)
  }
}

/**
 * 解析豆瓣电影 Top250 页面的 HTML 内容‌
 * @param {string} html 需要解析的 HTML 字符串
 * @returns {Array<Movie[]>} 结构化电影数据数组‌
 */
function parseHTML(html: string, startIndex: number): Movie[] {
  // 初始化 Cheerio 解析器‌
  const $ = cheerio.load(html)
  const movies: Movie[] = []
  // 遍历所有电影条目容器‌
  $('.item').each((index, element) => {
    // 复用选择器对象提升性能‌
    const $el = $(element)
    // 核心数据提取逻辑‌
    const movie = {} as Movie
    movie.code = index + 1 + startIndex
    movie.title = $el.find('.title').first().text().trim() // 主标题（优先取第一个.title元素）‌
    movie.rating = $el.find('.rating_num').text().trim() // 评分（需处理无评分情况）
    movie.detail = $el.find('.hd a').attr('href') || '' // 详情页链接‌
    movie.desc = $el.find('.quote').text().trim() || '暂无简介' // 短评（空值兜底）‌
    movie.year = $el.find('.bd p').first().text().trim().match(/\d{4}/)?.[0] || '未知年份' // 年份正则提取‌
    movie.cover = $el.find('.pic img').attr('src') || '' // 封面图 URL‌
    movies.push(movie)
  })
  return movies
}

/**
 * 主爬虫流程控制器
 * @description 实现分页爬取、错误隔离、数据持久化全流程管理‌
 */
async function main() {
  try {
    const allMovies: Movie[] = []
    // 分页爬取核心逻辑‌
    for (let pageNo = 1; pageNo <= 10; pageNo++) {
      console.log(`正在爬取第 ${pageNo}/10 页...`)
      const html = await getPageString(pageNo)
      if (!html) return
      const movies = parseHTML(html, (pageNo - 1) * PAGE_SIZE)
      allMovies.push(...movies)
      await sleep(2000 + Math.random() * 1000) // 反爬策略：随机延迟 1-3 秒‌
    }
    // 保存数据
    fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(allMovies, null, 2))
    console.log(`数据已保存到 ${OUTPUT_FILE_PATH}`)
  } catch (error) {
    console.error('爬取失败:', error.message)
  }
}

// 启动爬虫
main()
