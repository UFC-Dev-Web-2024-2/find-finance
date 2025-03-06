/* eslint-disable react-refresh/only-export-components */
import { User } from "@/core/entities/user";
import { createContext, useCallback, useEffect, useState } from "react";

type UserLoggedContextData = {
  user: User;
}

export const UserLoggedContext = createContext<UserLoggedContextData>({} as UserLoggedContextData);

export function UserLoggedProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>({} as User);

  const getUserLogged = useCallback(() => {
    const user = localStorage.getItem("@findfinance:user");
    if (user) setUser(JSON.parse(user))
  }, [])
   
  useEffect(() => {
    getUserLogged();
  }, [getUserLogged])

  return (
    <UserLoggedContext.Provider value={{ user }}>
      {children}
    </UserLoggedContext.Provider>
  )
}