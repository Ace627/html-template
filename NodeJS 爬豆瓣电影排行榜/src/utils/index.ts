/** 延时函数 指定 ms 后再执行后续函数 */
export function sleep(delay = 1000): Promise<void> {
  return new Promise((resolve, _) => setTimeout(() => resolve(), delay))
}
