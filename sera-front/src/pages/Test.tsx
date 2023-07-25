import { useEffect } from "react";

import { axios } from "@/lib/axios";

export const Test = () => {
  useEffect(() => {
    const projets = axios.get("/api/projects");

    console.log(projets);
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};
