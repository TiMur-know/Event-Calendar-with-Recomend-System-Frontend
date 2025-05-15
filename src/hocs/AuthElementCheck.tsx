import { RootState } from "@/redux/store";
import Cookies from "js-cookie";
import React from "react";
import { useSelector } from "react-redux";

interface AuthElementCheckProps {
  children: React.ReactNode;
  setRoles?: string[];
}

const AuthElementCheck = ({ children, setRoles = [] }: AuthElementCheckProps) => {
  const user = useSelector((state: RootState) => state.auth.user) || {
    role: Cookies.get("role"),
  };

  if (user && setRoles.length > 0) {
    if (setRoles.includes(user.role!)) {
      return <>{children}</>;
    } else {
      return null;
    }
  } else if (user.role==null && setRoles.length === 0) {
    return <>{children}</>;
  } else {
    return null;
  }
};

export default AuthElementCheck;