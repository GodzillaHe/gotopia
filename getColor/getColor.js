export const getColor = async (imgData) => { // 需传入图片的base64码，以处理第三方或本地图片在Canvas上读取数据时会出现的脏域问题
  const canvas = document.createElement('canvas');
  const context  = canvas.getContext && canvas.getContext('2d');
  const blockSize = 5;
  const avColor = {
    r: 0,
    g: 0,
    b: 0,
  }
  let i = -4;
  let count = 0;
  let data,
      width,
      height;
  const colorCountMap = new Map();
  if (!context) { // 未渲染成功则返回白色
    return {
      r: 255,
      g: 255,
      b: 255,
    }
  }
  const image  = new Image()
  image.src = imgData
  image.onload = function () {}
  await image.onload()
  height = canvas.height = image.naturalHeight || image.offsetHeight || image.height
  width = canvas.width = image.naturalWidth || image.offsetWidth || image.width
  context.drawImage(image, 0, 0)
   try {
    data = context.getImageData(0, 0, width, height);
  } catch(e) { // 读取图片信息失败则返回白色
    return { 
      r: 255,
      g: 255,
      b: 255,
    }
  }
  length = data.data.length

  i = i + length * 9 / 10;
  while ((i += blockSize * 4) < length) {
    ++count;
    if (colorCountMap.has(`${data.data[i]},${data.data[i + 1]},${data.data[i + 2]}`)) {
      const num = colorCountMap.get(`${data.data[i]},${data.data[i + 1]},${data.data[i + 2]}`) + 1
       colorCountMap.set(`${data.data[i]},${data.data[i + 1]},${data.data[i + 2]}`, num)
    } else {
      colorCountMap.set(`${data.data[i]},${data.data[i + 1]},${data.data[i + 2]}`, 1)
    }
    avColor.r += data.data[i];
    avColor.g += data.data[i + 1];
    avColor.b += data.data[i + 2];
  }

  let maxColor = [...colorCountMap.entries()].find(item => item[1] == Math.max(...colorCountMap.values())); // 获取最大数量颜色点
  // 若最大数量颜色点占总点数15%以上则采用最大点数，否则采用平均点数
  return {
    r: (maxColor[1] / count > 0.15) ? +maxColor[0].split(',')[0] : ~~(avColor.r / count),
    g: (maxColor[1] / count > 0.15) ? +maxColor[0].split(',')[1] : ~~(avColor.g / count),
    b: (maxColor[1] / count > 0.15) ? +maxColor[0].split(',')[2] : ~~(avColor.b / count),
  }
}

export judgeFamilorColor = (colorObj, colorMap) => {

}

export const transformColor = (colorObj) => {
  var colorStr = '#';
  Object.keys(colorObj).forEach(item => {
    var num = colorObj[item].toString(16);
    if (colorObj[item] <= 15) {
      num = '0' + num;   
    }
    colorStr += num;
  });
  return colorStr.toUpperCase();
}
