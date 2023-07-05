import { useEffect } from "react";

import { axios } from "@/lib/axios";

export const Test = () => {
  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};
