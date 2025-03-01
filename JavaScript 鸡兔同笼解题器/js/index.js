// 输入模板配置
const inputTemplates = {
  standard: `
              <div class="input-group">
                  <label class="input-label">总头数</label>
                  <input type="number" id="totalHeads" min="1" required>
              </div>
              <div class="input-group">
                  <label class="input-label">总脚数</label>
                  <input type="number" id="totalLegs" min="2" required>
              </div>
          `,
  difference: `
              <div class="input-group">
                  <label class="input-label">总头数</label>
                  <input type="number" id="heads" min="1" required>
              </div>
              <div class="input-group">
                  <label class="input-label">脚数差值</label>
                  <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                      <select id="diffType" style="flex:1;">
                          <option value="more">脚数比头数的2倍多</option>
                          <option value="less">脚数比头数的2倍少</option>
                      </select>
                      <input type="number" id="diff" required style="flex:1;">
                  </div>
              </div>
          `,
  known_animal: `
              <div class="input-group">
                  <label class="input-label">已知动物类型</label>
                  <select id="animalType">
                      <option value="chicken">鸡的数量</option>
                      <option value="rabbit">兔的数量</option>
                  </select>
              </div>
              <div class="input-group">
                  <label class="input-label">已知数量</label>
                  <input type="number" id="knownNum" min="0" required>
              </div>
              <div class="input-group">
                  <label class="input-label">总头数</label>
                  <input type="number" id="totalH" min="1" required>
              </div>
          `,
}

// 切换输入表单
function changeInputs() {
  const type = document.getElementById('problemType').value
  document.getElementById('inputArea').innerHTML = inputTemplates[type]
}

// 主计算函数
function calculate() {
  const type = document.getElementById('problemType').value
  let result = ''

  try {
    switch (type) {
      case 'standard':
        result = solveStandard()
        break
      case 'difference':
        result = solveDifference()
        break
      case 'known_animal':
        result = solveKnownAnimal()
        break
    }
  } catch (e) {
    result = '❌ 输入错误：' + e.message
  }

  document.getElementById('result').innerHTML = result
  document.getElementById('result').scrollIntoView({ behavior: 'smooth' })
}

// 解决标准问题
function solveStandard() {
  const heads = parseInt(document.getElementById('totalHeads').value)
  const legs = parseInt(document.getElementById('totalLegs').value)

  if (isNaN(heads) || isNaN(legs)) throw new Error('请输入有效数字')
  if (heads < 1) throw new Error('头数不能小于1')
  if (legs < 2 * heads) throw new Error('脚数最少为头数的2倍')
  if (legs > 4 * heads) throw new Error('脚数最多为头数的4倍')
  if (legs % 2 !== 0) throw new Error('脚数必须是偶数')

  const rabbits = (legs - 2 * heads) / 2
  const chickens = heads - rabbits

  if (rabbits < 0 || chickens < 0) throw new Error('计算结果出现负数')

  return `【解题过程】
设鸡有 x 只，兔有 y 只

根据题意：
x + y = ${heads}  ➜ 总头数
2x + 4y = ${legs}  ➜ 总脚数

解得：
y = (总脚数 - 2×总头数)/2 = ${rabbits}
x = 总头数 - y = ${chickens}

【验证】
鸡脚：${chickens} × 2 = ${chickens * 2}
兔脚：${rabbits} × 4 = ${rabbits * 4}
合计：${chickens * 2 + rabbits * 4} 脚

最终答案：
鸡有 ${chickens} 只，兔有 ${rabbits} 只`
}

// 解决差值问题
function solveDifference() {
  const heads = parseInt(document.getElementById('heads').value)
  const diff = parseInt(document.getElementById('diff').value)
  const isMore = document.getElementById('diffType').value === 'more'

  if (isNaN(heads) || isNaN(diff)) throw new Error('请输入有效数字')
  if (heads < 1) throw new Error('头数不能小于1')
  if (diff < 0) throw new Error('差值不能为负数')

  const legs = isMore ? 2 * heads + diff : 2 * heads - diff
  return solveStandardWithValues(heads, legs)
}

// 解决已知数量问题
function solveKnownAnimal() {
  const animal = document.getElementById('animalType').value
  const known = parseInt(document.getElementById('knownNum').value)
  const total = parseInt(document.getElementById('totalH').value)

  if (isNaN(known) || isNaN(total)) throw new Error('请输入有效数字')
  if (known < 0) throw new Error('已知数量不能为负')
  if (total < 1) throw new Error('总头数不能小于1')

  if (animal === 'chicken') {
    if (known > total) throw new Error('鸡的数量不能超过总头数')
    const rabbits = total - known
    return `【解题过程】
已知鸡的数量：${known}只
总头数：${total}只

兔的数量 = ${total} - ${known} = ${rabbits}

【验证】
总头数：${known} + ${rabbits} = ${total}

最终答案：
兔有 ${rabbits} 只`
  } else {
    if (known > total) throw new Error('兔的数量不能超过总头数')
    const chickens = total - known
    return `【解题过程】
已知兔的数量：${known}只
总头数：${total}只

鸡的数量 = ${total} - ${known} = ${chickens}

【验证】
总头数：${chickens} + ${known} = ${total}

最终答案：
鸡有 ${chickens} 只`
  }
}

// 通用解法处理
function solveStandardWithValues(heads, legs) {
  try {
    document.getElementById('inputArea').innerHTML = inputTemplates.standard
    document.getElementById('totalHeads').value = heads
    document.getElementById('totalLegs').value = legs
    return solveStandard()
  } catch (e) {
    throw new Error(`转换失败：${e.message}`)
  }
}

// 初始化
changeInputs()
