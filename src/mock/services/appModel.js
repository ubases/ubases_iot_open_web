import { builder, mockGet } from '@/mock/util'

const detail = () => {
  return builder( { "interfaceConf":[
    {
      'nameCn': '应用图标',
      'nameEn': '',
      'funcKey': 'interface_appLogo',
      'funcType': '',
      'sort': '1',
      'content': {
        'baseConf':{
          'confTitle': '设置App应用图标',
          'confPrompt': '该图标显示在手机桌面、通知栏等位置，非常重要。请不要上传带透明底的图片，否则会导致展示出错',
          'defImageUrl': require('../../assets/image/appConfig/logo_default.png'),
          'verifyPrompt': '请使用大小不超过2M，尺寸限定为: 1024*1024px ，格式为PNG的图片，单纯修改图片后缀名无法通过校验。'
        },
        'previewConf':{
          'prompt':'此图仅供参考，最终效果以客户端展示为准',
          'previewList':[
            {
              'title':'',
              'baseImageUrl':require('../../assets/image/appConfig/logo_preview_bg.png'),
              'size':{
                'width': 178,
                'height': 373,
              },
              'position':{
                'marginTop':116,
                'marginLeft':16
              }
            }

          ]
        }
      },
    },{
      'nameCn': 'iOS启动图',
      'nameEn': '',
      'funcKey': 'interface_iosInit',
      'funcType': '',
      'sort': '1',
      'content': {
        'baseConf':{
          'confTitle': '设置手机端启动页，已自动生成，也可自助重新上传',
          'confPrompt': '该打开App加载程序时显示的过渡图片，默认显示App应用图标',
          'imageList': [
            {
              'defImageUrl':'',
              'size':{
                'width': 640,
                'height': 960,
              }
            }
          ],
          'verifyPrompt': '尺寸：支持 3 种尺寸。格式：PNG格式，不超过 2MB，暂不支持动图和视频'
        },
        'previewConf':{
          'prompt':'此图仅供参考，最终效果以客户端展示为准',
          'previewList':[
            {
              'title':'',
              'baseImageUrl':require('../../assets/image/appConfig/logo_preview_bg.png'),
              'size':{
                'width': 178,
                'height': 373,
              },
              'position':{
                'marginTop':116,
                'marginLeft':16
              }
            }

          ]
        }
      },
    },{
      'nameCn': 'Android启动图',
      'nameEn': '',
      'funcKey': 'interface_androidInit',
      'funcType': '',
      'sort': '1',
      'content': '',
    },{
      'nameCn': 'App主题色',
      'nameEn': '',
      'funcKey': 'interface_themeColor',
      'funcType': '',
      'sort': '1',
      'content': '',
    },{
      'nameCn': '底部菜单栏',
      'nameEn': '',
      'funcKey': 'interface_appFooterBar',
      'funcType': '',
      'sort': '1',
      'content': '',
    },{
      'nameCn': '默认房间',
      'nameEn': '',
      'funcKey': 'interface_defaultRoom',
      'funcType': '',
      'sort': '1',
      'content': '',
    },{
      'nameCn': '个性化配置',
      'nameEn': '',
      'funcKey': 'interface_personalization',
      'funcType': '',
      'sort': '1',
      'content': '',
    },
  ]
  }, "ok", 0);
};
mockGet('', detail);