import ACCESS_ENUM from "@/access/accessEnum";

/**
 * Check whether the current user has permission to access the page
 * @param loginUser current login user
 * @param needAccess need access
 * @return boolean whether the current user has permission to access the page
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // Retrieve the login user's role
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  // If the page requires user to login
  if (needAccess === ACCESS_ENUM.USER) {
    // If the user is not logged in, no permission
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  // If the page requires user to be admin
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // If the user is not admin, no permission
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
