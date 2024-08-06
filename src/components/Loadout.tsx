import type { Operator } from "r6operators";

export type OperatorLoadout = {
    operator: Operator,
    loadout: {
        primary: string;
        secondary: string;
        gadget: string;
        utility: string | null;
    } | null;
}

export const Loadout: React.FC<{ data: OperatorLoadout | null, generateLoadout: boolean }> = ({ data, generateLoadout }) => {
    if (!data) return null;
    return (
        <>
            <div className="flex justify-center animate-in zoom-in-75 duration-1000">
                <div className="flex flex-col">
                    <div className="flex">
                        <div
                            className="w-16 h-16"
                            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG
                            dangerouslySetInnerHTML={{ __html: data.operator.toSVG() ?? "" }}
                        />
                        <div className="flex items-center">
                            <h1 className="font-bold text-xl">{data.operator.name}</h1>
                        </div>
                    </div>
                    <div className="h-80 w-44 border rounded-sm p-2">
                        <img
                            className="h-full w-full object-contain"
                            src={`${import.meta.env.BASE_URL}ops/${data.operator?.id}.webp`}
                            alt={data.operator?.name}
                        />
                    </div>
                </div>

                {generateLoadout && data.loadout ? (
                    <div className="flex flex-col gap-2 ml-4">
                        <div className="bg-gray-600 px-4 py-2 min-w-36 max-w-48">
                            <h1 className="font-bold text-lg">Primary</h1>
                            <p className="text-muted-foreground">
                                {data.loadout.primary.replaceAll("_", " ")}
                            </p>
                            <div className="h-14">
                                <img
                                    className="h-full w-full object-contain"
                                    src={`${import.meta.env.BASE_URL}weapons/${data.loadout.primary}.webp`}
                                    alt={data.loadout.primary}
                                />
                            </div>
                        </div>
                        <div className="bg-gray-600 px-4 py-2 max-w-48">
                            <h1 className="font-bold text-lg">Secondary</h1>
                            <p className="text-muted-foreground">
                                {data.loadout.secondary.replaceAll("_", " ")}
                            </p>
                            <div className="h-14">
                                <img
                                    className="h-full w-full object-contain"
                                    src={`${import.meta.env.BASE_URL}weapons/${data.loadout.secondary}.webp`}
                                    alt={data.loadout.secondary}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-gray-600 px-4 py-2 min-w-36 max-w-48">
                                <h1 className="font-bold text-lg">Gadget</h1>
                                <p className="text-muted-foreground">
                                    {data.loadout.gadget.replaceAll("_", " ")}
                                </p>
                                <div className="h-14">
                                    <img
                                        className="h-full w-full object-contain"
                                        src={`${import.meta.env.BASE_URL}gadget/${data.loadout.gadget}.webp`}
                                        alt={data.loadout.gadget}
                                    />
                                </div>
                            </div>
                            {data.loadout.utility ? (
                                <div className="bg-gray-600 px-4 py-2">
                                    <h1 className="font-bold text-lg">Utility</h1>
                                    <p className="text-muted-foreground">
                                        {data.loadout.utility.replaceAll("_", " ")}
                                    </p>
                                    <div className="h-14">
                                        <img
                                            className="h-full w-full object-contain"
                                            src={`${import.meta.env.BASE_URL}gadget/${data.loadout.utility}.webp`}
                                            alt={data.loadout.utility}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    )
}