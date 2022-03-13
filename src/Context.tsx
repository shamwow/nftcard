import React, { FC, ReactElement, ReactNode, Dispatch, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

export type Context = {
    setConnectedAddress: (address: string | null) => void,
    connectedAddress: string | null,
};

const Context = createContext({} as Context);

export const ContextProvider: FC<{children: ReactElement}> = ({
    children,
}) => {
    const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
    return (
        <Context.Provider
            value={{
                connectedAddress,
                setConnectedAddress,
            }}>
            {children}
        </Context.Provider>
    );

};

export function useAppContext() {
    return useContext(Context);
}