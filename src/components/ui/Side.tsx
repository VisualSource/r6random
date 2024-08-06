import r6operators from "r6operators";

const SLOT_ANGLE = 360 / 12;
const REEL_RADIUS = 150;

export const Side: React.FC<{ id: string, index: number, }> = ({ id, index }) => {
    return (
        <div
            data-name={id}
            data-index={index}
            data-deg={SLOT_ANGLE * index}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: SVG
            dangerouslySetInnerHTML={{
                __html:
                    r6operators[id as keyof typeof r6operators]?.toSVG({
                        class: "object-fill h-full w-full",
                    }) ?? "",
            }}
            key={`card-${id}`}
            className="slot"
            style={{
                transform: `rotateX(${SLOT_ANGLE * index}deg) translateZ(${REEL_RADIUS}px)`,
            }}
        />
    );
}