import { useQuery } from "@tanstack/react-query";
import { r6DataContext } from "../lib/r6dataContext";
import ErrorPage from "@/pages/ErrorPage";
import Loading from "@/pages/Loading";

const DATA_ROOT_URL = "https://raw.githubusercontent.com/VisualSource/r6random/refs/heads/main/packages/frontend/data/";

export const R6DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { data, isError, isLoading, error } = useQuery({
        queryKey: ["R6_DATA"],
        queryFn: async () => {
            const [ops, weap] = await Promise.allSettled([
                fetch(`${DATA_ROOT_URL}/operators.json`).then(e => e.json()),
                fetch(`${DATA_ROOT_URL}/weapons.json`).then(e => e.json())
            ]);

            if (ops.status === "rejected") {
                throw ops.reason;
            }
            if (weap.status === "rejected") {
                throw weap.reason;
            }

            return {
                weapons: weap.value,
                operators: ops.value
            }
        }
    })


    return (
        <r6DataContext.Provider value={{ data, isLoading, error }}>
            {isLoading ? (
                <Loading />
            ) : isError ? (
                <ErrorPage error={error} />
            ) : (
                children
            )}
        </r6DataContext.Provider>
    );
}