import toast from "react-hot-toast";
import { isDesktopDevice } from "../../commons/util/helperFunctions";

const notifConfig = {
  duration: 2000,
  position: isDesktopDevice() ? "top-center" : "top-left",
  style: { zIndex: 9999999, position: "relative", top: "30px" },
};

class PushAlert {
  static success(text) {
    toast.success(text, notifConfig);
  }

  static warning(text) {
    toast(
      (t) => <div onClick={() => toast.dismiss(t.id)}>{text}</div>,
      notifConfig
    );
  }

  static error(text) {
    toast.error(text, notifConfig);
  }

  static info(text) {
    toast(
      (t) => <div onClick={() => toast.dismiss(t.id)}>{text}</div>,
      notifConfig
    );
  }
}

export default PushAlert;
