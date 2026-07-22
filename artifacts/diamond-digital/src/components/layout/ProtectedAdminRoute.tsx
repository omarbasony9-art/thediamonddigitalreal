import { Show } from "@clerk/react";
import { Redirect } from "wouter";
import { AdminLayout } from "./AdminLayout";
import { ReactNode } from "react";

export function ProtectedAdminRoute({ children }: { children: ReactNode }) {
  return (
    <>
      <Show when="signed-in">
        <AdminLayout>{children}</AdminLayout>
      </Show>
      <Show when="signed-out">
        <Redirect to="/sign-in" />
      </Show>
    </>
  );
}
