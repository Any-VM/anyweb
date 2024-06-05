import { useEffect, useState } from 'react';
import { useLocation } from '@remix-run/react';
import moment from 'moment';
import particlesConfig from './particlesJsConfig.json';

import { Button } from '@/components/ui/button';

declare global {
	interface Window {
		particlesJS: (tagId: string, config: object) => void;
	}
}

export default function Landing() {
	const location = useLocation();
	useEffect(() => {
		// alla this shit just to make particles.js work. Someone should remake my particles.js config in tsParticles so ion have to deal with this shit
		const initParticlesJS = () => {
			if (window.particlesJS) {
				window.particlesJS('particles-js', particlesConfig);
				return true;
			} else {
				return false;
			}
		};

		const intervalId = setInterval(() => {
			const success = initParticlesJS();
			if (success) {
				clearInterval(intervalId);
			}
		}, 1000);

		return () => clearInterval(intervalId);
	}, [location.pathname]);

	const [isActive, setIsActive] = useState(false);
	const [forceIsActive, setForceIsActive] = useState(false);
	const handleMouseEnter = () => {
		setIsActive(true);
	};
	const handleMouseLeave = () => {
		setIsActive(false);
	};
	const handleClick = () => {
		setForceIsActive(!forceIsActive);
	};

	const [currentTime, setCurrentTime] = useState(moment());
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(moment());
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const [isHydrated, setIsHydrated] = useState(false);

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	return (
		<div className="h-screen w-screen select-none">
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link rel="preconnect" href="https://fonts.gstatic.com" />
			<link
				href="https://fonts.googleapis.com/css2?family=Italianno&display=swap"
				rel="stylesheet"
			/>

			<div
				className={`default-bg absolute bottom-[-10vh] left-[-10vw] h-[120vh] w-[120vw] select-none ${forceIsActive ? '' : ''}`}></div>
			<script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
			<div id="particles-js"></div>
			<div
				className="hero-hitbox absolute left-[50vw] top-[50vh] z-50 h-[55vh] w-[45vw] translate-x-[-50%] translate-y-[-50%] rounded-full"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				onClick={handleClick}
				onKeyDown={handleClick}
				role="button"
				tabIndex={0}></div>
			<div
				className={`hero absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] text-center font-['Italianno'] text-[200px] text-white transition-all duration-500 ${
					isActive ? 'hero-selected hero-hover' : ''
				} ${
					forceIsActive
						? 'hero-selected hero-clicked !top-[calc(50%-2.2rem)]'
						: ''
				}`}>
				Anyweb
			</div>
			<div
				className={`hero-line absolute left-[10vw] top-[59vh] !z-0 h-[0.25rem] w-[80vw] translate-y-[-50%] bg-[transparent] transition-all duration-300 ${
					forceIsActive ? 'hero-line-hover !bg-border' : ''
				}`}
			/>
			<div
				className={`absolute left-0 top-[60.5vh] !z-0 h-[0.25rem] w-[100vw] translate-y-[-50%] text-center italic text-[transparent] transition-all duration-300 ${
					forceIsActive ? 'clock text-[var(--border-light)]' : ''
				}`}>
				{isHydrated && <>{currentTime.format('dddd, h:mm:ss A')} </>}
			</div>
			<div
				className={`text-unimportant absolute left-0 top-[63.5vh] !z-0 h-[0.25rem] w-[100vw] translate-y-[-50%] text-center italic text-[transparent] transition-all duration-300
                ${isActive ? '!clock !text-[var(--border-light)] duration-300' : ''}
                ${forceIsActive ? '!text-unimportant top-[61vh] !text-[transparent] duration-150' : ''}`}>
				<span>Click Me!</span>
			</div>
			<a
				href="https://discord.gg/6FqaQxFEKp"
				className="absolute bottom-[0.5rem] left-[0.5rem] z-10">
				<Button variant="outline" className="flex size-10 flex-col">
					<svg
						className="button-content size-40"
						width="256px"
						height="256px"
						viewBox="0 0 192 192"
						xmlns="http://www.w3.org/2000/svg"
						fill="none">
						<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
						<g
							id="SVGRepo_tracerCarrier"
							strokeLinecap="round"
							strokeLinejoin="round"></g>
						<g id="SVGRepo_iconCarrier">
							<path
								stroke="#fff"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="12.48"
								d="m68 138-8 16c-10.19-4.246-20.742-8.492-31.96-15.8-3.912-2.549-6.284-6.88-6.378-11.548-.488-23.964 5.134-48.056 19.369-73.528 1.863-3.334 4.967-5.778 8.567-7.056C58.186 43.02 64.016 40.664 74 39l6 11s6-2 16-2 16 2 16 2l6-11c9.984 1.664 15.814 4.02 24.402 7.068 3.6 1.278 6.704 3.722 8.567 7.056 14.235 25.472 19.857 49.564 19.37 73.528-.095 4.668-2.467 8.999-6.379 11.548-11.218 7.308-21.769 11.554-31.96 15.8l-8-16m-68-8s20 10 40 10 40-10 40-10"></path>
							<ellipse
								cx="71"
								cy="101"
								fill="#fff"
								rx="13"
								ry="15"></ellipse>
							<ellipse
								cx="121"
								cy="101"
								fill="#fff"
								rx="13"
								ry="15"></ellipse>
						</g>
					</svg>
				</Button>
				<span className="absolute bottom-[0.5rem] left-[3rem] z-10">
					Discord
				</span>
			</a>
		</div>
	);
}
