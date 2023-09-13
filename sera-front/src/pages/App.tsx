import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";

import logo from "@/assets/images/sera-logo.svg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { setAppError } from "@/helpers/slices/AppSlice";
import { updateInfos } from "@/helpers/slices/UserSlice";
import { axios } from "@/lib/axios";
import { formatName, getInitials, selectRoleDisplay } from "@/lib/utils";

import { Nav } from "../components/app/navigation/Nav";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { BigLoader } from "./skeletons/BigLoader";
import { UserInfosSummarySkeletons } from "./skeletons/ProfilePopover";

function App() {
  const errorState = useSelector((state: any) => state.app.appError);
  const userData = useSelector((state: any) => state.user.infos);
  const [notifNonRead, setNotifNonRead] = useState(0);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!errorState) return;
    toast({
      title: errorState.title,
      description: errorState.description,
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    });

    dispatch(setAppError(null));
  }, [errorState]);

  useEffect(() => {
    const imageUpdated = () => {
      queryClient.invalidateQueries(["user"]);
    };

    document.addEventListener("imageUpdated", imageUpdated);
    return () => {
      document.removeEventListener("imageUpdated", imageUpdated);
    };
  }, [queryClient]);

  useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const userInfos = await axios.get("/api/me");
      dispatch(updateInfos(userInfos.data));
      return userInfos.data;
    },
  });

  const {
    data: userNotifications,
    refetch: refetchNotifications,
    isLoading: loadingNotification,
  } = useQuery({
    queryKey: ["notifications"],
    refetchInterval: 180000,
    queryFn: async () => {
      const userNotifications = await axios.get("/api/notifications");
      return userNotifications.data;
    },
  });

  const setAsRead = useMutation({
    mutationFn: async (notificationId: number) => {
      const formData = new URLSearchParams();

      formData.append("is_read", JSON.stringify(1));

      return await axios.put(`/api/notifications/${notificationId}`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
    },
    onSuccess: (response: any) => {
      if (response && response.data) {
        refetchNotifications();
      }
    },
  });

  useEffect(() => {
    if (!userNotifications) return;
    const nonRead = userNotifications.filter(
      (notification: any) => notification.is_read === 0
    );
    setNotifNonRead(nonRead.length);
  }, [userNotifications]);

  return (
    <>
      <header className="my-auto flex h-[100px] justify-between p-6">
        <div className="flex justify-start lg:w-5/12">
          <Link to={"/dashboard"}>
            <img src={logo} alt={"SeRA App"} className="hover:opacity-75" />
          </Link>
          <h3 className="mx-8 mb-0 mt-auto text-2xl text-sera-periwinkle">
            Welcome back{userData.firstname && `, ${userData.firstname}`}!
          </h3>
        </div>
        <div className="my-auto flex justify-end">
          <div className="relative my-auto mr-2 flex h-10 w-10 shrink-0 rounded-full bg-sera-periwinkle">
            <Popover>
              <PopoverTrigger
                className={clsx(
                  notifNonRead > 0 &&
                    "after:absolute after:right-[-5px] after:top-0 after:h-4 after:w-4 after:rounded-full after:bg-red-500",
                  "m-auto"
                )}
              >
                <Bell className="m-auto text-[#916AF6]" />
              </PopoverTrigger>
              <PopoverContent className="mt-4 flex max-h-96 w-96 flex-col divide-y p-0  text-lg font-medium text-sera-jet">
                <div>
                  <div className="flex h-1/6 w-full justify-start border-b bg-white">
                    <p className=" p-3 text-xl">Notification</p>
                  </div>
                  {loadingNotification && (
                    <BigLoader
                      loaderSize={42}
                      bgColor="sera-periwinkle/25"
                      textColor="sera-jet"
                    />
                  )}
                  {!loadingNotification && userNotifications ? (
                    <Accordion
                      type="single"
                      collapsible
                      className=" h-[331px] w-full overflow-y-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-3"
                    >
                      {userNotifications &&
                        userNotifications.length > 0 &&
                        userNotifications.map(
                          (notification: any, i: number) => {
                            return (
                              <>
                                <AccordionItem value={`item-${i}`}>
                                  <AccordionTrigger
                                    className={clsx(
                                      notification.is_read === 1
                                        ? "bg-transparent"
                                        : "bg-sera-periwinkle/30",
                                      "flex justify-start px-3 pt-2 text-left"
                                    )}
                                    onClick={() =>
                                      setAsRead.mutate(notification.id)
                                    }
                                  >
                                    <p>{notification.title}</p>
                                  </AccordionTrigger>
                                  <AccordionContent className="px-3">
                                    <p className="mt-1">
                                      {notification.description}
                                    </p>
                                  </AccordionContent>
                                </AccordionItem>
                                {notification.is_read === 0 && (
                                  <Separator className="" />
                                )}
                              </>
                            );
                          }
                        )}
                    </Accordion>
                  ) : (
                    !loadingNotification && (
                      <p className="text-center text-lg font-semibold">
                        No notifications
                      </p>
                    )
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <Popover>
            <PopoverTrigger>
              <Avatar className="ml-2 transition-all hover:opacity-75">
                <AvatarImage src={userData.avatar_filename} />
                <AvatarFallback className="bg-sera-periwinkle font-semibold text-[#916AF6]">
                  {!userData.lastname && !userData.firstname
                    ? "USR"
                    : getInitials(userData.lastname, userData.firstname)}
                </AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className="flex flex-col text-lg font-medium text-sera-jet">
              {userData ? (
                <div>
                  <div className="flex justify-start text-base">
                    <p className="w-full truncate">
                      {userData.lastname &&
                        userData.firstname &&
                        formatName(userData.lastname, userData.firstname)}
                    </p>
                  </div>

                  <Separator className="my-2" />
                  <p className="text-right text-sm opacity-50">
                    {userData.role && selectRoleDisplay(userData.role)}
                  </p>
                  <p className="text-right text-sm opacity-50">
                    {userData.email && userData.email}
                  </p>
                </div>
              ) : (
                <UserInfosSummarySkeletons />
              )}

              <Separator className="my-2" />

              <Link
                to="/dashboard/profile"
                className="w-fit border-b-2 border-transparent transition-all hover:border-sera-jet"
              >
                Profile
              </Link>

              <Link
                to="/logout"
                className="w-fit border-b-2 border-transparent transition-all hover:border-sera-jet"
              >
                Logout
              </Link>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <div className="flex h-[calc(100vh_-_100px)] justify-start overflow-auto bg-[#FBF5F3]">
        <Nav />
        <main className="h-[calc(100vh_-_100px)] w-[86%] overflow-y-auto pb-4 scrollbar scrollbar-track-sera-jet/50 scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-3">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </>
  );
}

export default App;
