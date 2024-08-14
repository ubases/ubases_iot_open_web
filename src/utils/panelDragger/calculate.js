
import { randomString, deepClone ,urlToBlobBase64 } from "@/utils/util"
import { hexToRgba } from '@/utils/color';
import { componentList as appComponentList, themeRelationComponent} from "@/views/panel/studioPanel/screenDesign/defaultProps"
import { componentList as embedComponentList,fontRelationComponent} from "@/views/panel/embed/screenDesign/defaultProps"


// 获取选中多组件的范围
export function getSelectedPosition(list){
  let position = {
    left:list[0].style.left,
    top:list[0].style.top,
    right:0,
    bottom:0
  }
  list.forEach(item=>{
    const style = item.style
    position = {
      left: style.left > position.left ? position.left : style.left,
      top: style.top > position.top ? position.top : style.top,
      right: (style.left + style.width) > position.right ? (style.left+style.width) : position.right,
      bottom: (style.top + style.height) > position.bottom ? (style.top + style.height) : position.bottom,
    }
  })
  return position
}

export function getShapeStyle(style) {
  const result = {};
  ['width', 'height', 'top', 'left'].forEach(attr => {
    result[attr] = style[attr] + 'px'
  })
  return result
}

export function mod360(deg) {
  return (deg + 360) % 360
}

// 生成唯一的变量值,同时变量集合添加新生成的变量名
export function createVariableName(variableName,list){
  let newVariableName = `${variableName}${randomString(8)}`
  if(list.includes(newVariableName)){
    this.createVariableName(variableName)
  } else {
    list.push(newVariableName)
    return newVariableName
  }
}

// componentData 嵌套数据结构 转换成 pageComponents平铺对象结构
export function flatComponentData(componentData,components={}){
  const variableName= componentData.variableName
  components[variableName] = {...componentData, parentVariableName:componentData.parentVariableName ?? Object.values(components).filter(item=>item.id==componentData.parentId)?.pop()?.variableName ??''}
  if(componentData.componentList && componentData.componentList.length > 0){
    // 子组件
    components[variableName]['childrenVariableNames'] = []
    componentData.componentList.forEach(item=>{
      components[variableName]['childrenVariableNames'].push(item.variableName)
      flatComponentData(item,components)
    })

  }
  return components
}

// pageComponents平铺对象结构 转换成 componentData 嵌套数据结构
export function generateComponentData(components, componentData={}, variableNames){
  if(!variableNames){
    componentData  = Object.values(components).filter(item=>item.type == 'GlobalLayout')?.pop()
  } else {
    componentData = deepClone({...components[variableNames]})
  }
  
  if(componentData.childrenVariableNames && componentData.childrenVariableNames.length>0){
    // 子组件
    componentData.componentList = []
    componentData.childrenVariableNames.forEach(item=>{
      componentData.componentList.push(generateComponentData(components, components[item], item))
    })
  }
  return componentData
}

// pageComponents平铺对象结构 转换成 树结构
export function generateComponentTree(components, componentData={}, variableNames, popupVariableNames){
  if(!variableNames){
    componentData  = deepClone(Object.values(components).filter(item=>item.type == 'GlobalLayout')?.pop())
  } else {
    componentData = deepClone({...components[variableNames]})
  }
  let tabList = []
  if(componentData.type=='TabLayout'){
    tabList=componentData.style.tabList
  }
  if(popupVariableNames){
    componentData['popupVariableNames'] = popupVariableNames
  }
  if(componentData.componentList){
    componentData.componentList = []
  }
  if(componentData.childrenVariableNames && componentData.childrenVariableNames.length>0){
    // 子组件
    componentData.componentList = []
    const childrenVariableNamesList = componentData.type=='TabLayout' || componentData.type=='ListLayout' ? componentData.childrenVariableNames : componentData.childrenVariableNames.reverse()
    childrenVariableNamesList.forEach((item,index)=>{
      if(componentData.type=='TabLayout'){
        let typeLabel = ''
        if(typeof(tabList[index].title) == 'string'){
          typeLabel = tabList[index].title || '标签'
        } else {
          typeLabel = tabList[index].title.zh || '标签'
        }
        components[item].typeLabel = typeLabel
      }
      componentData.componentList.push(generateComponentTree(components, components[item], item,popupVariableNames))
    })
  }
  return componentData
}

// 获取所有页面的组件变量名称集合
export function getPanelVariableNameList(pageList){
  return pageList.reduce((pre, cur)=>{
    return [...pre, ...Object.keys(cur.pageComponents)]
  },[])
}

// 创建初始化的App屏数据
export function createGlobalLayout(panelVariableNameList){
  let data = {}
  let globalLayout = deepClone(appComponentList.GlobalLayout)
  globalLayout['id'] = randomString(19)
  globalLayout['variableName'] = createVariableName(globalLayout.variableName,panelVariableNameList)
  globalLayout['childrenVariableNames'] = []
  globalLayout.componentList.forEach(item=>{
    item['id'] = randomString(19)
    item['variableName'] = createVariableName(item.variableName,panelVariableNameList)
    item['parentVariableName'] = globalLayout['variableName']
    globalLayout['childrenVariableNames'].push(item.variableName)
    data[item.variableName] = item
  })
  data[globalLayout.variableName] = globalLayout
  return data
}

// 创建初始化的嵌入式屏数据
export function createEmbedGlobalLayout(panelVariableNameList,width,height){
  let data = {}
  let globalLayout = deepClone(embedComponentList.GlobalLayout)
  globalLayout.style['width'] = width
  globalLayout.style['height'] = height
  globalLayout['id'] = randomString(19)
  globalLayout['variableName'] = createVariableName(globalLayout.variableName,panelVariableNameList)
  globalLayout['childrenVariableNames'] = []
  data[globalLayout.variableName] = globalLayout
  return data
}

// 获取选中组件的数据
export function getSelectedComponentData(selectedComponentVariableName, pageComponents, data=[]){
  selectedComponentVariableName.forEach(item=>{
    let compData = {}
    compData = deepClone(pageComponents[item])
    if(compData.childrenVariableNames && compData.childrenVariableNames.length > 0){
      compData.componentList = []
      compData.componentList = getSelectedComponentData(compData.childrenVariableNames,pageComponents,compData.componentList)
    }
    data.push(compData)
  })
  return data
}

// 更新App组件的childrenVariableNames、id、variableName
export function updateVariableName(variableName,pageComponents,panelVariableNameList,parentVariableName,newData={}){
  let compData = deepClone(pageComponents[variableName])
  let data = {}
  data.variableName = createVariableName(appComponentList[compData.type].variableName,panelVariableNameList)
  data.id = randomString(19)
  if(parentVariableName){
    data.parentVariableName = parentVariableName
    newData[parentVariableName].childrenVariableNames.push(data.variableName)
  }
  if(compData.childrenVariableNames && compData.childrenVariableNames.length > 0){
    data.childrenVariableNames = []
    newData[data.variableName] = {...compData, ...data}
    compData.childrenVariableNames.forEach(item=>{
      updateVariableName(item,pageComponents,panelVariableNameList,data.variableName,newData)
    })
  } else{
    newData[data.variableName] = {...compData, ...data}
  }
  return newData
}

// 更新嵌入式屏组件的childrenVariableNames、id、variableName
export function updateEmbedVariableName(variableName,pageComponents,panelVariableNameList,parentVariableName,newData={}){
  let compData = deepClone(pageComponents[variableName])
  let data = {}
  data.variableName = createVariableName(embedComponentList[compData.type].variableName,panelVariableNameList)
  data.id = randomString(19)
  if(parentVariableName){
    data.parentVariableName = parentVariableName
    newData[parentVariableName].childrenVariableNames.push(data.variableName)
  }
  if(compData.childrenVariableNames && compData.childrenVariableNames.length > 0){
    data.childrenVariableNames = []
    newData[data.variableName] = {...compData, ...data}
    compData.childrenVariableNames.forEach(item=>{
      updateVariableName(item,pageComponents,panelVariableNameList,data.variableName,newData)
    })
  } else{
    newData[data.variableName] = {...compData, ...data}
  }
  return newData
}

// 获取组件所有子组件的变量名称
export function getComponentVariableName(variableName,pageComponents,variableNameList=[]){
  const componentData = pageComponents[variableName]
  variableNameList.push(variableName)
  if(componentData && componentData.childrenVariableNames && componentData.childrenVariableNames.length>0){
    componentData.childrenVariableNames.forEach(item=>{
      getComponentVariableName(item,pageComponents,variableNameList)
    })
  }
  return variableNameList
}

// 修改组件默认颜色按主题色显示
export function changeComponentColor(componentName, style, themeColor){
  const data = themeRelationComponent[componentName]
  if(data){
    Object.keys(data).forEach(item=>{
     
      const key = data[item].key
      const parentKey = data[item].parentKey
      if(parentKey){
        // tab组件
        style[parentKey].forEach(p=>{
          p[key] =  themeColor[item]
        })
      } else if(key instanceof Array){
        // 多个属性
        key.forEach(t=>{
          style[t] =  themeColor[item]
        })
      } else {
        // 单个属性
        style[key] =  themeColor[item]
      }
    })
  }
  console.log(style)
  return style
}

// 计算主题色的rgba值
export function themeHexToRgba(hexData){
  const themeColor = hexToRgba(hexData.themeColor, hexData.themeOpacity)
  const mainFontColor = hexToRgba(hexData.mainFontColor, hexData.mainFontOpacity)
  const secondaryFontColor = hexToRgba(hexData.secondaryFontColor, hexData.secondaryFontOpacity)
  const componentBackgroundColor = hexToRgba(hexData.componentBackgroundColor, hexData.componentBackgroundOpacity)
  const dividerColor = hexToRgba(hexData.dividerColor, hexData.dividerOpacity)
  return { themeColor,mainFontColor,secondaryFontColor,componentBackgroundColor,dividerColor}
}

// 设置组件默认字体
export function setComponentFont(componentName, style, defaultFont){
  const data = fontRelationComponent[componentName]
  if(data){
      const key = data.key
      const parentKey = data.parentKey
      if(parentKey){
        // tab组件
        style[parentKey].forEach(p=>{
          p[key] =  defaultFont
        })
      } else if(key instanceof Array){
        // 多个属性
        key.forEach(t=>{
          style[t] =  defaultFont
        })
      } else {
        // 单个属性
        style[key] =  defaultFont
      }
  }
  console.log(style)
  return style
}

// 字体变化后，遍历是否有组件的字体被删除
export function changeComponentListFont(pageList,fontList,defaultFontKey){
  return pageList.map(item=>{
    const pageData = item.pageComponents
    Object.values(pageData).forEach(comp=>{
      const fontKeyData = fontRelationComponent[comp.type]
      if(fontKeyData){
        const key = fontKeyData.key
        const parentKey = fontKeyData.parentKey
        if(parentKey){
          // tab组件
          comp.style[parentKey].forEach(p=>{
            key.forEach(k=>{
              if(!fontList.some(f=>f.fontKey == p[k])){
                p[k] = defaultFontKey
              }
            }) 
          })
        } else if(key instanceof Array){
          // 多个属性
          key.forEach(t=>{
            if(!fontList.some(f=>f.fontKey == comp.style[t])){
              comp.style[t] = defaultFontKey
            }
          })
        } else {
          // 单个属性
          if(!fontList.some(f=>f.fontKey == comp.style[key])){
            comp.style[key] = defaultFontKey
          }
        }
      }
    })
    return item
  })
}

// 将文字插入css样式表
export function insertFontStyle(url,name){
  urlToBlobBase64(url).then((file) => {
    const base64Data = file.base64.split(';')
    var style = document.styleSheets[document.styleSheets.length-1];
    const len = style.cssRules.length
    style.insertRule(`@font-face {
      font-family: ${name};
      src: url(data:font/truetype;charset=utf-8;${base64Data[1]})format('truetype');
    }`,len); 
  })
}