import { getCookieCustom } from "../util/cookieUtil";

const Check = (resource, actionType) => {
  // check role
  const permissionMap = {
    none: 0,
    view: 1,
    edit: 2,
    create: 3,
    delete: 4,
  };

  let permissionsData = getCookieCustom("userPermissionData");

  if (!permissionsData) return false;

  if (permissionsData) {
    const permissions = JSON.parse(permissionsData);
    const givenPermission = permissions.find((x) => x.startsWith(resource));

    if (givenPermission) {
      const performPermission = permissionMap[actionType];
      const allowedPermission = permissionMap[givenPermission.split("=")[1]];

      return performPermission <= allowedPermission;
    } else {
      return false;
    }
  }

  return false;
};

const Can = (props) => {
  return Check(props.resource, props.actionType) ? props.yes() : props.no();
};

Can.defaultProps = {
  yes: () => null,
  no: () => null,
};

export { Check, Can };
