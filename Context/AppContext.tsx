import React, { ReactNode, createContext, useState } from "react";

type context = {
  flag:boolean,
  setFlag:(flag:boolean)=>void
}

const initial:context = {
  flag: false,
  setFlag:() => {}
}

export const AppContext = createContext<context>(initial);

export const AppProvider = ({ children } : {children:ReactNode}) => {
    const [flag,setFlag] = useState<boolean>(false)

    return (
      <AppContext.Provider value={{ flag, setFlag }}>
        {children}
      </AppContext.Provider>
    );
  };
  