import { useContext } from "react";
import { type LoadedContext, r6DataContext, type UnloadedContext } from "../r6dataContext";

export const useR6Data = <L = false>() => {
    const data = useContext(r6DataContext) as L extends true ? LoadedContext : UnloadedContext;
    if (!data) throw new Error("Failed to get r6 data");
    return data;
}