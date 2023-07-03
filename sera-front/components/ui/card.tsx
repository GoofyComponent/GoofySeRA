import * as React from "react"

import { cn } from "@/lib/utils"
import Link from "next/link";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    projectUrl: string;
    title: string;
    projectState: any;
    shortDesc: string;
    bgImage: string;
  }

  let titleBgColor = '';


const Card = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, title, projectState, shortDesc, bgImage,  projectUrl = "", ...props }, ref) => {

    if (projectState  === 'Done') {
      titleBgColor = 'bg-red-500';
    } else if (projectState  === 'in Progress') {
      titleBgColor = 'bg-lime-200';
    } else if (projectState  === 'Draft') {
      titleBgColor = 'bg-amber-300';
    }
    

    return (
      <Link href={`project/${projectUrl}`}>
        <div  style={{backgroundImage: `url(${bgImage})`}} className="w-[340px] h-[200px] m-6 p-3 border-2 rounded-lg text-ellipsis overflow-hidden bg-cover bg-center text-white hover:scale-105 ease-in-out duration-300 " >
          <div className="justify-between items-center flex text-xl">
            <span>{title}</span>
            <span className={`${titleBgColor} px-6 py-1 rounded-lg text-black`}>{projectState}</span>
          </div>
            <p className="pt-8">{shortDesc}</p>
        </div>
      </Link>
    )
  }
)

export { Card }
