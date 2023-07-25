import { Loader2 } from "lucide-react";

type BigLoaderProps = {
  bgColor?: string;
  textColor?: string;
  loaderSize?: number;
};

export const BigLoader = ({
  bgColor = "sera-jet",
  textColor = "sera-periwinkle",
  loaderSize = 34,
}: BigLoaderProps) => {
  return (
    <>
      <main
        className={`mt-auto flex h-screen flex-col items-center justify-center bg-${bgColor}`}
      >
        <Loader2 size={loaderSize} className={`m-auto text-${textColor}`} />
      </main>
    </>
  );
};
