import antd from "ant-design-vue/es/locale-provider/zh_CN";
import momentCN from "moment/locale/zh-cn";

import login from "./zh-CN/login";
import register from "./zh-CN/register";
import publicObj from "./zh-CN/public";
import system from "./zh-CN/system"; // 系统设置
import authority from "./zh-CN/authority"; // 权限管理
import product from "./zh-CN/product"; // 产品管理
import firmware from "./zh-CN/firmware";
import basicInfo from "./zh-CN/basicInfo";
import enterpriseCertification from "./zh-CN/enterpriseCertification"
import enterpriseInfo from "./zh-CN/enterpriseInfo"
import securitySet from "./zh-CN/securitySet"
import dashboard from "./zh-CN/dashboard"
import multilingual from "./zh-CN/multilingual"
import appMultilingual from "./zh-CN/appMultilingual"
import dataManage from "./zh-CN/dataManage";
import device from "./zh-CN/device"
import deviceDebugging from "./zh-CN/deviceDebugging";
import productSetting from "./zh-CN/productSetting";
import afterSalesService from "./zh-CN/afterSalesService";
import helpCenter from "./zh-CN/helpCenter";
import optionalConfig from "./zh-CN/optionalConfig";
import createOemApp from "./zh-CN/createOemApp";
import oemApp from "./zh-CN/oemApp";
import oemAppConfiguration from "./zh-CN/oemAppConfiguration";
import component from "./zh-CN/component";
import productHelpcenter from "./zh-CN/productHelpcenter";
import appSplashScreenPush from "./zh-CN/appSplashScreenPush"
import problemType from "./zh-CN/problemType";
import intelligentScene from "./zh-CN/intelligentScene";
import collection from "./zh-CN/collection"
import customizedApp from "./zh-CN/customizedApp"
import manufacture from "./zh-CN/manufacture";

const components = {
  antLocale: antd,
  momentName: "zh",
  momentLocale: momentCN,
};

export default {
  message: "-",
  ...components,
  ...publicObj,
  ...login,
  ...register,
  ...system,
  ...authority,
  ...product,
  ...firmware,
  ...basicInfo,
  ...enterpriseCertification,
  ...enterpriseInfo,
  ...securitySet,
  ...dashboard,
  ...multilingual,
  ...appMultilingual,
  ...dataManage,
  ...device,
  ...deviceDebugging,
  ...productSetting,
  ...afterSalesService,
  ...helpCenter,
  ...optionalConfig,
  ...createOemApp,
  ...oemApp,
  ...oemAppConfiguration,
  ...component,
  ...productHelpcenter,
  ...appSplashScreenPush,
  ...problemType,
  ...intelligentScene,
  ...collection,
  ...customizedApp,
  ...manufacture,
};
