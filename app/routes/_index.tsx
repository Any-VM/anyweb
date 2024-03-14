/* eslint-disable jsx-a11y/iframe-has-title */
import type { MetaFunction } from "@remix-run/node";
import { Settings2 } from "lucide-react";
import { SunMoon } from "lucide-react";

export const meta: MetaFunction = () => {
    return [
        { title: "Anyweb" },
        { name: "description", content: "Anyweb is an advanced web service for bypassing internet censorship" },
    ];
};

export default function Index() {
    return (
        <main>
            <nav className="absolute top-0 left-0 w-screen h-[var(--nav-height)]">
                <div className="nav-controls-wrapper">
                    <div className="foward-back-wrapper wrapper-base"></div>
                    <div className="reload-button-wrapper wrapper-base"></div>
                </div>
                <div className="search-wrapper absolute w-[70vw] h-[calc(var(--nav-height)-var(--uni-margin))] top-[calc(var(--nav-height)-(var(--nav-height)-var(--uni-margin)*2)-var(--uni-margin))] wrapper-base bg-slate-800 bg-opacity-25 uni-border search-effect border-slate-400 left-[calc((var(--nav-height)-var(--uni-margin))*3+var(--uni-margin)*3-var(--border-thickness)*3)]"></div>
                <div className="controls-wrapper">
                    <div className="light-dark-wrapper wrapper-base">
                        <SunMoon />
                    </div>
                    <div className="settings-wrapper wrapper-base">
                        <Settings2 />
                    </div>
                </div>
            </nav>
            <hr className="absolute top-[calc(var(--nav-height)+var(--uni-margin))] w-screen uni-border-half wrapper-base" />
            <div className="window-wrapper flex justify-center bottom-0 h-[calc(100vh-var(--uni-margin)*2-var(--nav-height))]">
                <iframe
                    src=""
                    className="absolute w-[calc(100vw-var(--uni-margin)*2)] bottom-[var(--uni-margin)] h-[calc(100vh-var(--uni-margin)*3-var(--nav-height)-var(--border-thickness))] uni-border wrapper-base"
                ></iframe>
            </div>
        </main>
    );
}
