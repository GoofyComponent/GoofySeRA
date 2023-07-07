import { Bell } from "lucide-react";
import { Outlet } from "react-router-dom";

import logo from "@/assets/images/sera-logo.svg";

import { Nav } from "../components/app/navigation/Nav";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

function App() {
  return (
    <>
      <header className="my-auto flex h-[10vh] justify-between p-6">
        <div className="flex justify-start lg:w-5/12">
          <img src={logo} alt={"SeRA App"} />
          <h3 className="mx-8 mb-0 mt-auto text-2xl text-sera-periwinkle">
            Welcome back, (user) !
          </h3>
        </div>
        <div className="my-auto flex justify-end">
          <div className="relative my-auto mr-2 flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sera-periwinkle">
            <Bell className="m-auto text-[#916AF6]" />
          </div>
          <Avatar className="ml-2">
            <AvatarImage src="" />
            <AvatarFallback className="bg-sera-periwinkle font-semibold text-[#916AF6]">
              USR
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex min-h-[90vh] justify-start overflow-auto bg-[#FBF5F3]">
        <Nav />
        <main className="max-h-[90vh] w-[86%] overflow-y-auto pb-4 scrollbar scrollbar-track-sera-jet/50 scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-3">
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
