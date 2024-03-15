const getters = {
  isMobile: (state) => state.app.isMobile,
  lang: (state) => state.app.lang,
  theme: (state) => state.app.theme,
  color: (state) => state.app.color,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  roles: (state) => state.user.roles,
  userInfo: (state) => state.user.info,
  tenantList: (state) => state.user.tenantList,
  defaultSpace: (state) => state.user.defaultSpace,
  imageServerUrl: (state) => state.user.info.ImageServer,
  realname: (state) => state.user.info.userName,
  securityTime: (state) => state.user.securityTime,
  addRouters: (state) => state.permission.addRouters,
  multiTab: (state) => state.app.multiTab,
};

export default getters;
