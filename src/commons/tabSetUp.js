const TabSetUp = {
  tabSelection(str, data) {
    let stringUrl = "";
    if (str === undefined) {
      stringUrl = data[0].name;
    } else {
      data.map((item, index) => {
        if (item.name.replace(/ /g, "") === str) {
          stringUrl = item.name;
        }
      });
    }
    return stringUrl;
  }
};

export default TabSetUp;
