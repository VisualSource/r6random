import { cn } from "@/lib/utils";
import { useRouter } from "@/Router";

export const TeamSelector: React.FC = () => {
	const router = useRouter();
	return (
		<div className="w-full flex justify-center my-6">
			<button
				className={cn(
					"h-14 w-52 -skew-x-12 transition-colors duration-300 ease-in font-bold text-xl",
					{
						"bg-orange-500 hover:bg-orange-500/90": router.team === "attackers",
						"bg-gradient-to-l from-gray-700 via-gray-800 to-transparent":
							router.team !== "attackers",
					},
				)}
				onClick={() => router.setTeam("attackers")}
				type="button"
			>
				Attacker
			</button>
			<button
				className={cn(
					"h-14 w-52 -skew-x-12 transition-colors duration-300 ease-in font-bold text-xl",
					{
						"bg-blue-500 hover:bg-blue-500/90": router.team === "defenders",
						"bg-gradient-to-r from-gray-700 via-gray-800 to-transparent":
							router.team !== "defenders",
					},
				)}
				onClick={() => router.setTeam("defenders")}
				type="button"
			>
				Defender
			</button>
		</div>
	);
};
