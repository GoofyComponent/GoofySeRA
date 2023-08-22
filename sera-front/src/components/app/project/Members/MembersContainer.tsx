import { useQuery } from "@tanstack/react-query";
import { Plus, UserX } from "lucide-react";
import { useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { formatName, getInitials, selectRoleDisplay } from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

interface UserCardProps {
  name: string[];
  email: string;
  role: string;
  avatar?: string;
  action?: boolean;
}

export const MembersContainer = () => {
  const { ProjectId: id } = useParams<{ ProjectId: string }>();

  const getProjectMembers = useQuery({
    queryKey: ["projectMembers", { id }],
    queryFn: async () => {
      const projectMembers = await axios.get(`/api/teams/${id}`);
      return projectMembers.data;
    },
  });
  const { data: projectMembers, isLoading, error } = getProjectMembers;

  console.log(projectMembers);

  if (isLoading)
    return <BigLoader bgColor="bg-transparent" textColor="text-sera-jet" />;

  if (error) return <>{error} . Erreur </>;

  return (
    <section id="project-team">
      <h3 className="text-4xl">Membres :</h3>
      <div className="mx-auto flex flex-row flex-wrap">
        {projectMembers.users.map((member: any) => (
          <UserCard
            key={member.id}
            name={[member.lastname, member.firstname]}
            email={member.email}
            role={member.role}
            avatar={member.avatar_filename}
            action={true}
          />
        ))}
        <div className="m-2 flex h-20 w-96 justify-start rounded-lg border-2 border-dashed border-sera-jet px-4 py-2">
          <Plus className="m-auto" />
          <p className="m-auto text-xl">ADD A NEW MEMBER</p>
        </div>
      </div>
    </section>
  );
};

const UserCard = ({
  name,
  email,
  role,
  avatar,
  action = false,
}: UserCardProps) => {
  return (
    <div className="m-2 flex h-20 w-96 justify-start rounded-lg border-2 border-sera-jet px-1">
      <Avatar className="my-auto mr-2">
        <AvatarImage src={avatar} />
        <AvatarFallback>{getInitials(name[0], name[1])}</AvatarFallback>
      </Avatar>
      <div>
        <h4 className="text-xl">{formatName(name[0], name[1])}</h4>
        <p className="text-normal">{selectRoleDisplay(role)}</p>
        <p className="text-normal">{email}</p>
      </div>
      {action && (
        <Button
          className="my-auto ml-auto mr-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          aria-label={`Remove ${formatName(name[0], name[1])} from the project`}
        >
          <UserX size={28} strokeWidth={2.25} />
        </Button>
      )}
    </div>
  );
};
