import antdEnUS from "ant-design-vue/es/locale-provider/en_US";
import momentEU from "moment/locale/eu";

import login from "./en-US/login";
import register from "./en-US/register";

const components = {
  antLocale: antdEnUS,
  momentName: "eu",
  momentLocale: momentEU,
};

export default {
  message: "-",
  ...components,
  ...login,
  ...register,
};
