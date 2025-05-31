import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function AuthLayout() {

    const navigate = useNavigate();
   
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <Outlet />
    </main>
  );
}
