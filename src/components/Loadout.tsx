import { cn } from "@/lib/utils";
import type { Operator } from "r6operators";
import { useRef } from "react";

export type OperatorLoadout = {
	operator: Operator;
	loadout: {
		primary: {
			weapon: string,
			loadout: Record<string, string> | null
		};
		secondary: {
			weapon: string,
			loadout: Record<string, string> | null
		}
		gadget: string;
		utility: string | null;
	} | null;
};

export const Loadout: React.FC<{
	show: boolean;
	data: OperatorLoadout | null;
	generateLoadout: boolean;
}> = ({ show, data, generateLoadout }) => {
	const loadoutRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={loadoutRef}
			className={cn("flex justify-center", {
				"animate-in zoom-in-75 duration-1000": show,
				hidden: !show,
			})}
		>
			<div className="flex flex-col">
				<div className="flex">
					<div
						className="w-16 h-16"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: SVG
						dangerouslySetInnerHTML={{ __html: data?.operator.toSVG() ?? "" }}
					/>
					<div className="flex items-center">
						<h1 className="font-bold text-xl">
							{data?.operator.name ?? "Unknown"}
						</h1>
					</div>
				</div>
				<div className="h-80 w-44 border rounded-sm p-2">
					<img
						className="h-full w-full object-contain"
						src={`${import.meta.env.BASE_URL}ops/${data?.operator?.id}.webp`}
						alt={data?.operator?.name}
					/>
				</div>
			</div>

			{generateLoadout && data?.loadout ? (
				<div className="flex flex-col gap-2 ml-4">
					<section className="flex gap-2">
						<div className="bg-gray-600 px-4 py-2 min-w-36 max-w-48">
							<h1 className="font-bold text-lg">Primary</h1>
							<p className="text-muted-foreground">
								{data.loadout.primary.weapon.replaceAll("_", " ")}
							</p>
							<div className="h-14">
								<img
									className="h-full w-full object-contain"
									src={`${import.meta.env.BASE_URL}weapons/${data.loadout.primary.weapon}.webp`}
									alt={data.loadout.primary.weapon}
								/>
							</div>
						</div>
						{data.loadout.primary.loadout ? (
							<div className="flex flex-col justify-start gap-1.5">
								{Object.entries(data.loadout.primary.loadout).map(([name, value], i) => (
									<div className="bg-gray-600 px-4 py-2 min-w-48 first-letter:capitalize" key={`${name}_${i}_${value}`}><span className="text-muted-foreground">{name.replaceAll("-", " ")}</span>: {value}</div>
								))}
							</div>
						) : null}
					</section>
					<section className="flex gap-2">
						<div className="bg-gray-600 px-4 py-2 max-w-48">
							<h1 className="font-bold text-lg">Secondary</h1>
							<p className="text-muted-foreground">
								{data.loadout.secondary.weapon.replaceAll("_", " ")}
							</p>
							<div className="h-14">
								<img
									className="h-full w-full object-contain"
									src={`${import.meta.env.BASE_URL}weapons/${data.loadout.secondary.weapon}.webp`}
									alt={data.loadout.secondary.weapon}
								/>
							</div>
						</div>
						{data.loadout.secondary.loadout ? (
							<div className="flex flex-col justify-start gap-1.5">
								{Object.entries(data.loadout.secondary.loadout).map(([name, value], i) => (
									<div className="bg-gray-600 px-4 py-2 min-w-48 first-letter:capitalize" key={`${name}_${i}_${value}`}><span className="text-muted-foreground">{name.replaceAll("-", " ")}</span>: {value}</div>
								))}
							</div>
						) : null}
					</section>
					<section className="flex gap-2">
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
					</section>
				</div>
			) : null}
		</div>
	);
};
