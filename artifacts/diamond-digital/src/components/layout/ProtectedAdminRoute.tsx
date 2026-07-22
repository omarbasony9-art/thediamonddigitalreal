import { ReactNode } from "react";
import { Redirect } from "wouter";
import { AdminLayout } from "./AdminLayout";

function isAdminTokenValid(): boolean {
  try {
    const token = localStorage.getItem("admin_token");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  if (!isAdminTokenValid()) {
    return <Redirect to="/admin/login" />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}
