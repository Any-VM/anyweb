import type { MetaFunction } from "@remix-run/node";
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
      <nav className="fixed z-50 mb-14 flex h-14 w-screen items-center justify-center border-b bg-background p-2">
        <div className="flex flex-row justify-start space-x-2">
          <Button variant="outline" className="flex size-10 flex-col">
            <ArrowLeft className="size-4 text-foreground transition-all delay-100 duration-300 hover:scale-110" />
          </Button>
          <Button variant="outline" className="flex size-10 flex-col">
            <ArrowRight className="size-4 text-foreground transition-all delay-100 duration-300 hover:scale-110" />
          </Button>
          <Button variant="outline" className="flex size-10 flex-col">
            <RotateCw className="size-4 text-foreground transition-all delay-100 duration-300 hover:rotate-[360deg] hover:scale-110" />
          </Button>
        </div>
        <Input
          className="m-2 outline-none transition-all duration-300 hover:shadow-muted focus:border-muted focus:bg-secondary/40 focus:shadow-muted/20"
          placeholder="Browse the web, uncensored"
        />
        <div className="flex flex-row justify-end space-x-2">
          <Button variant="outline" className="flex size-10 flex-col">
            <Moon className="size-4 text-foreground transition-all delay-100 duration-300 hover:scale-110" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="focus-visible:ring-none flex size-10 flex-col focus-visible:ring-transparent"
              >
                <Settings2 className="size-4 text-foreground transition-all delay-100 duration-300 hover:scale-110 focus-visible:ring-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
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
      />
    </main>
  );
}
