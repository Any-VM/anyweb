import type { MetaFunction } from "@remix-run/node";
import type { Eruda as baseEruda } from "eruda";
import {
	ArrowLeft,
	ArrowRight,
	RotateCw,
	Settings2,
	Moon,
	Code,
	ArrowUpRightFromSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRef } from "react";

export const meta: MetaFunction = () => {
	return [
		{ title: "Anyweb" },
		{
			name: "description",
			content:
				"Anyweb is an advanced web service for bypassing internet censorship",
		},
	];
};
interface Eruda extends baseEruda {
	_isInit: boolean;
}
interface ProxyWindow extends Window {
	eruda: Eruda;
}

export default function Index() {
	const frameRef = useRef<HTMLIFrameElement>(null);

	return (
		<main className="h-screen overflow-clip">
			<nav className="fixed z-50 mb-14 flex h-14 w-screen items-center justify-center border-b bg-background p-2">
				<div className="flex flex-row justify-start space-x-2">
					<Button variant="outline" className="flex size-10 flex-col">
						<ArrowLeft className="size-4 text-foreground hover:scale-110" />
					</Button>

					<Button variant="outline" className="flex size-10 flex-col">
						<ArrowRight className="size-4 text-foreground hover:scale-110" />
					</Button>

					<Button variant="outline" className="flex size-10 flex-col">
						<RotateCw className="size-4 text-foreground hover:scale-110" />
					</Button>
				</div>
				<Input
					className="m-2 outline-none hover:shadow-muted focus:border-muted focus:bg-secondary/40 focus:shadow-muted/20"
					placeholder="Browse the web, uncensored"
				/>

				<div className="flex flex-row justify-end space-x-2">
					<Button variant="outline" className="flex size-10 flex-col">
						<Moon className="size-4 text-foreground hover:scale-110" />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="outline"
								className="focus-visible:ring-none flex size-10 flex-col focus-visible:ring-transparent"
							>
								<Settings2 className="size-4 text-foreground hover:scale-110 focus-visible:ring-0" />
							</Button>
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-64">
							<DropdownMenuLabel>Settings</DropdownMenuLabel>

							<DropdownMenuSeparator />

							<DropdownMenuItem
								onClick={() => {
									const proxyWindow = frameRef.current!
										.contentWindow as ProxyWindow;
									const proxyDocument =
										frameRef.current!.contentDocument;
									if (!proxyWindow || !proxyDocument) return;
									if (proxyWindow.eruda?._isInit) {
										proxyWindow.eruda.destroy();
									} else {
										const script =
											proxyDocument.createElement(
												"script",
											);
										script.src =
											"https://cdn.jsdelivr.net/npm/eruda";
										script.onload = () => {
											if (!proxyWindow) return;
											proxyWindow.eruda.init({
												defaults: {
													displaySize: 45,
													theme: "Atom One Dark",
												},
											});
											proxyWindow.eruda.show();
										};
										proxyDocument.head.appendChild(script);
									}
								}}
							>
								<Code className="mr-2 size-4" />
								<span>DevTools</span>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<ArrowUpRightFromSquare className="mr-2 size-4" />
								<span>Open in new tab</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</nav>

			<iframe
				src="https://react.dev"
				className="h-[95vh] w-full translate-y-14 select-none"
				title="Proxied Site"
				ref={frameRef}
			/>
		</main>
	);
}
