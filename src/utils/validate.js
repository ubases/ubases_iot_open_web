// url是否含参数
export const URL_PARAMS = /[?&][^?&]+=[^?&]+/g;

// url是否含有http(s)协议
export const URL_hTTPS = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
// 邮箱正则
export const EMAIl_REG =
  /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;

// 手机号正则
export const PHONE_REG = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;

// 美国手机号正则
export const US_PHONE_REG = /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/

// 中文正则
export const ZH_REG = /^[\u4e00-\u9fa5]{0,}$/;

// 英文正则
export const EN_REG = /^[A-Za-z]+$/;

// 英文数字正则
export const ENNUMBER_REG = /^[A-Za-z0-9]+$/;

// 中英文数字正则
export const WORLD_REG = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;

// 中、英文、数字、下划线正则
export const WORLD_UNDERLINE_REG = /^[\u4e00-\u9fa5A-Za-z0-9_]+$/;

// 中英文数字混合正则
export const WORLD_NUM_REG = /^[\u4e00-\u9fa5A-Za-z0-9.]+$/;

// 版本号正则
export const VERSION_REG = /^\d+(?:\.\d+){2}$/;

// wifi正则
export const WIFI_REG = /^[A-Za-z0-9_]+$/;

// 密码正则 英文 数字 符号
export const PASSWORD_REG =
  /^[\a-\z\A-\Z0-9\.\,\?\<\>\。\，\-\——\=\;\@\！\!\+]+$/g;

// 身份证正则
export const IDCARD_REG = /^[1-9][1-9]\d{4}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dX]$/

// 网址正则
export const WEBURL_REG = /^(http|https):\/\/+[A-Za-z0-9]/

// 字母、数字、下划线，以字母开头
export const IDENTIFIER_REG = /^[A-Za-z][A-Za-z0-9_]{0,}$/g;

// 字母、数字、下划线，以字母/下划线开头
export const IDENTIFIER_REG1 = /^[A-Za-z_][A-Za-z0-9_]{0,}$/g;

// app包名
export const IOSPACKAGE_REG = /^([A-Za-z][A-Za-z0-9]*)+(?:\.[A-Za-z][A-Za-z0-9]*){1,}$/g;

// ANDROID包名
export const ANDROIDPACKAGE_REG = /^([A-Za-z][A-Za-z0-9_]*)+(?:\.[A-Za-z][A-Za-z0-9_]*){1,}$/g;

// 中文，字母，数字，空格
export const ZHENNUM_REG = /^[\u4e00-\u9fa5A-Za-z0-9 ]+$/;

// 中文，字母，数字，分号
export const WORLD_MULTI_REG = /^[\u4e00-\u9fa5A-Za-z0-9;]+$/;

// 字母，数字，空格
export const ENNUM_REG = /^[\u4e00-\u9fa5A-Za-z0-9 ]+$/;

// 十六进制
export const HEX_REG = /^[A-F0-9]+$/

// 中文名称限制
export const ZhNameRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: ZH_REG,
      message: "只能输入中文不能使用空格,符号和数字",
      trigger,
    },
  ];
};

// 英文名称限制
export const EnNameRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: EN_REG,
      message: "只能输入英文不能使用空格,符号和数字",
      trigger,
    },
  ];
};

// 英文数字名称限制
export const EnNumberRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: ENNUMBER_REG,
      message: "只能输入英文和数字不能使用空格,符号",
      trigger,
    },
  ];
};

// 中文，字母，数字，空格 限制
export const ZhEnNumberRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: ZHENNUM_REG,
      message: "只能输入中文，字母，数字，空格",
      trigger,
    },
  ];
};

// 字母，数字，空格 限制
export const EnNumberBlankRules = (message, trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: "字符长度在1-50",
      trigger,
    },
    {
      required: true,
      pattern: ENNUM_REG,
      message: "只能输入字母，数字，空格",
      trigger,
    },
  ];
};

// 普通校验
export const CommonRules = (message, trigger = "", type = "") => {
  return [
    {
      type,
      required: true,
      message, // 请输入xxx
      trigger,
    },
  ];
};

// 普通名称校验
export const CommonNameRules = (
  message,
  maxLength = 50,
  minLength = 1,
  trigger = ""
) => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      min: minLength,
      max: maxLength,
      message: `字符长度在${minLength}-${maxLength}`,
      trigger,
    },
  ];
};

// 手机号校验
export const PhoneRules = (message = "请输入手机号码", trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      pattern: PHONE_REG,
      message: "请输入11位的手机号码",
      trigger,
    },
  ];
};

// 邮箱校验
export const EmailRules = (message = "请输入邮箱", trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      pattern: EMAIl_REG,
      message: "请输入正确格式规则的邮箱",
      trigger,
    },
  ];
};

// 账号验证
export const AccountRules = (message = "请输入手机或邮箱", trigger = "") => {
  return [
    {
      required: true,
      message, // 请输入xxx
      trigger,
    },
    {
      required: true,
      max: 50,
      message:'小于50个字符', // 请输入xxx
      trigger,
    },
    {
      required: true,
      validator: validAccount,
      message: "请输入正确格式规则的手机或邮箱",
      trigger,
    },
  ];
};
function validAccount(rule, value, callback){
  if(!PHONE_REG.test(value) && !EMAIl_REG.test(value)){
    callback('请输入正确格式规则的手机或邮箱') 
  }
  callback()
}

// 版本号校验;
export const VersionRules = (message = "请输入版本号", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      pattern: VERSION_REG,
      message: "请输入格式xx.xx.xx的版本号",
      trigger,
    },
  ];
};

// wifi校验
export const WifiRules = (message = "请输入wifi名", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      min: 1,
      max: 50,
      message: `字符长度在1-50`,
      trigger,
    },
    {
      required: true,
      pattern: WIFI_REG,
      message: "请输入英文,数字,下划线的wifi名,不能使用空格和其他符号",
      trigger,
    },
  ];
};

// 密码校验
export const PassWordRules = (message = "请输入密码", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      min: 8,
      max: 50,
      message: `字符长度在8-50`,
      trigger,
    },
    {
      required: true,
      pattern: PASSWORD_REG,
      message: "请输入英文,数字或常用符号的密码",
      trigger,
    },
    {
      required: true,
      pattern: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/g,
      message: "密码必须要有英文字母大小写和数字",
      trigger,
    },
  ];
};


// 身份证号校验
export const IDCardRules = (message = "请输入身份证号", trigger = "") => {
  return [
    {
      required: true,
      message,
      trigger,
    },
    {
      required: true,
      pattern: IDCARD_REG,
      message: "请输入正确的身份证号",
      trigger,
    },
  ];
};

// 联系方式校验
export const ConnetRules = (message = "请输入联系电话", trigger = "") => {
  return [
    { required: true, message: message, trigger },   
    { required: true, min: 1, max: 50, message: "字符长度在1-50", trigger},
    {required: true, pattern:/^[0-9\-]+$/, message: "只能输入数字和中划线", trigger}
  ]
};

// 图片校验
export const beforeUpload = (that,file,size,width,height,ratio) =>{
  return new Promise((resolve, reject) => {
    if(size){
      const isLimit = file.size / 1024 / 1024 > size;
      if (isLimit) {
        that.$message.warning(`上传文件最大${size}M`);
        return reject(false)
      }
    }
    if(!width && !height && !ratio) resolve(true) 
    const reader = new FileReader(); // 这个是通过原生的方式来获取图片的宽高
    reader.readAsDataURL(file);
    reader.onload = () => {
      const image = new Image();
      image.src = reader.result;
      image.onload = () => {
        const w = image.width;
        const h = image.height;
        if(width && height){
          if ((width && w != width) || (height && h != height)) {
            that.$message.warning(`请上传${width}px*${height}px尺寸图片`);
            return reject(false) // //如有问题,通过reject 函数传一个false阻止他的上传
          } else {
            return resolve(true) // 如没有问题,通过resolve函数添加一个true 让文件上传
          }
        }
        if(ratio){
          const arr = ratio.split(":")
          if (parseInt(w/h) !== parseInt(arr[0]/arr[1])) {
            that.$message.warning(that.$t('public.upload.ratio',{ratio}));
            return reject(false) // //如有问题,通过reject 函数传一个false阻止他的上传
          } else {
            return resolve(true) // 如没有问题,通过resolve函数添加一个true 让文件上传
          }
        }
      };
    };
  });
}