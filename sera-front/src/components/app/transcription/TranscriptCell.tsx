import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

export const TranscriptFileCell = ({
  selectedVersion,
  transcriptData,
  setAddFileModal,
  setSelectedVersion,
}: {
  selectedVersion: any;
  transcriptData: any;
  setAddFileModal: (value: boolean) => void;
  setSelectedVersion: (value: any) => void;
}) => {
  return (
    <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-1 text-sera-jet">
      <div className="flex justify-between pb-2">
        <p className="my-2 text-xl font-bold ">Select a version</p>
        <button
          className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => setAddFileModal(true)}
        >
          Upload a new SRT file
        </button>
      </div>

      <Select
        defaultValue={transcriptData[transcriptData.length - 1].srt.version}
        name="Transcript File Version"
        value={selectedVersion.srt.version}
        onValueChange={(value) => {
          const version = transcriptData.find(
            (version: any) => version.srt.version === value
          );
          if (version) {
            setSelectedVersion(version);
          }
        }}
      >
        <SelectTrigger className="mb-1">
          <SelectValue placeholder="Select a file" />
        </SelectTrigger>
        <SelectContent>
          {transcriptData.map((version: any) => (
            <SelectItem key={version.srt.version} value={version.srt.version}>
              Version {version.srt.version}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div>
        <p>
          You are seeing transcript file version {selectedVersion.srt.version}
        </p>
        <p className="text-right font-extralight italic">
          Uploaded on {formatDate(selectedVersion.srt.created_at)}
        </p>
      </div>
    </article>
  );
};

export const NoTranscriptFileCell = ({
  setAddFileModal,
}: {
  setAddFileModal: (value: boolean) => void;
}) => {
  return (
    <article className="my-auto min-w-full rounded-lg border-2 border-sera-jet p-2 text-sera-jet transition-all">
      <div className="flex justify-between pb-2">
        <p className="my-2 text-xl font-bold ">No file added</p>
        <Button
          className="rounded-lg bg-sera-jet px-2 text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          onClick={() => setAddFileModal(true)}
        >
          Upload a new SRT file
        </Button>
      </div>

      <p className="my-1 truncate text-lg ">
        You can add a file by clicking on the upload button
      </p>
    </article>
  );
};
