import {createRouter, createWebHistory, type Router, type RouteRecordRaw} from 'vue-router'

const routes: Array<RouteRecordRaw> = [{
//     path: '/old', name: 'web-index', component: party, meta: {title: '蛋仔派对惊魂寻宝队地图-0chem.com'}
// }, {
    path: '/', name: 'egg-party-list', component: () => import("../views/party2/index.vue"),
    props: (route) => ({
        // 首页支持的参数列表（按需定义）
        id: route.query.id ? String(route.query.id) : ''
    }),
    meta: {
        isHome: true,
        keepAlive: true,
        title: '蛋仔派对惊魂寻宝队地图-0chem.com'
    }
}, {
    path: '/t', name: 'test', component: () => import ('../views/party2/test.vue'), meta: {title: '蛋仔派对惊魂寻宝队地图-0chem.com'}
}];

// const routes: RouteRecordRaw[] = routesBase.concat(routerTools);

const router: Router = createRouter({
    // history: createWebHistory(import.meta.env.BASE_URL),
    history: createWebHistory(),
    routes: routes
})

export default router
