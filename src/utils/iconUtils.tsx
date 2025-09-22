import {
  FileCheck2,
  Clock3,
  ShieldCheck,
  TrendingUp,
  FileText,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";

type IconType =
  | "FileCheck2"
  | "Clock3"
  | "ShieldCheck"
  | "TrendingUp"
  | "FileText"
  | "DollarSign"
  | "CheckCircle"
  | "AlertTriangle"
  | "Calendar";

export const renderIcon = (iconType: IconType, iconClass: string) => {
  switch (iconType) {
    case "FileCheck2":
      return <FileCheck2 className={iconClass} />;
    case "Clock3":
      return <Clock3 className={iconClass} />;
    case "ShieldCheck":
      return <ShieldCheck className={iconClass} />;
    case "TrendingUp":
      return <TrendingUp className={iconClass} />;
    case "FileText":
      return <FileText className={iconClass} />;
    case "DollarSign":
      return <DollarSign className={iconClass} />;
    case "CheckCircle":
      return <CheckCircle className={iconClass} />;
    case "AlertTriangle":
      return <AlertTriangle className={iconClass} />;
    case "Calendar":
    default:
      return <Calendar className={iconClass} />;
  }
};
