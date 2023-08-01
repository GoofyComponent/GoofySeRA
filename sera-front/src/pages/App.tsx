import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

import logo from "@/assets/images/sera-logo.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { setAppError } from "@/helpers/slices/AppSlice";
import { updateInfos } from "@/helpers/slices/UserSlice";
import { axios } from "@/lib/axios";

import { Nav } from "../components/app/navigation/Nav";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";

function App() {
  const errorState = useSelector((state: any) => state.app.appError);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    if (!errorState) return;
    toast({
      title: errorState.title,
      description: errorState.description,
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    });

    dispatch(setAppError(null));
  }, [errorState]);

  const info = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userInfos = await axios.get("/api/me");
      dispatch(updateInfos(userInfos.data));
      return userInfos.data;
    },
  });

  return (
    <>
      <header className="my-auto flex h-[10vh] justify-between p-6">
        <div className="flex justify-start lg:w-5/12">
          <Link to={"/dashboard"}>
            <img src={logo} alt={"SeRA App"} className="hover:opacity-75" />
          </Link>
          <h3 className="mx-8 mb-0 mt-auto text-2xl text-sera-periwinkle">
            Welcome back{info.isLoading ? "" : `, ${info.data.firstname}`}!
          </h3>
        </div>
        <div className="my-auto flex justify-end">
          <div className="relative my-auto mr-2 flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sera-periwinkle">
            <Bell className="m-auto text-[#916AF6]" />
          </div>
          <Popover>
            <PopoverTrigger>
              <Avatar className="ml-2">
                <AvatarImage src="" />
                <AvatarFallback className="bg-sera-periwinkle font-semibold text-[#916AF6]">
                  {info.isLoading
                    ? "USR"
                    : `${info.data.firstname[0].toUpperCase() as string}.${
                        info.data.lastname[0].toUpperCase() as string
                      }`}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col text-lg font-medium text-sera-jet">
              <Link
                to="/dashboard/profile"
                className="w-fit border-b-2 border-transparent transition-all hover:border-sera-jet"
              >
                Profile
              </Link>

              {/*               <Separator className="my-2" /><Link
                to="/dashboard/settings"
                className="w-fit border-b-2 border-transparent transition-all hover:border-sera-jet"
              >
                Settings
              </Link> */}
              <Link
                to="/logout"
                className="w-fit border-b-2 border-transparent transition-all hover:border-sera-jet"
              >
                Logout
              </Link>

              <button
                className="w-fit border-b-2 border-transparent transition-all hover:border-sera-jet"
                onClick={() => {
                  dispatch(
                    setAppError({
                      title: "An error occured",
                      description:
                        "We are unable to log you out for the moment. Please try again later.",
                    })
                  );
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    dispatch(
                      setAppError({
                        title: "An error occured",
                        description:
                          "We are unable to log you out for the moment. Please try again later.",
                      })
                    );
                  }
                }}
              >
                TriggerToast
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <div className="flex min-h-[90vh] justify-start overflow-auto bg-[#FBF5F3]">
        <Nav />
        <main className="max-h-[90vh] w-[86%] overflow-y-auto pb-4 scrollbar scrollbar-track-sera-jet/50 scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-3">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </>
  );
}

export default App;
