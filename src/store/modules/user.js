import storage from "store";
import { login, getInfo, getUserRouters, updateToken, logout, chooseCompany } from "@/api/login";
import { ACCESS_TOKEN, REFRESH_TOKEN, EXPIRES_AT, } from "@/store/mutation-types";
import { setAvoidLogin } from '@/utils/avoidLogin'


const user = {
  state: {
    token: "",
    refreshToken: "",
    isRefreshing: true,
    expiresAt: 0,
    avatar: "",
    roles: null,
    info: {},
    tenantList:[],
    defaultSpace: {},
    securityTime: storage.get("securityTime") || 1 * 60 * 60,
    isShowDemo:false,
    demoProductId:'',
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_REFRESH_TOKEN: (state, refreshToken) => {
      state.refreshToken = refreshToken;
    },
    SET_EXPIRES_AT: (state, expiresAt) => {
      state.expiresAt = expiresAt;
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    SET_TENANT_LIST: (state, tenantList) => {
      state.tenantList = tenantList;
    },
    SET_DEFAULT_SPACE: (state, defaultSpace) => {
      state.defaultSpace = defaultSpace;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    SET_INFO: (state, info) => {
      state.info = info;
    },
    SET_SECURITY_TIME: (state, securityTime) => {
      state.securityTime = securityTime;
      storage.set("securityTime", securityTime);
    },
    SET_SHOW_DEMO:(state, isShowDemo) => {
      state.isShowDemo = isShowDemo;
    },
    SET_DEMO_PRODUCT_ID:(state, id) => {
      state.demoProductId = id;
    },
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then((res) => {
            if (res.code === 0) {
              const result = res.data;
              storage.set(ACCESS_TOKEN, result.token); // 正常请求token
              storage.set(REFRESH_TOKEN, result.refreshToken); // 验证token(token过期时需要通过它获取新的token)
              storage.set(EXPIRES_AT, result.expiresAt); // 过期时间
              commit("SET_TOKEN", result.token);
              commit("SET_REFRESH_TOKEN", result.refreshToken);
              commit("SET_EXPIRES_AT", result.expiresAt);
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    // 刷新token
    UpdateToken({ state }) {
      // 判断token过期 五分钟之内更新token
      const expiresAt = storage.get(EXPIRES_AT) || 0;
      const NowAt = Date.now() / 1000;
      if (state.isRefreshing && expiresAt && expiresAt - NowAt < 600) {
        state.isRefreshing = false;
        updateToken({ refreshToken: storage.get(REFRESH_TOKEN) })
          .then((res) => {
            if (res.code === 0) {
              const result = res.data;
              storage.set(ACCESS_TOKEN, result.token); // 正常请求token
              storage.set(REFRESH_TOKEN, result.refreshToken); // 验证token(token过期时需要通过它获取新的token)
              storage.set(EXPIRES_AT, result.expiresAt); // 过期时间
              commit("SET_TOKEN", result.token);
              commit("SET_REFRESH_TOKEN", result.refreshToken);
              commit("SET_EXPIRES_AT", result.expiresAt);
              setAvoidLogin(result.token)
            }
          })
          .finally(() => {
            state.isRefreshing = true;
          });
      }
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
      getInfo()
      .then((res) => {
        if(res.code == 0){
          const result = res.data || { user: {} };
          commit("SET_INFO", result); // 登录用户信息
          commit("SET_AVATAR", result.avatar); // 登录用户头像
          commit("SET_TENANT_LIST", result.tenantList || []); // 登录租户列表
          const defaultSpace = {tenantId:result.tenantId||'', companyName:result.companyName||result.tenantList.filter(item=>item.tenantId == result.tenantId).pop().companyName}
          commit("SET_DEFAULT_SPACE", defaultSpace);  // 默认租户空间
          // commit("SET_SHOW_DEMO",result.hasOwnProperty('hasGuided') && !result.hasGuided)
          resolve(res);
        } else{
          reject(new Error("获取用户信息失败"));
        }
      })
      .catch((error) => {
        reject(error);
      });
    });
    },
    // 获取用户权限
    GetRoles({ commit }) {
      return new Promise((resolve, reject) => {
        getUserRouters()
          .then((res) => {
            if (res.code == 0) {
              const result = res.data || [];
              // if (result.length > 0) {
                const roles = result;
                commit("SET_ROLES", roles);
              // }
              resolve(res);
            } else {
              reject(new Error("getInfo: roles must be a non-null array !"));
            }
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    //切换空间，清空路由
    ClearRoles({commit}){
      commit("SET_ROLES", null);
    },
    // 登出
    Logout({ commit, state }) {
      return new Promise((resolve) => {
        logout()
        .then((res) => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", null);
          commit("SET_REFRESH_TOKEN", "");
          commit("SET_EXPIRES_AT", 0);
          storage.remove(ACCESS_TOKEN);
          storage.remove(REFRESH_TOKEN);
          storage.remove(EXPIRES_AT);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
      });
    },

    // 切换租户空间
    ChangeSpace({ commit,state }, tenantId) {
      return new Promise((resolve, reject) => {
        chooseCompany({tenantId,refreshToken:state.token})
          .then((res) => {
            if (res.code === 0) {
              const result = res.data;
              storage.set(ACCESS_TOKEN, result.token); // 正常请求token
              storage.set(REFRESH_TOKEN, result.refreshToken); // 验证token(token过期时需要通过它获取新的token)
              storage.set(EXPIRES_AT, result.expiresAt); // 过期时间
              commit("SET_TOKEN", result.token);
              commit("SET_REFRESH_TOKEN", result.refreshToken);
              commit("SET_EXPIRES_AT", result.expiresAt);
            } else{
              reject(new Error(res.msg));
            }
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};

export default user;
