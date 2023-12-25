import store from "@/store";
import router from "@/router";
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  console.log("User login info：", store.state.user.loginUser);

  const loginUser = store.state.user.loginUser;

  // Auto login
  if (!loginUser || !loginUser.userRole) {
    // wait for user info to be fetched
    await store.dispatch("user/getLoginUser");
  }

  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;

  // If the page requires user to login
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    // If the user is not logged in, redirect to login page
    if (!loginUser || !loginUser.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // If the user does not have permission to access the page, redirect to noAuth page
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }

  next();
});
