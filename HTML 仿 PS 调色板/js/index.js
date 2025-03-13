window.onload = function () {
  var colorObj = {
    barR: 255,
    barG: 0,
    barB: 0, // 纯彩色面板rgb
    barY: 0, // 纯彩色面板bar的垂直位置
    areaX: 255,
    areaY: 0, // 主面板pointer的位置
    r: 255,
    g: 0,
    b: 0, // 合成rgb
    rgb: 'FF0000', // 合成十六进制rgb
    currentRgb: undefined, // 当前十六进制rgb
  }
  var colorContainer = document.getElementById('color-container'),
    colorArea = document.getElementById('color-area'),
    colorAreaLayer = document.getElementById('color-area-layer'),
    colorAreaPoint = document.getElementById('color-area-point'),
    items = colorArea.getElementsByTagName('div'),
    colorIndexLayer = document.getElementById('color-index-layer'),
    colorBar = document.getElementById('color-bar'),
    showNew = document.getElementById('show-new'),
    showCurrent = document.getElementById('show-current'),
    webSafe = document.getElementById('web-safe'),
    colorSure = document.getElementById('color-sure'),
    rgbR = document.getElementById('rgb-r'),
    rgbG = document.getElementById('rgb-g'),
    rgbB = document.getElementById('rgb-b'),
    rgb0x = document.getElementById('rgb0x')
  setShowCurrentColor(colorObj)
  fillColor(items, colorObj) // 初始化主面板
  colorObj = getColor(colorObj)
  fillInput(colorObj)
  dragEvent(colorIndexLayer, function (offsetX, offsetY) {
    colorObj = getBarRgb(colorObj, offsetY)
    colorObj = getColor(colorObj)
    moveColorBar(colorObj)
    fillColor(items, colorObj)
    fillInput(colorObj)
  })
  dragEvent(colorAreaLayer, function (x, y) {
    colorObj.areaX = x
    colorObj.areaY = y
    colorObj = getColor(colorObj)
    moveAreaPoint(colorObj)
    fillInput(colorObj)
  })
  dragBarEvent(colorBar, function (offsetY) {
    colorObj = getBarRgb(colorObj, offsetY)
    colorObj = getColor(colorObj)
    fillColor(items, colorObj)
    fillInput(colorObj)
  })
  oninput(rgbR, function () {
    if (document.activeElement === rgbR) {
      if (rgbR.value === '') {
        rgbR.value = 0
      }
      if (!/^\d+$/gi.test(rgbR.value) || rgbR.value < 0 || rgbR.value > 255) {
        rgbR.value = colorObj.r
        return
      }
      if (rgbR.value == colorObj.r) {
        return
      }
      colorObj = getColorPosition(colorObj, rgbR.value, rgbG.value, rgbB.value)
      moveColorBar(colorObj)
      moveAreaPoint(colorObj)
      fillColor(items, colorObj)
      fillInput(colorObj)
    }
  })
  oninput(rgbG, function () {
    if (document.activeElement === rgbG) {
      if (rgbG.value === '') {
        rgbG.value = 0
      }
      if (!/^\d+$/gi.test(rgbG.value) || rgbG.value < 0 || rgbG.value > 255) {
        rgbG.value = colorObj.g
        return
      }
      if (rgbG.value == colorObj.g) {
        return
      }
      colorObj = getColorPosition(colorObj, rgbR.value, rgbG.value, rgbB.value)
      moveColorBar(colorObj)
      moveAreaPoint(colorObj)
      fillColor(items, colorObj)
      fillInput(colorObj)
    }
  })
  oninput(rgbB, function () {
    if (document.activeElement === rgbB) {
      if (rgbB.value === '') {
        rgbB.value = 0
      }
      if (!/^\d+$/gi.test(rgbB.value) || rgbB.value < 0 || rgbB.value > 255) {
        rgbB.value = colorObj.b
        return
      }
      if (rgbB.value == colorObj.b) {
        return
      }
      colorObj = getColorPosition(colorObj, rgbR.value, rgbG.value, rgbB.value)
      moveColorBar(colorObj)
      moveAreaPoint(colorObj)
      fillColor(items, colorObj)
      fillInput(colorObj)
    }
  })
  oninput(rgb0x, function () {
    if (document.activeElement === rgb0x) {
      var val = rgb0x.value
      if (!/^[\dA-F]{6}$/gi.test(val)) {
        return
      }
      if (val == colorObj.rgb) {
        return
      }
      var arr = [hex2Decimal(val.substr(0, 2)), hex2Decimal(val.substr(2, 2)), hex2Decimal(val.substr(4, 2))]
      colorObj = getColorPosition(colorObj, arr[0], arr[1], arr[2])
      moveColorBar(colorObj)
      moveAreaPoint(colorObj)
      fillColor(items, colorObj)
      fillInput(colorObj)
    }
  })
  webSafe.onclick = function () {
    var r = colorObj.r,
      g = colorObj.g,
      b = colorObj.b
    colorObj = getColorPosition(colorObj, toSafeColor(r), toSafeColor(g), toSafeColor(b))
    moveColorBar(colorObj)
    moveAreaPoint(colorObj)
    fillColor(items, colorObj)
    fillInput(colorObj)
  }
  clickEvent(colorSure, function (down) {
    if (down) {
      colorSure.style.lineHeight = '29px'
    } else {
      colorSure.style.lineHeight = '27px'
      colorObj.currentRgb = colorObj.rgb
      setShowCurrentColor(colorObj)
    }
  })
  showCurrent.onclick = function () {
    setShowCurrentColor(colorObj)
  }

  function moveColorBar(colorObj) {
    colorBar.style.top = colorObj.barY + 'px'
  }
  function moveAreaPoint(colorObj) {
    colorAreaPoint.style.left = colorObj.areaX + 'px'
    colorAreaPoint.style.top = colorObj.areaY + 'px'
    if (colorObj.areaY < 100) {
      colorAreaPoint.style.borderColor = '#000000'
    } else {
      colorAreaPoint.style.borderColor = '#FFFFFF'
    }
  }
  function fillInput(colorObj) {
    rgbR.value = colorObj.r
    rgbG.value = colorObj.g
    rgbB.value = colorObj.b
    showNew.style.backgroundColor = '#' + colorObj.rgb
    rgb0x.value = colorObj.rgb
  }
  function fillShowCurrent(colorObj) {
    showCurrent.innerHTML = ''
    showCurrent.style.background = '#' + colorObj.currentRgb
  }
  function setShowCurrentColor(colorObj) {
    var currentRgb = colorObj.currentRgb
    if (currentRgb) {
      fillShowCurrent(colorObj)
      var arr = [hex2Decimal(currentRgb.substr(0, 2)), hex2Decimal(currentRgb.substr(2, 2)), hex2Decimal(currentRgb.substr(4, 2))]
      colorObj = getColorPosition(colorObj, arr[0], arr[1], arr[2])
      moveColorBar(colorObj)
      moveAreaPoint(colorObj)
      fillColor(items, colorObj)
      fillInput(colorObj)
    } else {
      showCurrent.style.background = '#F00000'
      showCurrent.innerHTML = '<div class="empty-color empty-color-up"></div><div class="empty-color empty-color-down"></div>'
    }
  }
}
function fillColor(items, colorObj) {
  var r = colorObj.barR,
    g = colorObj.barG,
    b = colorObj.barB
  var iterations = Math.floor(items.length / 8)
  var leftover = items.length % 8
  var i = 0,
    multiple = 2
  if (leftover > 0) {
    do {
      processLinearGradient(i * multiple, items[i++], r, g, b)
    } while (--leftover > 0)
  }
  do {
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
    processLinearGradient(i * multiple, items[i++], r, g, b)
  } while (--iterations > 0)
}
function processLinearGradient(i, dom, r, g, b) {
  setLinearGradient(dom, 255 - i, 255 - i, 255 - i, Math.round(r * (1 - i / 255)), Math.round(g * (1 - i / 255)), Math.round(b * (1 - i / 255)))
}
function setLinearGradient(dom, r1, g1, b1, r2, g2, b2) {
  try {
    dom.style.background = 'linear-gradient(to right, #FFFFFF,#000000)'
    setLinearGradient = function (dom, r1, g1, b1, r2, g2, b2) {
      var rgb1 = '#' + decimal2Hex(r1) + decimal2Hex(g1) + decimal2Hex(b1)
      var rgb2 = '#' + decimal2Hex(r2) + decimal2Hex(g2) + decimal2Hex(b2)
      dom.style.background = 'linear-gradient(to right, ' + rgb1 + ',' + rgb2 + ')'
      dom.style.filter = 'progid:DXImageTransform.Microsoft.Gradient(enabled=true,startColorStr=' + rgb1 + ',endColorStr=' + rgb2 + ',gradientType=1)'
    }
  } catch (e) {
    setLinearGradient = function (dom, r1, g1, b1, r2, g2, b2) {
      var rgb1 = '#' + decimal2Hex(r1) + decimal2Hex(g1) + decimal2Hex(b1)
      var rgb2 = '#' + decimal2Hex(r2) + decimal2Hex(g2) + decimal2Hex(b2)
      dom.style.filter = 'progid:DXImageTransform.Microsoft.Gradient(enabled=true,startColorStr=' + rgb1 + ',endColorStr=' + rgb2 + ',gradientType=1)'
    }
  }
  return setLinearGradient(dom, r1, g1, b1, r2, g2, b2)
}
function getBarRgb(colorObj, offsetY) {
  colorObj.barY = offsetY
  if (offsetY >= 0 && offsetY < 42) {
    colorObj.barR = 255
    colorObj.barG = 0
    colorObj.barB = Math.round((offsetY * 256) / 42)
  } else if (offsetY >= 42 && offsetY < 85) {
    colorObj.barR = Math.round(255 - ((offsetY - 42) * 256) / 43)
    colorObj.barG = 0
    colorObj.barB = 255
  } else if (offsetY >= 85 && offsetY < 128) {
    colorObj.barR = 0
    colorObj.barG = Math.round(((offsetY - 85) * 256) / 43)
    colorObj.barB = 255
  } else if (offsetY >= 128 && offsetY < 171) {
    colorObj.barR = 0
    colorObj.barG = 255
    colorObj.barB = Math.round(255 - ((offsetY - 128) * 256) / 43)
  } else if (offsetY >= 171 && offsetY < 214) {
    colorObj.barR = Math.round(((offsetY - 171) * 256) / 43)
    colorObj.barG = 255
    colorObj.barB = 0
  } else if (offsetY >= 214 && offsetY < 256) {
    colorObj.barR = 255
    colorObj.barG = Math.round(255 - ((offsetY - 214) * 256) / 42)
    colorObj.barB = 0
  } else if (offsetY >= 256) {
    colorObj.barR = 255
    colorObj.barG = 0
    colorObj.barB = 0
  }
  return colorObj
}
function getColor(colorObj) {
  var r = colorObj.barR,
    g = colorObj.barG,
    b = colorObj.barB,
    x = colorObj.areaX,
    y = colorObj.areaY
  colorObj.r = Math.round((x * (r * (1 - y / 255) - (255 - y))) / 255 + (255 - y))
  colorObj.g = Math.round((x * (g * (1 - y / 255) - (255 - y))) / 255 + (255 - y))
  colorObj.b = Math.round((x * (b * (1 - y / 255) - (255 - y))) / 255 + (255 - y))
  colorObj.rgb = rgb2HexColor(colorObj)
  if (r === 255 && g === 0 && b === 0) {
    if (colorObj.barY !== 256) {
      colorObj.barY = 0
    }
  } else if (r === 255 && g === 0) {
    colorObj.barY = Math.round((b * 42) / 256)
  } else if (g === 0 && b === 255) {
    colorObj.barY = Math.round(((255 - r) * 43) / 256 + 42)
  } else if (r === 0 && b === 255) {
    colorObj.barY = Math.round((g * 43) / 256 + 85)
  } else if (r === 0 && g === 255) {
    colorObj.barY = Math.round(((255 - b) * 43) / 256 + 128)
  } else if (g === 255 && b === 0) {
    colorObj.barY = Math.round((r * 43) / 256 + 171)
  } else if (r === 255 && b === 0) {
    colorObj.barY = Math.round(((255 - g) * 42) / 256 + 214)
  }
  return colorObj
}
function getColorPosition(colorObj, r1, g1, b1) {
  var r0 = colorObj.barR,
    g0 = colorObj.barG,
    b0 = colorObj.barB,
    x = 0,
    y = 0
  r1 = Number(r1)
  g1 = Number(g1)
  b1 = Number(b1)
  if (r1 === g1 && r1 === b1) {
    x = 0
    y = 255 - r1
  } else if (r1 === g1 && r1 > b1) {
    r0 = 255
    g0 = 255
    b0 = 0
    x = Math.round(255 - (255 * b1) / r1)
    y = 255 - r1
  } else if (r1 === g1 && r1 < b1) {
    r0 = 0
    g0 = 0
    b0 = 255
    x = Math.round(255 - (255 * r1) / b1)
    y = 255 - b1
  } else if (r1 === b1 && r1 > g1) {
    r0 = 255
    g0 = 0
    b0 = 255
    x = Math.round(255 - (255 * g1) / r1)
    y = 255 - r1
  } else if (r1 === b1 && r1 < g1) {
    r0 = 0
    g0 = 255
    b0 = 0
    x = Math.round(255 - (255 * r1) / g1)
    y = 255 - g1
  } else if (g1 === b1 && g1 > r1) {
    r0 = 0
    g0 = 255
    b0 = 255
    x = Math.round(255 - (255 * r1) / g1)
    y = 255 - g1
  } else if (g1 === b1 && g1 < r1) {
    r0 = 255
    g0 = 0
    b0 = 0
    x = Math.round(255 - (255 * g1) / r1)
    y = 255 - r1
  } else if (r1 > g1 && r1 < b1) {
    g0 = 0
    b0 = 255
    x = Math.round(255 - (255 * g1) / b1)
    y = 255 - b1
    r0 = Math.round((255 * (r1 - g1)) / (b1 - g1))
  } else if (r1 > b1 && r1 < g1) {
    g0 = 255
    b0 = 0
    x = Math.round(255 - (255 * b1) / g1)
    y = 255 - g1
    r0 = Math.round((255 * (r1 - b1)) / (g1 - b1))
  } else if (g1 > r1 && g1 < b1) {
    r0 = 0
    b0 = 255
    x = Math.round(255 - (255 * r1) / b1)
    y = 255 - b1
    g0 = Math.round((255 * (g1 - r1)) / (b1 - r1))
  } else if (g1 > b1 && g1 < r1) {
    r0 = 255
    b0 = 0
    x = Math.round(255 - (255 * b1) / r1)
    y = 255 - r1
    g0 = Math.round((255 * (g1 - b1)) / (r1 - b1))
  } else if (b1 > r1 && b1 < g1) {
    r0 = 0
    g0 = 255
    x = Math.round(255 - (255 * r1) / g1)
    y = 255 - g1
    b0 = Math.round((255 * (b1 - r1)) / (g1 - r1))
  } else if (b1 > g1 && b1 < r1) {
    r0 = 255
    g0 = 0
    x = Math.round(255 - (255 * g1) / r1)
    y = 255 - r1
    b0 = Math.round((255 * (b1 - g1)) / (r1 - g1))
  }

  colorObj.barR = r0
  colorObj.barG = g0
  colorObj.barB = b0
  colorObj.areaX = x
  colorObj.areaY = y

  return getColor(colorObj)
}
function rgb2HexColor(rgb) {
  return decimal2Hex(rgb.r) + decimal2Hex(rgb.g) + decimal2Hex(rgb.b)
}
function decimal2Hex(num) {
  var hex = Number(num).toString(16).toUpperCase()
  return hex.length === 1 ? '0' + hex : hex
}
function hex2Decimal(hex) {
  return parseInt(hex, 16)
}
function toSafeColor(num) {
  if (num < 26) {
    num = 0
  } else if (num < 77) {
    num = 51
  } else if (num < 128) {
    num = 102
  } else if (num < 179) {
    num = 153
  } else if (num < 230) {
    num = 204
  } else {
    num = 255
  }
  return num
}
function clickEvent(dom, func) {
  var el = dom.setCapture ? dom : document
  dom.onmousedown = function (ev) {
    dom.focus()
    func(true)
    el.onmouseup = function () {
      func(false)
      el.onmouseup = null
      if (dom.releaseCapture) {
        dom.releaseCapture()
      }
    }
    if (dom.setCapture) {
      dom.setCapture()
    }
    return false
  }
}
function dragEvent(dom, func) {
  var disX = 0,
    disY = 0,
    clientX = 0,
    clientY = 0,
    dx = 0,
    dy = 0
  var el = dom.setCapture ? dom : document
  dom.onmousedown = function (ev) {
    dom.focus()
    var oEvent = ev || window.event
    disX = dx = oEvent.offsetX || oEvent.layerX || 0
    disY = dy = oEvent.offsetY || oEvent.layerY || 0
    clientX = oEvent.clientX
    clientY = oEvent.clientY
    var timeoutFunc = function () {
      func(dx, dy)
    }
    var dateDown = +new Date()
    var timeout = null
    timeoutFunc()
    el.onmousemove = function (ev) {
      var oEvent = ev || window.event
      if (oEvent.stopPropagation) {
        oEvent.stopPropagation()
      } else {
        oEvent.cancelBubble = true
      }
      dx = disX + oEvent.clientX - clientX
      dy = disY + oEvent.clientY - clientY
      if (dx < 0) {
        dx = 0
      } else if (dx > dom.offsetWidth - 1) {
        dx = dom.offsetWidth - 1
      }
      if (dy < 0) {
        dy = 0
      } else if (dy > dom.offsetHeight - 1) {
        dy = dom.offsetHeight - 1
      }
      var dateMove = +new Date()
      if (dateMove - dateDown > 50) {
        dateDown = dateMove
        timeout = window.setTimeout(timeoutFunc, 30)
      }
      return false
    }
    el.onmouseup = function () {
      window.clearTimeout(timeout)
      timeoutFunc()
      el.onmousemove = null
      el.onmouseup = null
      if (dom.releaseCapture) {
        dom.releaseCapture()
      }
    }
    if (dom.setCapture) {
      dom.setCapture()
    }
    return false
  }
}
function dragBarEvent(dom, func) {
  var offsetTop = 0,
    clientY = 0,
    dy = 0
  var el = dom.setCapture ? dom : document,
    parent = dom.offsetParent
  dom.onmousedown = function (ev) {
    dom.focus()
    var oEvent = ev || window.event
    offsetTop = dom.offsetTop + Math.round(dom.offsetHeight / 2)
    clientY = oEvent.clientY
    var timeoutFunc = function () {
      func(dy)
    }
    timeoutFunc()
    var timeout = null
    var clear = true
    el.onmousemove = function (ev) {
      var oEvent = ev || window.event
      if (oEvent.stopPropagation) {
        oEvent.stopPropagation()
      } else {
        oEvent.cancelBubble = true
      }
      dy = offsetTop + oEvent.clientY - clientY
      if (dy < 0) {
        dy = 0
      } else if (dy > parent.offsetHeight - 1) {
        dy = parent.offsetHeight - 1
      }
      dom.style.top = dy + 'px'
      if (clear) {
        clear = !clear
        window.clearTimeout(timeout)
      }
      timeout = window.setTimeout(timeoutFunc, 40)
      return false
    }
    el.onmouseup = function () {
      window.clearTimeout(timeout)
      timeoutFunc()
      el.onmousemove = null
      el.onmouseup = null
      if (dom.releaseCapture) {
        dom.releaseCapture()
      }
    }
    if (dom.setCapture) {
      dom.setCapture()
    }
    return false
  }
}
function oninput(node, callback) {
  if (document.addEventListener) {
    node.addEventListener('input', callback, false)
    if (/MSIE 9\.0/.test(window.navigator.userAgent)) {
      var selectionchange = function () {
        callback.call(node)
      }
      node.addEventListener(
        'focus',
        function () {
          document.addEventListener('selectionchange', selectionchange, false)
        },
        false,
      )
      node.addEventListener(
        'blur',
        function () {
          document.removeEventListener('selectionchange', selectionchange, false)
        },
        false,
      )
    }
  } else {
    node.attachEvent('onpropertychange', function (e) {
      if (e.propertyName === 'value') {
        callback.call(node, node)
      }
    })
  }
}
