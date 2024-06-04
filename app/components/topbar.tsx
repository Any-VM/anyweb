import {
	RotateCw,
	Settings2,
	Code,
	Home,
	Gamepad2,
	Github,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, Links } from "@remix-run/react";
import eruda from "eruda";
import { Path, To } from "react-router";
declare global {
	interface Navigator {
	  getHighEntropyValues?: (props: string[]) => Promise<{ [key: string]: string }>;
	}
  }
export default function TopBar() {
	const [erudaIsToggled, setErudaIsToggled] = useState(false);
	const erudaRef = useRef<any>(null);

	useEffect(() => {
		if (erudaIsToggled) {
		  import("eruda").then((eruda) => {
			if (!erudaRef.current) {
			  (eruda as any).init({
				useShadowDom: true,
				autoScale: true,
				defaults: {
				  displaySize: 45,
				  transparency: 0.8,
				  theme: "Arc Dark",
				},
			  });
			  erudaRef.current = eruda;
			}
			eruda.default.show();
		  });
		} else if (erudaRef.current) {
		  erudaRef.current.destroy();
		  erudaRef.current = null;
		}
	  }, [erudaIsToggled]);

	const loadEruda = () => setErudaIsToggled(!erudaIsToggled);

	const location = useLocation();
	const navigate = useNavigate();
	const [clicked, setClicked] = useState("");
	const [hovered, setHovered] = useState("");
	const delayNavigation = (to: To, delay: number | undefined) => {
		setTimeout(() => navigate(to), delay);
	};

	const pageSelectEffect = (path: string) => {
		let baseClass = "flex size-10 flex-col transition-all ";

		if (
			clicked === path ||
			(hovered === path && (!clicked || clicked === path))
		) {
			return `${baseClass} current-page`;
		}

		return baseClass;
	};

	useEffect(() => {
		setTimeout(() => {
			setClicked(location.pathname);
		}, 50);
	}, []);

	const handleMouseEnter = (path: React.SetStateAction<string>) => {
		setHovered(path);
	};

	const handleMouseLeave = () => {
		if (hovered !== clicked) {
			setHovered("");
		}
	};

	const handleClick = (path: string | ((prevState: string) => string) | Partial<Path>) => {
		setClicked(path.toString());
		delayNavigation(path.toString(), 300);
	};

	const proxSearchInput = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const handleKeyDown = (event: { metaKey: any; ctrlKey: any; key: string; preventDefault: () => void; }) => {
			if ((event.metaKey || event.ctrlKey) && event.key === ",") {
				event.preventDefault();
				if (proxSearchInput.current) {
					proxSearchInput.current.focus();
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const gamSearchInput = useRef<HTMLInputElement>(null);
	useEffect(() => {
		const handleKeyDown = (event: { metaKey: any; ctrlKey: any; key: string; preventDefault: () => void; }) => {
			if ((event.metaKey || event.ctrlKey) && event.key === ".") {
				event.preventDefault();
				if (gamSearchInput.current) {
					gamSearchInput.current.focus();
				}
			}
		};
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	const [isMacOS, setIsMacOS] = useState(false);
	useEffect(() => {
	  const checkMacOS = () => {
		if (navigator.userAgent) {
		  if (navigator.getHighEntropyValues) {
			navigator.getHighEntropyValues(["platform"])
			  .then((result: { [key: string]: string; }) => {
				setIsMacOS(result.platform === "macOS");
			  });
		  } else {
			const userAgent = navigator.userAgent.toLowerCase();
			setIsMacOS(userAgent.includes("mac"));
		  }
		} else {
		  const userAgent = navigator.userAgent.toLowerCase();
		  setIsMacOS(userAgent.includes("mac"));
		}
	  };
	  checkMacOS();
	}, []);

	const [inputValueP, setInputValueP] = useState("");
    const [inputValueG, setInputValueG] = useState("");
	const handleInputChangeP = (e: { target: { value: React.SetStateAction<string>; }; }) => {
		setInputValueP(e.target.value);
	};
    const handleInputChangeG = (e: { target: { value: React.SetStateAction<string>; }; }) => {
		setInputValueG(e.target.value);
	};
	const handleKeyDownPSearch = (event: { key: string; preventDefault: () => void; }) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const encodedSearch = btoa(encodeURIComponent(inputValueP));
			navigate(`/p?search=${encodedSearch}`);
		}
	};
	const handleKeyDownGSearch = (event: { key: string; preventDefault: () => void; }) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const encodedSearch = btoa(encodeURIComponent(inputValueG));
			navigate(`/g?search=${encodedSearch}`);
		}
	};

	return (
		<nav className="fixed z-50 w-screen items-center justify-center border-b bg-background p-2">
			<div className="flex flex-grow space-x-2">
				<Button
					variant="outline"
					className={pageSelectEffect("/")}
					onMouseEnter={() => handleMouseEnter("/")}
					onMouseLeave={handleMouseLeave}
					onClick={() => handleClick("/")}>
					<Home className="button-content" />
				</Button>

				<Button
					variant="outline"
					className={pageSelectEffect("/g")}
					onMouseEnter={() => handleMouseEnter("/g")}
					onMouseLeave={handleMouseLeave}
					onClick={() => handleClick("/g")}>
					<Gamepad2 className="button-content size-[1.125rem]" />
				</Button>

				<Button variant="outline" className="flex size-10 flex-col">
					<RotateCw className="button-content hover:rotate-[360deg]" />
				</Button>

				<div className="relative flex-grow items-center">
					<Input
						ref={proxSearchInput}
						className="input-text-blur z-30 flex-grow outline-none transition-all"
						placeholder="Browse the web, uncensored"
						value={inputValueP}
						onChange={handleInputChangeP}
						onKeyDown={handleKeyDownPSearch}
					/>
					<kbd className="pointer-events-none absolute right-2 top-[0.625rem] z-20 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">
							{isMacOS ? "⌘" : "Ctrl"}
						</span>
						,
					</kbd>
				</div>

				<div className="relative flex items-center">
					<Input
						ref={gamSearchInput}
						className="w-[250px] flex-shrink outline-none transition-all focus:w-[350px]"
						placeholder="Search games"
						value={inputValueG}
						onChange={handleInputChangeG}
						onKeyDown={handleKeyDownGSearch}
					/>
					<kbd className="pointer-events-none absolute right-2 top-[0.625rem] z-20 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
						<span className="text-xs">
							{isMacOS ? "⌘" : "Ctrl"}
						</span>
						.
					</kbd>
				</div>

				<Dialog>
					<DialogTrigger>
						<Button
							variant="outline"
							className="flex size-10 flex-col">
							<svg
								className="button-content size-6"
								viewBox="-4.8 -4.8 57.60 57.60"
								xmlns="http://www.w3.org/2000/svg"
								fill="transparent"
								stroke="#fff"
								strokeWidth="2.5">
								<g id="SVGRepo_bgCarrier"></g>
								<g
									id="SVGRepo_tracerCarrier"
									strokeLinecap="round"
									strokeLinejoin="round"></g>
								<g id="SVGRepo_iconCarrier">
									<defs></defs>
									<path d="M4.21,22.12a2.87,2.87,0,0,0,0,3.77L22.12,43.8a2.87,2.87,0,0,0,3.77,0l17.9-17.91a2.85,2.85,0,0,0,0-3.77L25.89,4.21A2.68,2.68,0,0,0,24,3.51h0a2.66,2.66,0,0,0-1.88.71Z"></path>
									<line
										x1="26.33"
										y1="17.85"
										x2="30.15"
										y2="21.67"></line>
									<line
										x1="17.4"
										y1="8.92"
										x2="21.67"
										y2="13.19"></line>
									<circle cx="24" cy="32.41" r="3.3"></circle>
									<circle cx="24" cy="15.52" r="3.3"></circle>
									<circle cx="32.48" cy="24" r="3.3"></circle>
									<line
										x1="24"
										y1="29.11"
										x2="24"
										y2="18.82"></line>
								</g>
							</svg>
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Git Links and Other Info</DialogTitle>
							<DialogDescription>
								Links to AnyVM github, the project repo,
								contributors, and other hosting instructions
							</DialogDescription>
							<hr />
							<div className="flex">
								<div className="w-[50%]">
									<Link
										className="flex p-2"
										to="https://github.com/any-vm"
										prefetch="intent">
										<Button
											variant="outline"
											className="focus-visible:ring-none flex size-10 flex-col focus-visible:ring-transparent">
											<Github className="button-content" />
										</Button>
										<span className="m-2 place-self-center">
											AnyVM GitHub
										</span>
									</Link>
									<Link
										className="flex p-2"
										to="https://github.com/any-vm/anyweb"
										prefetch="intent">
										<Button
											variant="outline"
											className="focus-visible:ring-none flex size-10 flex-col focus-visible:ring-transparent">
											<svg
												className="button-content size-10 translate-x-[0.675rem] translate-y-[0.1rem] hover:translate-x-[0.7425rem] hover:translate-y-[0.11rem]"
												xmlns="http://www.w3.org/2000/svg"
												version="1.1"
												width="20"
												height="20">
												<g
													xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
													id="ViewLayer_LineSet"
													groupmode="lineset"
													label="ViewLayer_LineSet">
													<g
														xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
														groupmode="layer"
														id="strokes"
														label="strokes">
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.270, 12.979 9.276, 12.985 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.331, 5.478 7.318, 5.516 7.297, 5.578 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.364, 5.391 7.345, 5.442 7.331, 5.478 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.496, 5.091 7.483, 5.116 7.473, 5.137 7.465, 5.154 7.456, 5.174 7.431, 5.233 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.456, 5.174 7.462, 5.161 7.469, 5.147 7.473, 5.137 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.748, 4.679 7.723, 4.714 7.704, 4.741 7.699, 4.747 7.695, 4.753 7.688, 4.762 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.708, 4.734 7.688, 4.762 7.683, 4.771 7.665, 4.799 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.086, 4.293 8.064, 4.313 8.044, 4.333 8.011, 4.368 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.553, 3.934 8.528, 3.950 8.518, 3.956 8.506, 3.965 8.484, 3.979 8.477, 3.983 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.528, 3.950 8.498, 3.969 8.477, 3.983 8.433, 4.015 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.911, 3.741 8.873, 3.759 8.864, 3.763 8.837, 3.777 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.873, 3.759 8.894, 3.749 8.895, 3.749 8.901, 3.746 8.930, 3.733 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.237, 3.610 9.199, 3.624 9.149, 3.643 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.276, 3.596 9.237, 3.610 9.341, 3.575 9.285, 3.594 9.276, 3.596 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 10.383, 3.326 10.343, 3.334 10.278, 3.345 10.383, 3.326 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.465, 5.154 7.432, 5.226 7.398, 5.306 7.364, 5.391 7.331, 5.478 7.300, 5.565 7.273, 5.648 7.248, 5.725 7.228, 5.792 7.211, 5.849 7.198, 5.898 7.186, 5.949 7.172, 5.998 7.158, 6.056 7.142, 6.123 7.126, 6.197 7.110, 6.276 7.094, 6.361 7.079, 6.450 7.064, 6.541 7.050, 6.634 7.038, 6.727 7.026, 6.820 7.015, 6.914 7.005, 7.007 6.995, 7.101 6.987, 7.195 6.979, 7.288 6.973, 7.383 6.968, 7.477 6.965, 7.571 6.960, 7.665 6.957, 7.759 6.955, 7.853 6.954, 7.947 6.953, 8.040 6.952, 8.134 6.952, 8.227 6.951, 8.320 6.951, 8.414 6.951, 8.507 6.951, 8.600 6.951, 8.692 6.951, 8.782 6.951, 8.869 6.951, 8.952 6.945, 9.027 6.932, 9.091 6.905, 9.139 6.862, 9.169 6.805, 9.185 6.736, 9.191 6.658, 9.191 6.575, 9.191 6.487, 9.193 6.395, 9.191 6.302, 9.191 6.209, 9.191 6.116, 9.191 6.023, 9.191 5.930, 9.191 5.837, 9.191 5.744, 9.191 5.651, 9.191 5.558, 9.191 5.465, 9.191 5.372, 9.191 5.279, 9.191 5.186, 9.191 5.093, 9.191 5.000, 9.191 4.907, 9.191 4.814, 9.191 4.721, 9.191 4.632, 9.191 4.548, 9.191 4.473, 9.191 4.411, 9.192 4.360, 9.195 4.332, 9.202 4.322, 9.215 4.331, 9.236 4.362, 9.266 4.411, 9.305 4.473, 9.353 4.547, 9.409 4.624, 9.468 4.696, 9.522 4.755, 9.566 4.794, 9.596 4.822, 9.617 4.849, 9.637 4.887, 9.666 4.945, 9.708 5.010, 9.760 5.082, 9.814 5.149, 9.865 5.205, 9.907 5.251, 9.942 5.294, 9.974 5.338, 10.008 5.388, 10.045 5.442, 10.086 5.501, 10.131 5.561, 10.176 5.623, 10.223 5.683, 10.269 5.740, 10.312 5.790, 10.350 5.833, 10.382 5.874, 10.413 5.919, 10.447 5.973, 10.488 6.040, 10.539 6.114, 10.595 6.184, 10.646 6.241, 10.691 6.278, 10.719 6.304, 10.738 6.329, 10.758 6.369, 10.786 6.422, 10.828 6.492, 10.881 6.566, 10.936 6.633, 10.988 6.688, 11.029 6.733, 11.063 6.774, 11.095 6.818, 11.127 6.868, 11.165 6.924, 11.208 6.984, 11.253 7.045, 11.299 7.106, 11.346 7.165, 11.390 7.220, 11.432 7.270, 11.469 7.314, 11.503 7.356, 11.535 7.402, 11.569 7.457, 11.611 7.524, 11.662 7.597, 11.717 7.666, 11.769 7.722, 11.811 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.779, 11.852 7.783, 11.855 7.777, 11.849 7.758, 11.837 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.722, 11.811 7.762, 11.840 7.769, 11.846 7.773, 11.849 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.795, 11.865 7.817, 11.881 7.799, 11.866 7.792, 11.862 7.800, 11.869 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.769, 11.846 7.786, 11.860 7.812, 11.880 7.851, 11.909 7.908, 11.953 7.979, 12.006 8.052, 12.061 8.119, 12.112 8.172, 12.152 8.215, 12.185 8.255, 12.215 8.297, 12.247 8.348, 12.285 8.406, 12.329 8.467, 12.375 8.529, 12.422 8.589, 12.468 8.647, 12.511 8.700, 12.552 8.749, 12.589 8.794, 12.623 8.838, 12.656 8.885, 12.692 8.941, 12.734 9.007, 12.784 9.078, 12.838 9.146, 12.889 9.201, 12.931 9.239, 12.960 9.268, 12.981 9.297, 13.003 9.340, 13.034 9.396, 13.078 9.466, 13.132 9.539, 13.187 9.605, 13.237 9.656, 13.275 9.697, 13.306 9.735, 13.335 9.777, 13.367 9.828, 13.406 9.887, 13.450 9.950, 13.498 10.013, 13.545 10.072, 13.590 10.128, 13.633 10.180, 13.672 10.229, 13.709 10.274, 13.743 10.319, 13.777 10.368, 13.814 10.425, 13.857 10.491, 13.907 10.560, 13.959 10.626, 14.007 10.681, 14.050 10.719, 14.080 10.748, 14.101 10.770, 14.118 10.798, 14.139 10.834, 14.166 10.876, 14.195 10.917, 14.216 10.949, 14.221 10.971, 14.208 10.982, 14.174 10.986, 14.123 10.987, 14.058 10.987, 13.983 10.987, 13.898 10.987, 13.809 10.987, 13.716 10.987, 13.623 10.987, 13.530 10.987, 13.437 10.987, 13.344 10.987, 13.251 10.987, 13.158 10.987, 13.065 10.987, 12.972 10.987, 12.879 10.987, 12.787 10.987, 12.697 10.987, 12.610 10.988, 12.528 10.998, 12.453 11.024, 12.390 11.074, 12.342 11.155, 12.312 11.257, 12.297 11.371, 12.291 11.486, 12.290 11.594, 12.290 11.694, 12.290 11.790, 12.290 11.883, 12.290 11.977, 12.290 12.070, 12.290 12.163, 12.290 12.256, 12.290 12.349, 12.290 12.442, 12.290 12.535, 12.290 12.628, 12.290 12.721, 12.290 12.814, 12.290 12.907, 12.290 13.000, 12.290 13.093, 12.290 13.186, 12.290 13.279, 12.290 13.372, 12.290 13.465, 12.290 13.558, 12.290 13.651, 12.290 13.744, 12.290 13.837, 12.290 13.930, 12.288 14.023, 12.290 14.116, 12.290 14.209, 12.290 14.302, 12.290 14.395, 12.290 14.488, 12.290 14.581, 12.290 14.674, 12.290 14.767, 12.290 14.860, 12.290 14.953, 12.290 15.049, 12.290 15.148, 12.290 15.252, 12.290 15.363, 12.289 15.471, 12.281 15.568, 12.260 15.643, 12.218 15.690, 12.151 15.715, 12.065 15.724, 11.968 15.725, 11.866 15.725, 11.767 15.723, 11.670 15.725, 11.577 15.725, 11.483 15.725, 11.390 15.723, 11.297 15.725, 11.204 15.725, 11.111 15.725, 11.018 15.723, 10.925 15.725, 10.832 15.725, 10.739 15.725, 10.646 15.723, 10.553 15.725, 10.460 15.725, 10.367 15.725, 10.274 15.723, 10.181 15.725, 10.088 15.725, 9.995 15.725, 9.902 15.723, 9.808 15.725, 9.712 15.725, 9.613 15.724, 9.512 15.715, 9.415 15.689, 9.330 15.642, 9.265 15.567, 9.223 15.471, 9.200 15.363, 9.192 15.252, 9.191 15.148, 9.191 15.048, 9.193 14.953, 9.191 14.860, 9.191 14.767, 9.191 14.674, 9.191 14.581, 9.191 14.488, 9.191 14.395, 9.191 14.302, 9.191 14.209, 9.191 14.116, 9.191 14.023, 9.191 13.930, 9.191 13.837, 9.191 13.744, 9.191 13.651, 9.191 13.558, 9.191 13.465, 9.191 13.372, 9.191 13.279, 9.191 13.186, 9.191 13.093, 9.191 13.000, 9.191 12.907, 9.191 12.814, 9.191 12.721, 9.191 12.628, 9.191 12.535, 9.191 12.442, 9.191 12.349, 9.191 12.256, 9.191 12.163, 9.191 12.070, 9.191 11.977, 9.191 11.883, 9.191 11.790, 9.191 11.694, 9.191 11.594, 9.191 11.486, 9.191 11.371, 9.191 11.257, 9.185 11.155, 9.169 11.074, 9.139 11.024, 9.091 10.998, 9.027 10.988, 8.952 10.987, 8.869 10.987, 8.782 10.985, 8.692 10.987, 8.600 10.987, 8.507 10.987, 8.414 10.987, 8.321 10.987, 8.228 10.987, 8.135 10.987, 8.042 10.985, 7.949 10.988, 7.856 10.989, 7.763 10.992, 7.671 10.997, 7.578 11.003, 7.486 11.013, 7.395 11.026, 7.305 11.041, 7.215 11.066, 7.128 11.094, 7.043 11.128, 6.961 11.164, 6.881 11.208, 6.811 11.251, 6.745 11.295, 6.686 11.338, 6.635 11.381, 6.592 11.423, 6.554 11.467, 6.524 11.512, 6.497 11.562, 6.473 11.618, 6.448 11.684, 6.422 11.756, 6.396 11.835, 6.370 11.917, 6.348 12.001, 6.330 12.088, 6.316 12.176, 6.305 12.265, 6.298 12.355, 6.292 12.446, 6.287 12.537, 6.287 12.629, 6.286 12.722, 6.285 12.814, 6.285 12.907, 6.285 13.000, 6.285 13.093, 6.285 13.186, 6.285 13.279, 6.285 13.372, 6.285 13.465, 6.285 13.558, 6.285 13.651, 6.285 13.744, 6.285 13.837, 6.285 13.930, 6.283 14.023, 6.285 14.116, 6.285 14.209, 6.285 14.302, 6.285 14.395, 6.285 14.488, 6.285 14.581, 6.285 14.674, 6.285 14.767, 6.285 14.860, 6.285 14.953, 6.285 15.049, 6.285 15.148, 6.285 15.252, 6.285 15.363, 6.284 15.471, 6.277 15.568, 6.258 15.642, 6.220 15.690, 6.162 15.715, 6.086 15.724, 5.998 15.725, 5.904 15.725, 5.810 15.725, 5.716 15.725, 5.623 15.725, 5.530 15.725, 5.437 15.725, 5.344 15.725, 5.251 15.725, 5.158 15.725, 5.065 15.723, 4.972 15.725, 4.879 15.725, 4.786 15.725, 4.693 15.723, 4.600 15.725, 4.507 15.725, 4.414 15.725, 4.321 15.723, 4.228 15.725, 4.135 15.725, 4.042 15.725, 3.948 15.723, 3.855 15.725, 3.755 15.725, 3.651 15.724, 3.542 15.715, 3.436 15.689, 3.341 15.642, 3.268 15.567, 3.222 15.471, 3.196 15.363, 3.187 15.252, 3.186 15.148, 3.186 15.048, 3.188 14.953, 3.186 14.860, 3.186 14.767, 3.186 14.674, 3.186 14.581, 3.186 14.488, 3.186 14.395, 3.186 14.302, 3.186 14.209, 3.186 14.116, 3.186 14.023, 3.186 13.930, 3.186 13.837, 3.186 13.744, 3.186 13.651, 3.186 13.558, 3.186 13.465, 3.186 13.372, 3.186 13.279, 3.186 13.186, 3.186 13.093, 3.186 13.000, 3.186 12.907, 3.186 12.814, 3.188 12.721, 3.186 12.628, 3.186 12.534, 3.186 12.441, 3.186 12.348, 3.187 12.254, 3.187 12.161, 3.188 12.067, 3.191 11.973, 3.191 11.879, 3.194 11.785, 3.197 11.691, 3.203 11.597, 3.206 11.503, 3.211 11.410, 3.217 11.316, 3.225 11.222, 3.230 11.129, 3.238 11.036, 3.246 10.942, 3.257 10.849, 3.265 10.756, 3.276 10.662, 3.287 10.569, 3.301 10.476, 3.312 10.383, 3.326 10.291, 3.342 10.200, 3.360 10.115, 3.375 10.034, 3.391 9.961, 3.406 9.894, 3.421 9.834, 3.436 9.780, 3.447 9.731, 3.459 9.683, 3.472 9.631, 3.486 9.570, 3.503 9.498, 3.525 9.418, 3.551 9.328, 3.578 9.285, 3.594 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.235, 12.954 9.249, 12.964 9.251, 12.966 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.235, 12.954 9.253, 12.969 9.262, 12.975 9.267, 12.977 9.257, 12.971 9.251, 12.966 9.235, 12.954 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.284, 12.992 9.303, 13.006 9.287, 12.994 9.281, 12.989 9.276, 12.985 9.284, 12.992 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.287, 12.994 9.290, 12.995 9.303, 13.006 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.498, 3.969 8.441, 4.008 8.382, 4.051 8.323, 4.095 8.267, 4.140 8.214, 4.182 8.161, 4.225 8.112, 4.269 8.064, 4.313 8.018, 4.359 7.973, 4.407 7.928, 4.459 7.882, 4.510 7.838, 4.566 7.791, 4.622 7.748, 4.679 7.708, 4.734 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.105, 6.307 7.093, 6.371 7.110, 6.276 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.683, 4.771 7.671, 4.788 7.639, 4.839 7.609, 4.891 7.580, 4.938 7.553, 4.986 7.525, 5.036 7.496, 5.091 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.483, 5.116 7.491, 5.102 7.503, 5.078 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.781, 11.848 7.786, 11.856 7.789, 11.859 7.781, 11.848 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.149, 3.643 9.061, 3.678 8.983, 3.710 8.911, 3.741 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.864, 3.763 8.850, 3.770 8.797, 3.796 8.749, 3.823 8.703, 3.848 8.657, 3.874 8.605, 3.903 8.553, 3.934 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 7.665, 4.799 7.637, 4.844 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 8.837, 3.777 8.793, 3.799 "
														/>
														<path
															fill="none"
															strokeWidth="1.25"
															strokeLinecap="butt"
															strokeOpacity="1.0"
															stroke="rgb(255, 255, 255)"
															strokeLinejoin="round"
															d=" M 9.472, 14.969 8.942, 14.568 8.908, 14.542 8.411, 14.167 8.207, 14.012 7.881, 13.766 7.507, 13.482 7.351, 13.364 6.821, 12.963 6.806, 12.952 6.291, 12.562 6.106, 12.422 5.761, 12.161 5.405, 11.892 5.231, 11.760 4.705, 11.362 4.701, 11.359 4.171, 10.958 4.004, 10.832 3.640, 10.556 3.304, 10.301 3.110, 10.155 2.603, 9.771 2.580, 9.754 2.050, 9.353 1.790, 9.156 1.790, 10.156 1.790, 10.418 2.050, 10.614 2.580, 11.015 2.603, 11.033 3.110, 11.417 3.304, 11.563 3.640, 11.818 4.004, 12.093 4.171, 12.219 4.701, 12.620 4.705, 12.623 5.231, 13.021 5.405, 13.153 5.761, 13.422 6.106, 13.683 6.291, 13.823 6.806, 14.213 6.821, 14.225 7.351, 14.626 7.507, 14.743 7.881, 15.027 8.207, 15.273 8.411, 15.428 8.908, 15.804 8.942, 15.829 9.472, 16.230 9.608, 16.334 10.002, 16.632 10.309, 16.864 10.532, 17.033 11.009, 17.394 11.062, 17.434 11.375, 17.671 11.375, 16.671 11.375, 16.409 11.062, 16.173 11.009, 16.133 10.532, 15.771 10.309, 15.603 10.002, 15.370 9.608, 15.072 9.472, 14.969 "
														/>
													</g>
												</g>
											</svg>
										</Button>
										<span className="m-2 place-self-center">
											AnyWeb Github
										</span>
									</Link>
								</div>
								<div className="w-[50%] bg-[#ffffff7f]">
									dont know what to put here
								</div>
							</div>
							<br />
							Contributors:
							<hr />
							<Link
								prefetch="intent"
								to="https://github.com/any-vm/anyweb/graphs/contributors"
								className="contrib">
								<kbd>
									<img
										src="https://contrib.rocks/image?repo=anyvm/anyweb"
										alt="Contributors"
									/>
								</kbd>
							</Link>
						</DialogHeader>
					</DialogContent>
				</Dialog>

				<Sheet>
					<SheetTrigger>
						<Button
							variant="outline"
							className="focus-visible:ring-none flex size-10 flex-col focus-visible:ring-transparent">
							<Settings2 className="button-content focus-visible:ring-0" />
						</Button>
					</SheetTrigger>

					<SheetContent>
						<SheetHeader>
							<SheetTitle>Settings</SheetTitle>
						</SheetHeader>

						<RadioGroup defaultValue="option-one">
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="option-one"
									id="option-one"
								/>
								<Label htmlFor="option-one">
									Embeded (default)
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="option-two"
									id="option-two"
								/>
								<Label htmlFor="option-two">New Tab</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="option-three"
									id="option-three"
								/>
								<Label htmlFor="option-three">
									about:blank Tab
								</Label>
							</div>
						</RadioGroup>

						<SheetHeader>
							<SheetTitle>Cloaking</SheetTitle>
						</SheetHeader>

						<SheetHeader>
							<SheetTitle>DevTools</SheetTitle>
						</SheetHeader>

						<Button
							variant="outline"
							className="flex size-10 flex-col"
							onClick={loadEruda}>
							<Code className="button-content focus-visible:ring-0" />
						</Button>
					</SheetContent>
				</Sheet>
			</div>
		</nav>
	);
}
