import { Loader2 } from "lucide-react";

export const LoaderJet = () => {
  return (
    <>
      <main className="mt-auto flex h-screen flex-col items-center justify-center bg-sera-jet">
        <Loader2 size={34} className="m-auto text-sera-periwinkle" />
      </main>
    </>
  );
};
