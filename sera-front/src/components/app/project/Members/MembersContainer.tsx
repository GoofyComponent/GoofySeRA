import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, UserX } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useMatch, useParams } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { axios } from "@/lib/axios";
import {
  formatName,
  getInitials,
  selectRoleDisplay,
  teamChecker,
} from "@/lib/utils";
import { BigLoader } from "@/pages/skeletons/BigLoader";

interface UserCardProps {
  id?: number;
  name: string[];
  email: string;
  user_role: string;
  avatar?: string;
  action?: string;
}

interface MembersContainerProps {
  validTeam?: boolean;
  validTeamSetter?: (value: boolean) => void;
}

export const MembersContainer = ({
  validTeam = true,
  validTeamSetter,
}: MembersContainerProps) => {
  const isProjectPage = useMatch("/dashboard/projects/:ProjectId");
  const { ProjectId: id } = useParams<{ ProjectId: string }>();

  const [userSearchModal, setUserSearchModal] = useState(false);
  const [searchUserInput, setSearchUserInput] = useState("");
  const [userType, setUserType] = useState("all");

  const {
    data: projectMembers,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["projectMembers", { id }],
    queryFn: async () => {
      const projectMembers = await axios.get(`api/projects/${id}/teams`);
      return projectMembers.data;
    },
  });

  const {
    data: peopleSearch,
    isLoading: searchLoading,
    refetch: searchRefetch,
  } = useQuery({
    queryKey: ["peopleSearch", { searchUserInput, userType }],
    queryFn: async () => {
      let call = "api/users?";
      if (searchUserInput && searchUserInput != "")
        call = `${call}name=${searchUserInput}&`;

      if (userType && userType != "all") call = `${call}role=${userType}`;

      const peopleSearch = await axios.get(call);
      return peopleSearch.data.data;
    },
  });

  useEffect(() => {
    if (projectMembers && validTeamSetter)
      validTeamSetter(teamChecker(projectMembers.users));
  }, [isSuccess, projectMembers]);

  if (isLoading)
    return <BigLoader bgColor="bg-transparent" textColor="text-sera-jet" />;

  return (
    <>
      <h3 className="text-4xl font-medium text-sera-jet">
        Members :{" "}
        {!validTeam && (
          <span className="text-base text-red-700">
            You are missing at least one role.
          </span>
        )}
      </h3>

      <div className="mx-auto flex flex-row flex-wrap">
        {!isProjectPage && (
          <button
            className="m-2 flex h-20 w-96 justify-start rounded-lg border-2 border-dashed border-sera-jet px-4 py-2 transition-all hover:opacity-50"
            onClick={() => setUserSearchModal(true)}
            aria-label="Open the user search modal"
          >
            <Plus className="m-auto" />
            <p className="m-auto text-xl">ADD A NEW MEMBER</p>
          </button>
        )}
        {projectMembers &&
          projectMembers.users.map((member: any) => (
            <UserCard
              key={member.id}
              id={member.id}
              name={[member.lastname, member.firstname]}
              email={member.email}
              user_role={member.role}
              avatar={member.avatar_filename}
              action={!isProjectPage ? "delete" : undefined}
            />
          ))}
      </div>
      {isProjectPage && (
        <Link to={`planification`} className="ml-auto mr-0">
          <p className="ml-auto mr-0 text-sera-jet underline hover:text-sera-jet/75">
            Manage the project team &gt;&gt;
          </p>
        </Link>
      )}
      <Dialog
        open={userSearchModal}
        onOpenChange={(open) => setUserSearchModal(open)}
      >
        <DialogContent className="p-4">
          <DialogHeader>
            <DialogTitle>Users</DialogTitle>
          </DialogHeader>
          <article className="">
            <div className=" my-2 flex justify-center">
              <Input
                type="text"
                id="user-search"
                value={searchUserInput}
                onChange={(e) =>
                  setSearchUserInput(e.currentTarget.value.toLowerCase())
                }
                placeholder="Search a user"
                className="mr-2 w-1/2"
              />
              <Select
                onValueChange={(value) => setUserType(value as string)}
                defaultValue={userType}
              >
                <SelectTrigger className="ml-2 w-1/2">
                  <SelectValue placeholder="Select a role (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="cursus_director">
                      Cursus Director
                    </SelectItem>
                    <SelectItem value="project_manager">
                      Project Manager
                    </SelectItem>
                    <SelectItem value="professor">Professor</SelectItem>
                    <SelectItem value="video_team">Video Team</SelectItem>
                    <SelectItem value="video_editor">Video Editor</SelectItem>
                    <SelectItem value="transcription_team">
                      Transcription Team
                    </SelectItem>
                    <SelectItem value="traduction_team">
                      Traduction Team
                    </SelectItem>
                    <SelectItem value="editorial_team">
                      Editorial Team
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              onClick={() => searchRefetch()}
            >
              <Search size={24} />
            </Button>

            <div className="mx-auto my-4 flex  max-h-96 flex-col items-center overflow-auto align-middle scrollbar scrollbar-track-transparent scrollbar-thumb-sera-jet scrollbar-thumb-rounded-lg scrollbar-w-2">
              {searchLoading && (
                <BigLoader bgColor="bg-transparent" textColor="text-sera-jet" />
              )}
              {!searchLoading && peopleSearch && peopleSearch.length === 0 && (
                <p className="text-center text-xl">
                  No user found for your search
                </p>
              )}
              {peopleSearch &&
                projectMembers &&
                peopleSearch.map((user: any) => {
                  const isAlreadyInTeam = projectMembers.users.find(
                    (member: any) => member.id === user.id
                  );

                  //If the only result is only users already in the team, we display a message
                  if (peopleSearch.length === 1 && isAlreadyInTeam)
                    return (
                      <p className="text-center text-xl">
                        This user is already in the team
                      </p>
                    );

                  if (isAlreadyInTeam) return null;
                  return (
                    <UserCard
                      key={user.id}
                      id={user.id}
                      name={[user.lastname, user.firstname]}
                      email={user.email}
                      user_role={user.role}
                      avatar={user.avatar_filename}
                      action={"add"}
                    />
                  );
                })}
            </div>
          </article>
        </DialogContent>
      </Dialog>
    </>
  );
};

const UserCard = ({
  id,
  name,
  email,
  user_role,
  avatar,
  action,
}: UserCardProps) => {
  const queryClient = useQueryClient();
  const { ProjectId } = useParams<{ ProjectId: string }>();
  const userLogged = useSelector((state: any) => state.user.infos);

  const addUser = useMutation({
    mutationKey: ["addUser", { id }],
    mutationFn: async () => {
      const addUser = await axios.post(`/api/projects/${ProjectId}/teams/add`, {
        user_id: id,
      });
      return addUser.data;
    },
    onSuccess: () => {
      toast({
        title: "Success !",
        description: `The user has been correctly added to the project.`,
      });

      queryClient.invalidateQueries(["projectMembers", { id: ProjectId }]);
    },
    onError: () => {
      toast({
        title: "Were unable to add the user to the project at the moment",
        description: `Please try again later.`,
      });
    },
  });

  const deleteUser = useMutation({
    mutationKey: ["deleteUser", { id }],
    mutationFn: async () => {
      const deleteUser = await axios.post(
        `/api/projects/${ProjectId}/teams/remove`,
        {
          user_id: id,
        }
      );
      return deleteUser.data;
    },
    onSuccess: () => {
      toast({
        title: "Success !",
        description: `The user has been correctly remove from the project.`,
      });

      queryClient.invalidateQueries(["projectMembers", { id: ProjectId }]);
    },
    onError: () => {
      toast({
        title: "Were unable to remove the user from the project at the moment",
        description: `Please try again later.`,
      });
    },
  });

  return (
    <div className="m-2 flex min-h-min w-96 justify-start rounded-lg border-2 border-sera-jet px-1">
      <Avatar className="my-auto mr-2">
        <AvatarImage src={avatar} />
        <AvatarFallback>{getInitials(name[0], name[1])}</AvatarFallback>
      </Avatar>
      <div className="my-auto">
        <h4 className="text-xl">{formatName(name[0], name[1])}</h4>
        <p className="text-normal">{selectRoleDisplay(user_role)}</p>
        <p className="text-normal">{email}</p>
      </div>
      {action && parseInt(userLogged.id) !== id && (
        <Button
          className="my-auto ml-auto mr-0 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
          aria-label={`Remove ${formatName(name[0], name[1])} from the project`}
          onClick={() => {
            if (action === "delete") deleteUser.mutate();
            if (action === "add") addUser.mutate();
          }}
        >
          {action === "delete" && <UserX size={28} strokeWidth={2.25} />}
          {action === "add" && <Plus size={28} strokeWidth={2.25} />}
        </Button>
      )}
    </div>
  );
};
