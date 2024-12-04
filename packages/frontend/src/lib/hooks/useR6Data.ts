import { useContext } from "react";
import { type R6DataContext, r6DataContext, } from "../r6dataContext";

export const useR6Data = <L = false>() => {
    const data = useContext(r6DataContext) as R6DataContext<L>;
    if (!data) throw new Error("Failed to get r6 data");
    return data;
}