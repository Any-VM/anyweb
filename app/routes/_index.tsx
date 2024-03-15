import type { MetaFunction } from "@remix-run/node";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCw, Settings2, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";

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

export default function Index() {
  return (
    <main className="h-screen overflow-clip">
      <nav className="fixed w-screen flex h-14 items-center justify-center border-b p-2 z-50 mb-14 bg-background">
        <div className="justify-start flex-row flex space-x-2">
          <Button variant="outline" className="size-10 flex flex-col">
            <ArrowLeft className="text-foreground size-6" />
          </Button>
          <Button variant="outline" className="size-10 flex flex-col">
            <ArrowRight className="text-foreground size-6" />
          </Button>
          <Button variant="outline" className="size-10 flex flex-col">
            <RotateCw className="text-foreground size-6" />
          </Button>
        </div>
        <Input className="m-2" placeholder="Browse the web, uncensored" />
        <div className="justify-end flex-row flex space-x-2">
          <Button variant="outline" className="size-10 flex flex-col">
            <Moon className="text-foreground size-6" />
          </Button>
          <Button variant="outline" className="size-10 flex flex-col">
            <Settings2 className="text-foreground size-6" />
          </Button>
        </div>
      </nav>
      <iframe
        src="https://react.dev"
        className="w-full h-[95vh] translate-y-14"
        title="Proxied Site"
      />
    </main>
  );
}
