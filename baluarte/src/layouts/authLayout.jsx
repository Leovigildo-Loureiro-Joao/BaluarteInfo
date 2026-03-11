import { Outlet } from "react-router-dom";
import { useEffect } from "react";

const AUTH_BODY_OVERRIDES = {
  paddingTop: "0",
  minHeight: "100vh",
  fontFamily: "Roboto, system-ui, sans-serif",
};

export default function AuthLayout() {
  useEffect(() => {
    const body = document.body;
    const previousStyles = {
      paddingTop: body.style.paddingTop,
      minHeight: body.style.minHeight,
      fontFamily: body.style.fontFamily,
    };

    Object.assign(body.style, AUTH_BODY_OVERRIDES);

    return () => {
      Object.assign(body.style, previousStyles);
    };
  }, []);

  return (
    <main className="min-h-screen flex min-w-full flex-col items-center justify-center bg-gradient-light  font-body text-text-primary">
      <Outlet />
    </main>
  );
}
