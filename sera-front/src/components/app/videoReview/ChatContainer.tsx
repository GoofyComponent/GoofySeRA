import { Separator } from "@radix-ui/react-select";
import { Clock, SendHorizontal } from "lucide-react";
import { useEffect, useRef } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const ChatContainer = ({ chatData }: any) => {
  const messageContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <div
        id="chat-message"
        className="h-[70vh] w-full overflow-x-hidden overflow-y-scroll py-2 pl-10 scrollbar scrollbar-track-transparent scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-3"
        ref={messageContainerRef}
      >
        {chatData.map((message: any, index: any) => (
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

              <p className="w-full break-words text-sm">{message.message}</p>
              <Separator className="mt-2 bg-sera-jet text-sera-jet" />
            </div>
          </div>
        ))}
      </div>
      <div
        id="input-message"
        className="mx-auto w-11/12 rounded-xl bg-[#D9D9D9] p-2"
      >
        <div className="mb-2">
          <Button variant="micro" size="micro">
            <Clock className="mr-1" />
            <p className="ml-1 font-extralight italic">Time</p>
          </Button>
        </div>
        <div className="flex justify-start">
          <Textarea
            placeholder="Type your message here"
            className="mr-2 resize-none"
          />
          <Button className="mb-0 ml-2 mt-auto bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
            <SendHorizontal />
          </Button>
        </div>
      </div>
    </>
  );
};
