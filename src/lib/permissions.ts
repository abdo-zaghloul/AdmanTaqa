export type MePermissionsLike = {
  permissions?: string[];
};

export const buildPermissionHelpers = (me: MePermissionsLike) => {
  const permissionSet = new Set(me.permissions || []);

  const hasPermission = (code: string) => permissionSet.has(code);
  const hasAnyPermission = (codes: string[]) =>
    codes.some((code) => permissionSet.has(code));
  const hasAllPermissions = (codes: string[]) =>
    codes.every((code) => permissionSet.has(code));

  return {
    permissionSet,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
