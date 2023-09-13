import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { accessManager, formatDate } from "@/lib/utils";

import { AddFileModal } from "./AddFileModal";

export const SubtitleSelectCell = ({ subtitleData }: { subtitleData: any }) => {
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [addFileModal, setAddFileModal] = useState(false);
  const langKey = ["en", "fr", "es", "de", "it", "pt", "zh", "ja", "vo"];

  return (
    <>
      <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-1 text-sera-jet">
        <div className="flex justify-between pb-2">
          <p className="my-2 text-xl font-bold ">Select a version</p>
          {accessManager(undefined, "add_subs") && (
            <button
              className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              onClick={() => setAddFileModal(true)}
            >
              Upload a new SRT file
            </button>
          )}
        </div>

        <Select
          onValueChange={(value) => {
            if (!value) return;
            navigate(`/dashboard/projects/${ProjectId}/subs?lang=${value}`);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {langKey.map((lang) => {
              if (subtitleData[lang]) {
                return (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                );
              }
            })}
          </SelectContent>
        </Select>
        {searchParams.get("lang") && subtitleData && subtitleData.srt && (
          <div>
            <p className="text-right font-extralight italic">
              Last updated on{" "}
              {formatDate(
                subtitleData[searchParams.get("lang") || "vo"].srt.updated_at
              )}
            </p>
          </div>
        )}
      </article>
      <AddFileModal
        addFileModal={addFileModal}
        setAddFileModal={setAddFileModal}
      />
    </>
  );
};
