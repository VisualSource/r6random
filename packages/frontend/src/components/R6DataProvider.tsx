import { useEffect, useState } from "react";
import { r6DataContext } from "../lib/r6dataContext";
import type { OperatorList, WeaponList } from "@/lib/loadout";
import ErrorPage from "@/pages/ErrorPage";
import Loading from "@/pages/Loading";

const DATA_ROOT_URL = "https://raw.githubusercontent.com/VisualSource/r6random/tree/main/packages/frontend/data";

export const R6DataProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [error, setError] = useState<Error | undefined>();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{ weapons: WeaponList, operators: OperatorList } | undefined>();

    useEffect(() => {
        const signal = new AbortController();

        const init = async () => {
            const [ops, weap] = await Promise.allSettled([
                fetch(`${DATA_ROOT_URL}/operators.json`, { signal: signal.signal }).then(e => e.json()),
                fetch(`${DATA_ROOT_URL}/weapons.json`, { signal: signal.signal }).then(e => e.json())
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

        init().then(e => setData(e)).catch(e => setError(e)).finally(() => setLoading(false));

        return () => {
            signal.abort();
        }
    }, []);

    return (
        <r6DataContext.Provider value={{ data, loading, error }}>
            {loading ? (
                <Loading />
            ) : error ? (
                <ErrorPage error={error} />
            ) : (
                children
            )}
        </r6DataContext.Provider>
    );
}