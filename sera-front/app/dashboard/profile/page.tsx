import { PasswordForm } from "@/components/app/profile/PasswordForm";
import { UserForm } from "@/components/app/profile/UserForm";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Section() {
  return (
    <>
      <div className="mx-6 my-6 flex justify-start">
        <Button variant="title" size="title" className="mr-4" asChild>
          <Link href="/dashboard/resume">
            <ChevronLeft size={50} strokeWidth={3} />
          </Link>
        </Button>
        <h2 className="my-auto text-4xl font-semibold text-sera-jet">
          Profile
        </h2>
      </div>
      <hr className="mx-6 my-4 h-0.5 border-0 bg-gray-200 dark:bg-gray-900"></hr>
      <div className="mx-6 flex flex-col md:flex-row md:justify-between">
        <div className="px-4 md:w-2/6">
          <h3 className="text-2xl font-semibold">Profile information</h3>
          <p className="font-light">
            Update your account&apos;s profile information and email address.
          </p>
        </div>
        <UserForm />
      </div>
      <hr className="mx-6 my-4 h-0.5 border-0 bg-gray-200 dark:bg-gray-900"></hr>
      <div className="mx-6 flex flex-col md:flex-row md:justify-between">
        <div className="px-4 md:w-2/6">
          <h3 className="text-2xl font-semibold">Update password</h3>
          <p className="font-light">
            Ensure your account is using a long, random password to stay secure.
          </p>
        </div>
        <PasswordForm />
      </div>
    </>
  );
}
