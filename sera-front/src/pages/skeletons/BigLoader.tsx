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
      <section
        className={`flex h-full min-h-[15em] w-full flex-col items-center justify-center bg-${bgColor}`}
      >
        <Loader2
          size={loaderSize}
          className={`m-auto animate-spin text-${textColor}`}
        />
      </section>
    </>
  );
};
