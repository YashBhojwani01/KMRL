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
  Book,
  Settings,
  Shield,
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
  | "Calendar"
  | "document"
  | "clock"
  | "shield"
  | "trend"
  | "book"
  | "settings"
  | "alert-triangle";

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
      return <Calendar className={iconClass} />;
    case "document":
      return <FileText className={iconClass} />;
    case "clock":
      return <Clock3 className={iconClass} />;
    case "shield":
      return <Shield className={iconClass} />;
    case "trend":
      return <TrendingUp className={iconClass} />;
    case "book":
      return <Book className={iconClass} />;
    case "settings":
      return <Settings className={iconClass} />;
    case "alert-triangle":
      return <AlertTriangle className={iconClass} />;
    default:
      return <Calendar className={iconClass} />;
  }
};
