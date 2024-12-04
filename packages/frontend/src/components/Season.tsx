import { useR6Data } from "@/lib/hooks/useR6Data"

export const Season: React.FC = () => {
    const { data } = useR6Data<true>();
    return (
        <div className="absolute bottom-4 left-4"><span className="font-bold">Season</span>: <span className="italic font-thin">{data.operators.season}</span></div>
    )
}