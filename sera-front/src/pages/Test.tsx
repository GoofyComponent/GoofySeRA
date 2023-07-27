import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Test = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const error = {
      title: "An error occured",
      description:
        "We are unable to log you out for the moment. Please try again later.",
    };
    navigate(`?error-toast=${JSON.stringify(error)}`);
  }, []);

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};
