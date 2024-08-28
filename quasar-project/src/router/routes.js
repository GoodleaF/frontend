const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "/log", component: () => import("pages/LogPage.vue") },
      { path: "/account", component: () => import("pages/AccountPage.vue") },
      {
        path: "/user",
        component: () => import("pages/UserInfoPage.vue"),
        children: [
          {
            path: "/chat",
            component: () => import("components/users/UserChatting.vue"),
          },
        ],
      },
      {
        path: "/announce",
        component: () => import("pages/ServerAnnouncement.vue"),
      },
      {
        path: "/manager",
        component: () => import("src/pages/dev/ManagerGradePage.vue"),
      },
      {
        path: "/maintenance",
        component: () => import("src/pages/dev/ServerMaintenancePage.vue"),
      },
      {
        path: "/concurrent-user",
        component: () => import("pages/statistics/ConcurrentUser.vue"),
      },
      {
        path: "/survival-rate-return",
        component: () => import("pages/statistics/SurvivalRateReturn.vue"),
      },
      {
        path: "/survival-rate-new",
        component: () => import("pages/statistics/SurvivalRateNew.vue"),
      },
      {
        path: "/survival-rate-new",
        component: () => import("pages/statistics/SurvivalRateNew.vue"),
        
      },
      {
        path: "/electron-jump-rank",
        component: () => import("pages/statistics/ElectronJumpRank.vue"),
      },
      {
        path: "/electron-jump-log",
        component: () => import("pages/statistics/ElectronJumpLog.vue"),
      },
      {
        path: "/chatgpt",
        component: () => import("src/pages/ai/ChatGPTPage.vue"),
      },
      {
        path: "/skinscape",
        component: () => import("src/pages/ai/DynamicAISkinscape.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "/auth/sign-in",
        component: () => import("pages/auth/SignInPage.vue"),
      },
      {
        path: "/auth/sign-up",
        component: () => import("pages/auth/SignUpPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
