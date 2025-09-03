export const refactorSubMenus = (oldData) => {
  let newData = oldData;

  //for the new data which can be manipulated
  newData.forEach((headerType) => {
    headerType.menus.forEach((headerMenu) => {
      let newSubMenus = [];
      headerMenu.innerMenuCount = 0;
      headerMenu.sub_menus.forEach((subMenuItem) => {
        if (subMenuItem.group) {
          newSubMenus.forEach((newSubMenuItem) => {
            if (
              newSubMenuItem.name.toLowerCase() ===
              subMenuItem.group.toLowerCase()
            ) {
              newSubMenuItem.sub_menus.push(subMenuItem);
              headerMenu.innerMenuCount += 1;
            }
          });
        } else {
          subMenuItem.sub_menus = [];
          newSubMenus.push(subMenuItem);
        }
      });

      headerMenu.sub_menus = newSubMenus;
    });
  });

  return oldData;
};
