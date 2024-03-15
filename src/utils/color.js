/**
 * 颜色模式
 * @param {array} bgColor rgb数组
 * @returns 浅色模式: true  深色模式：false
 */
export function colorMode(bgColor) {
  let r1 = parseInt(bgColor.substring(1, 3), 16)
  let g1 = parseInt(bgColor.substring(3, 5), 16)
  let b1 = parseInt(bgColor.substring(5, 7), 16)
  return 0.213 * r1 + 0.715 * g1 + 0.072 * b1 < 255 / 2;
}

/**
 * 两个颜色混合
 * @param {*} c1 
 * @param {*} c2 
 * @param {*} ratio 
 * @returns 
 */
export function colourBlend(c1, c2, ratio) {
  ratio = Math.max(Math.min(Number(ratio), 1), 0)
  let r1 = parseInt(c1.substring(1, 3), 16)
  let g1 = parseInt(c1.substring(3, 5), 16)
  let b1 = parseInt(c1.substring(5, 7), 16)
  let r2 = parseInt(c2.substring(1, 3), 16)
  let g2 = parseInt(c2.substring(3, 5), 16)
  let b2 = parseInt(c2.substring(5, 7), 16)
  let r = Math.round(r1 * (1 - ratio) + r2 * ratio)
  let g = Math.round(g1 * (1 - ratio) + g2 * ratio)
  let b = Math.round(b1 * (1 - ratio) + b2 * ratio)
  r = ('0' + (r || 0).toString(16)).slice(-2)
  g = ('0' + (g || 0).toString(16)).slice(-2)
  b = ('0' + (b || 0).toString(16)).slice(-2)
  return '#' + r + g + b
}

//rgba转化16进制颜色
export function rgbaToHex(color) {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',')
  var a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255)
  return '#' + ('0' + r.toString(16)).slice(-2) + ('0' + g.toString(16)).slice(-2) + ('0' + b.toString(16)).slice(-2)
}

//16进制颜色转化rgb
export function hexToRgb(color){
  var reg = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/
  if(!reg.test(color)){return;}
  let r = parseInt(color.substring(1, 3), 16)
  let g = parseInt(color.substring(3, 5), 16)
  let b = parseInt(color.substring(5, 7), 16)
  return [r, g, b];
}

//16进制颜色转化rgba
export function hexToRgba(color, opacity = 100){
  let rgb = hexToRgb(color)
  return `rgba(${rgb[0]},${rgb[1]}, ${rgb[2]}, ${Number(opacity/100).toFixed(2)})`;
}