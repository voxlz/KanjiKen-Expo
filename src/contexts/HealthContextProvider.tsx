import React, { FC, useState } from "react";

type HealthContextType = {
  health: number;
};

export const HealthContext = React.createContext<HealthContextType>({
  health: 0,
});

/** Provides the drag context to elements that need it */
const HealthContextProvider: FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const [health, setHealth] = useState(300);

  const addHealth = (health: number) => {
    setHealth((h) => h + health);
  };

  const context = {
    health,
  };
  return <HealthContext.Provider value={context} children={children} />;
};

export default HealthContextProvider;
