interface Movie {
  /** 排行序号 */
  code: number
  /** 主标题‌ */
  title: string
  /** 评分（需处理无评分情况） */
  rating: string
  /** 详情页链接‌ */
  detail: string
  /** 短评 */
  desc: string
  /** 年份 */
  year: string
  /** 封面图 URL‌ */
  cover: string
}
