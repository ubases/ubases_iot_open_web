// eslint-disable-next-line
import * as loginService from "@/api/login";
// eslint-disable-next-line
import { BasicLayout, BlankLayout, PageView, RouteView,AccountLayout, TopNavLayout } from "@/layouts";
import { MenuProductIcon, MenuDataIcon, MenuAppIcon, MenuCloudIcon, MenuAccreditIcon  } from '@/core/icons'
import { staticRouterConfig } from "@/config/router.config"

const iconList ={
  "MenuProductIcon": MenuProductIcon,
  "MenuDataIcon": MenuDataIcon,
  "MenuAppIcon": MenuAppIcon,
  "MenuCloudIcon": MenuCloudIcon,
  "MenuAccreditIcon": MenuAccreditIcon
}

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,
  AccountLayout:AccountLayout,
  Layout: PageView,
  TopNavLayout:TopNavLayout,
  404: () => import("@/views/exception/404"),
};

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: "*",
  redirect: "/404",
  hidden: true,
};

// 根级菜单
const rootRouter = {
  key: "",
  name: "index", 
  path: "/", 
  component: "BasicLayout",
  redirect: "/dashboard/index",
  meta: {
    title: "首页",
  },
  children: [],
};

/**
 * 动态生成菜单
 * @param roles
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (roles) => {
  return new Promise((resolve, reject) => {
    const menuNav = [];
    const childrenNav = [...staticRouterConfig,...roles];
    // 后端数据, 根级树数组,  根级 PID
    // listToTree(result, childrenNav, 0);
    rootRouter.children = childrenNav;
    menuNav.push(rootRouter);
    const routers = generator(menuNav);
    routers.push(notFoundRouter);
    resolve(routers);
  });
};

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map((item) => {
    const { title, icon, isHideChildMenu, isCache } = item;
    const currentRouter = {
      // 如果路由设置path
      path: item.path,
      // 路由名称，建议唯一
      name: item.name,
      // 该路由对应页面的组件: (动态加载)
      component:
        constantRouterComponents[item.component] ||
        (() => import(`@/views${item.component}`)),
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon,
        permission: item.name,
        keepalive: isCache == 1 ? true : false, // 是否缓存
        isBack: false,
        parent: parent 
      },
    };
    // 是否设置了隐藏菜单
    if (item.visible === 1) {
      currentRouter.hidden = false;
    }else {
      currentRouter.hidden = true;
    }
    currentRouter.isFrame = item.isFrame
    // 是否设置了隐藏子菜单
    if (isHideChildMenu == 1) {
      currentRouter.hideChildrenInMenu = true;
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    if (currentRouter.path && !currentRouter.path.startsWith("http")) {
      currentRouter.path = currentRouter.path.replace("//", "/");
    }
    // 重定向 暂时不处理
    item.jumpPath && (currentRouter.redirect = item.jumpPath);
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter);
    }
    return currentRouter;
  });
};

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach((item) => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: [],
      };
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id);
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children;
      }
      // 加入到树中
      tree.push(child);
    }
  });
};
