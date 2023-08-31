import { Separator } from "@radix-ui/react-select";
import { Clock, SendHorizontal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { setPlayerMarkers } from "@/helpers/slices/VideoReviewSlice";
import { videoTimeDeserializer, videoTimeSerializer } from "@/lib/utils";

export const ChatContainer = ({ chatData, plyrRef }: any) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(setPlayerMarkers(chatData));
  }, [chatData]);

  useEffect(
    () => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
    },
    [
      /* trigger */
    ]
  );

  const setPlayerTime = (time: string) => {
    console.log("◊time", time, videoTimeDeserializer(time));
    plyrRef.current.plyr.currentTime = videoTimeDeserializer(time);
  };

  const messageSerializer = (message: string) => {
    //When a [[]] is found, replace it by a real span tag

    const regex = /\[\[(.*?)\]\]/g;
    const matches = message.match(regex);

    if (!matches) return message;

    const newMessage = message.split(regex);

    return newMessage.map((part, index) => {
      if (index % 2 === 0) return part;

      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span
          key={index}
          className="cursor-pointer select-none text-blue-600 hover:text-blue-400"
          onClick={() => setPlayerTime(part)}
        >
          {part}
        </span>
      );
    });
  };

  return (
    <>
      <div
        id="chat-message"
        className="h-[70vh] w-full overflow-x-hidden overflow-y-scroll py-2 pl-10 scrollbar scrollbar-track-transparent scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-3"
        ref={messageContainerRef}
      >
        {chatData.map((message: any, index: any) => (
          <>
            <div key={index} className="flex justify-start">
              <Avatar className="mr-4 h-12 w-12">
                <AvatarImage src={message.author.avatar} />
              </Avatar>
              <div className="w-9/12">
                <div className="min-h-[3rem]">
                  <p className="mb-0 mt-auto font-medium">
                    {message.author.nickname} - {message.author.job}
                  </p>
                  <p className="mb-auto mt-0 text-xs font-extralight">
                    {new Date(message.timestamp).toLocaleDateString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <p className="w-full break-words text-sm">
                  {messageSerializer(message.message)}
                </p>
              </div>
            </div>
            <Separator className="my-4 h-px w-full rounded-lg bg-sera-jet/70" />
          </>
        ))}
      </div>
      <div
        id="input-message"
        className="mx-auto w-11/12 rounded-xl bg-[#D9D9D9] p-2"
      >
        <div className="mb-2">
          <Button
            variant="micro"
            size="micro"
            onClick={(e) => {
              e.preventDefault();
              setMessage(
                `${message} [[${videoTimeSerializer(
                  plyrRef.current.plyr.currentTime
                )}]]`
              );
            }}
          >
            <Clock className="mr-1" />
            <p className="ml-1 font-extralight italic">Time</p>
          </Button>
        </div>
        <div className="flex justify-start">
          <Textarea
            placeholder="Type your message here"
            className="mr-2 resize-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="mb-0 ml-2 mt-auto bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </>
  );
};
