import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <main>
      <nav>
        <div className="controls-wrapper">
          <div className="foward-back">

          </div>
          <div className="reload-button">

          </div>
        </div>
      </nav>
      <div className="window-wrapper flex justify-center items-center h-screen">
        <iframe src="https://example.com" className="w-[calc(100vw-var(--uni-margin)*2)]"></iframe>
      </div>
    </main>
  );
}
