import { RouteRecordRaw } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import BrowseQuestionView from "@/views/question/BrowseQuestionView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "User",
    component: UserLayout,
    children: [
      {
        path: "/user/login",
        name: "User Login",
        component: UserLoginView,
      },
      {
        path: "/user/register",
        name: "User Register",
        component: UserRegisterView,
      },
    ],
    meta: {
      hide: true,
    },
  },
  {
    path: "/questions",
    name: "Questions",
    component: QuestionsView,
  },
  {
    path: "/question/view/:id",
    name: "View Question",
    component: BrowseQuestionView,
    props: true,
    meta: {
      hide: true,
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/question/add",
    name: "Add Question",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/question/update",
    name: "Edit Question",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.USER,
      hide: true,
    },
  },
  {
    path: "/question/manage",
    name: "Manage Question",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  // {
  //   path: "/",
  //   name: "Problem",
  //   component: HomeView,
  // },

  // {
  //   path: "/hide",
  //   name: "Hide",
  //   component: HomeView,
  //   meta: {
  //     hide: true,
  //   },
  // },
  {
    path: "/noAuth",
    name: "No Auth",
    component: NoAuthView,
    meta: {
      hide: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "Admin",
  //   component: AdminView,
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
  // {
  //   path: "/about",
  //   name: "About",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];
