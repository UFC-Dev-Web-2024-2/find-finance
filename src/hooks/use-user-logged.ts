import { UserLoggedContext } from "@/context/UserLoggedContext";
import { useContext } from "react";

export function useUserLogged() {
  const context = useContext(UserLoggedContext);
  return context;
}