import { useEffect } from "react";

export const Test = () => {
  useEffect(() => {
    console.log("test");
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};
