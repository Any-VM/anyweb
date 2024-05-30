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
		const search = params.get("search");
		if (search) {
			const src = decodeURIComponent(atob(search));

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
				setIframeSrc(src);
				setSearchHistory((prevHistory) => [...prevHistory, src]);
				setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
			} else {
				const duckDuckGoUrl = `https://duckduckgo.com/?q=${encodeURIComponent(src)}`;
				setIframeSrc(duckDuckGoUrl);
				setSearchHistory((prevHistory) => [
					...prevHistory,
					duckDuckGoUrl,
				]);
				setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
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
				title="AnyWeb Search"
				className="absolute bottom-0 h-[calc(100vh-56px)] w-screen"
				onLoad={(event) => {
					const iframe = event.target as HTMLIFrameElement;
					const iframeUrl = iframe.contentWindow?.location.href;
					if (iframeUrl) {
						setSearchHistory((prevHistory) => [
							...prevHistory,
							iframeUrl,
						]);
						setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
					}
				}}></iframe>
		</main>
	);
}
