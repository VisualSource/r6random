import { createContext } from "react";
import type { OperatorList, WeaponList } from "./loadout";

export type LoadedContext = {
    data: { weapons: WeaponList, operators: OperatorList },
    loading: false,
    error: undefined
};
export type UnloadedContext = {
    data: undefined,
    loading: true,
    error: undefined
}
type ErrorContext = {
    data: { weapons: WeaponList, operators: OperatorList } | undefined,
    loading: boolean,
    error?: Error
};

export const r6DataContext = createContext<LoadedContext | UnloadedContext | ErrorContext | null>(null)