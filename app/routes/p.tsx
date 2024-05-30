import type { MetaFunction } from "@remix-run/node";
import React, { useEffect, useState } from "react";
import { useLocation, Link } from "@remix-run/react";
import TopBar from "../components/topbar";

export const meta: MetaFunction = () => {
	return [
		{ title: "AnyWeb" },
		{
			name: "description",
			content:
				"AnyWeb is a sleek and fast web service for bypassing internet censorship",
		},
	];
};

export default function Index() {
	const location = useLocation();
	const [iframeSrc, setIframeSrc] = useState("");
	const [searchHistory, setSearchHistory] = useState<string[]>([]);
	const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const q = params.get("q");
		if (q) {
			const src = decodeURIComponent(atob(q));
	
			// fancy giberish to check if src is a valid URL or just a search query
			const urlPattern = new RegExp(
				"^(https?:\\/\\/)?" +
				"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" +
				"((\\d{1,3}\\.){3}\\d{1,3}))" +
				"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" +
				"(\\?[;&a-z\\d%_.~+=-]*)?" +
				"(\\#[-a-z\\d_]*)?$",
				"i",
			);
			if (urlPattern.test(src)) {
				const handleMessage = (event: MessageEvent) => {
					setIframeSrc(event.data);
					setSearchHistory((prevHistory: string[]) => [...prevHistory, src]);
					setCurrentHistoryIndex((prevIndex: number) => prevIndex + 1);
				};
	
				navigator.serviceWorker.addEventListener('message', handleMessage);
				return () => {
					navigator.serviceWorker.removeEventListener('message', handleMessage);
				};
			} else {
				const duckDuckGoUrl = `https://duckduckgo.com/?q=${encodeURIComponent(src)}`;				
				const handleMessage = (event: MessageEvent) => {					
					setIframeSrc(event.data);
					setSearchHistory((prevHistory: string[]) => [...prevHistory, duckDuckGoUrl]);
					setCurrentHistoryIndex((prevIndex: number) => prevIndex + 1);
				};
	
				navigator.serviceWorker.addEventListener('message', handleMessage);
				return () => {
					navigator.serviceWorker.removeEventListener('message', handleMessage);
				};
			}
		}
	}, [location]);
	
	useEffect(() => {
		localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
	}, [searchHistory]);

	const goBack = () => {
		if (currentHistoryIndex > 0) {
			setCurrentHistoryIndex((prevIndex) => prevIndex - 1);
			setIframeSrc(searchHistory[currentHistoryIndex - 1]);
		}
	};

	const goForward = () => {
		if (currentHistoryIndex < searchHistory.length - 1) {
			setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
			setIframeSrc(searchHistory[currentHistoryIndex + 1]);
		}
	};

	// if someone other then me reads this, its easy to make forward and back buttons, just use the goBack and goForward functions on a button or smth, u can figure this out. Also you can use the searchHistory array to make a history view type thing

	return (
        <main className="h-screen overflow-hidden">
            <Link to="/" prefetch="render" />
            <Link to="/g" prefetch="render" />

            <TopBar />

            <iframe
                src={iframeSrc}
                sandbox="allow-same-origin allow-scripts"
                onLoad={(event) => {
                    const iframe = event.target as HTMLIFrameElement;
                    const originalUrl = iframe.contentWindow?.location.href;
                    if (originalUrl) {
                        setSearchHistory((prevHistory) => [
                            ...prevHistory,
                            originalUrl,
                        ]);
                        setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
                    }
                }}
            ></iframe>
        </main>
    );
}