import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { reset as appReset, setAppError } from "@/helpers/slices/AppSlice";
import { reset as userReset } from "@/helpers/slices/UserSlice";
import { axios } from "@/lib/axios";

export const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutCall = useQuery({
    queryFn: async () => {
      const logout = await axios.post("/logout");

      console.log(logout);

      return logout.data;
    },
    enabled: false,
  });

  useEffect(() => {
    logoutCall.refetch();
  }, []);

  useEffect(() => {
    if (logoutCall.isFetching) return;

    if (logoutCall.isLoading) return;

    if (logoutCall.isError) {
      const error = {
        title: "An error occured",
        description:
          "We are unable to log you out for the moment. Please try again later.",
      };
      dispatch(setAppError(error));
      return navigate("/dashboard");
    }

    if (logoutCall.isSuccess) {
      console.log(logoutCall.data);
      dispatch(userReset());
      dispatch(appReset());
      return navigate("/login");
    }
  }, [logoutCall.isSuccess, logoutCall.isError, logoutCall.isLoading]);

  return <></>;
};
