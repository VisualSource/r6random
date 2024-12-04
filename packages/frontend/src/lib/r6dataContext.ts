import { createContext } from "react";
import type { OperatorList, WeaponList } from "./loadout";

export type R6DataContext<T> = {
    data: T extends true ? { weapons: WeaponList, operators: OperatorList } : undefined,
    isLoading: boolean,
    error: Error | null
}

export const r6DataContext = createContext<R6DataContext<boolean> | null>(null)