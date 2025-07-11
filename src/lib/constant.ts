import categories from "@/data/categories";
import { UserRole } from "@prisma/client";
import { CiSettings } from "react-icons/ci";
import { FaBarcode } from "react-icons/fa";
import { FaWallet } from "react-icons/fa6";
import { IoMdAnalytics } from "react-icons/io";
import { MdHistory, MdOutlineCategory } from "react-icons/md";
import { PiPackageDuotone } from "react-icons/pi";
import { VscHome, VscPreview } from "react-icons/vsc";

type getSidebarType = { role: UserRole };
export const getSideBar = (user: getSidebarType) => {
  return [
    ...(user.role === "VENDOR"
      ? [
          {
            icon: VscHome,
            href: "/",
            value: "Profile",
          },
          {
            icon: VscPreview,
            href: "/reviews",
            value: "Reviews",
          },
          {
            icon: FaWallet,
            href: "/wallet",
            value: "Wallet",
          },
          // {
          //   icon: PiHandWithdraw,
          //   href: "/withdraws",
          //   value: "Withdraws",
          // },
          {
            icon: IoMdAnalytics,
            href: "#",
            value: "Analytics",
          },
          {
            icon: FaBarcode,
            href: "/generate-code",
            value: "Generate Code",
          },
          {
            icon: PiPackageDuotone,
            href: "/orders",
            value: "Orders",
          },
          {
            icon: CiSettings,
            href: "/settings",
            value: "Settings",
          },
        ]
      : [
          {
            icon: VscHome,
            href: "/",
            value: "Home",
          },
          {
            icon: MdOutlineCategory,
            href: "/vendors",
            value: "Categories",
            children: categories,
          },
          {
            icon: CiSettings,
            href: "/settings",
            value: "Settings",
          },
          {
            icon: MdHistory,
            href: "/orders",
            value: "Transaction History",
          },
        ]),
  ];
};

export const constants = {
  CANCELLATION_REASONS: [
    "Not Satisfied With Service",
    "Not Satisfied With Agreement",
    "Vendor asked me to cancel",
    "Vendor misrepresentation",
    "Suspected Fraud",
    "Not interested anymore",
    "Found another vendor",
    "Long wait time",
    "Other",
  ],
  EXTENSION_REASONS: [
    "Logistics",
    "Vendor asked me to delay",
    "Goods altered in transit",
    "Goods not available",
  ],
};
