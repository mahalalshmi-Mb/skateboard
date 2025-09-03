import MyOrdersIcon from "../../assets/images/profile/myOrdersIcon.svg";
import FeedbackIcon from "../../assets/images/profile/feedbackIcon.svg";
import SettingsIcon from "../../assets/images/profile/settingsIcon.svg";
import LogoutIcon from "../../assets/images/profile/logoutIcon.svg";
import WalletIcon from "../../assets/images/profile/walletIcon.svg";
import SupportIcon from "../../assets/images/profile/customerSupport.svg";
import EmployeeIcon from "../../assets/images/profile/employeeIcon.svg";
import { getAppConfig } from "../../commons/util/appConfigHelper";

export const listConfig = [
  {
    mainMenu: "Personal Details",
    subMenu: [
      {
        menuIcon: MyOrdersIcon,
        menuName: "My Orders",
        linkTo: "/travellers/profile/myBookings",
        isActive: true,
      },
    ],
  },
  {
    mainMenu: "Support",
    subMenu: [
      {
        menuIcon: FeedbackIcon,
        menuName: "Feedback for Pulse",
        linkTo: "/feedback-form",
        isActive: false,
      },
      {
        menuIcon: WalletIcon,
        menuName: "Rewards Wallet",
        linkTo: "/travellers/profile/wallet",
        isActive: false,
      },
      {
        menuIcon: SupportIcon,
        menuName: "Helpdesk",
        linkTo: "/travellers/profile/help-and-support",
        isActive: getAppConfig("SHOW_PROFILE_HELP_AND_SUPPORT"),
      },
    ],
  },
  {
    mainMenu: "Other",
    subMenu: [
      {
        menuIcon: SettingsIcon,
        menuName: "Settings",
        linkTo: "/travellers/profile/settings",
        isActive: true,
      },
      {
        menuIcon: EmployeeIcon,
        menuName: "Enroll as employee",
        isActive: getAppConfig("SHOW_ENROLL_EMPLOYEE"),
        isShowEnrollEmployee : getAppConfig("SHOW_ENROLL_EMPLOYEE")
      },
      {
        menuIcon: LogoutIcon,
        menuName: "Logout",
        isActive: true,
      },
    ],
  },
];
