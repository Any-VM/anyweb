import type { MetaFunction } from "@remix-run/node";
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Settings2,
  Moon,
  Code,
  ArrowUpRightFromSquare,
  Slash,
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
          <Button variant="outline" className="flex h-10 w-[5.5rem] flex-row">
            <ArrowLeft className="size-4 text-foreground hover:scale-110 transition-all duration-300 delay-100 mr-1" />
            <Slash className="size-4 rotate-[-20deg] text-secondary"/>
            <ArrowRight className="size-4 text-foreground hover:scale-110 transition-all duration-300 delay-100 ml-1" />
          </Button>
          <Button variant="outline" className="flex size-10 flex-col">
            <RotateCw className="size-4 text-foreground hover:rotate-[360deg] hover:scale-110 transition-all duration-300 delay-100" />
          </Button>
        </div>
        <Input
          className="m-2 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 hover:bg-secondary hover:bg-opacity-25 focus:bg-secondary focus:bg-opacity-25 hover:border-primary focus:border-primary hover:shadow-[0_0_25px_5px_rgba(30,41,59,0.75)_inset] focus:shadow-[0_0_25px_5px_rgba(30,41,59,0.75)_inset] transition-all duration-300"
          placeholder="Browse the web, uncensored"
        />
        <div className="flex flex-row justify-end space-x-2">
          <Button variant="outline" className="flex size-10 flex-col">
            <Moon className="size-4 text-foreground hover:scale-110 transition-all duration-300 delay-100" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex size-10 flex-col">
                <Settings2 className="size-4 text-foreground hover:scale-110 transition-all duration-300 delay-100 focus-visible:ring-0" />
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
