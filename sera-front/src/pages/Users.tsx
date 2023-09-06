import { useEffect, useState } from "react";
import { axios } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Link,
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import UsersTable from "@/components/app/users/UsersTable";
import { Pagination } from "@/components/ui/pagination";
import { UsersEntity } from "@/lib/types/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";

export const Users = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [role, setRole] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();
  const { UserId } = useParams<{ UserId: string }>();
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [openDelete, setOpenDelete] = useState(false);
  const isDelete = useMatch("/dashboard/users/:UserId/delete");
  const [openEdit, setOpenEdit] = useState(false);
  const isEdit = useMatch("/dashboard/users/:UserId/edit");
  const [editedUserData] = useState<UsersEntity>();
  const [UserData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
  });

  const {
    data: users,
    isLoading,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ["users", { page, role }],
    queryFn: async () => {
      let call = `/api/users?page=${page}&`;
      if (role && role !== "all") call = call + `role=${role}&`;
      if (searchInput && searchInput.trim() !== "") {
        const noSpaceInput = searchInput.trim().replace(/\s+/g, "");
        call = call + `name=${encodeURIComponent(noSpaceInput)}`;
      }
      const users = await axios.get(call);
      const data = users.data;
      return data;
    },
  });

  const createUser = useMutation({
    mutationFn: async (formData: any) => {
      const users = await axios.post("/api/users", formData);
      return users;
    },
    onSuccess: () => {
      refetchUsers();
      setUserData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
      });
      setUserDialogOpen(false);
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (UserId: string) => {
      const users = await axios.delete(`/api/users/${UserId}`);
      return users;
    },
    onSuccess: () => {
      refetchUsers();
      navigate(`/dashboard/users`);
    },
    onError: () => {
      navigate(`/dashboard/users/${UserId}?action=delete`);
    },
  });

  const editUser = useMutation({
    mutationFn: async ({ UserId, formData }: any) => {
      const users = await axios.put(`/api/users/${UserId}`, formData);
      return users;
    },
    onSuccess: () => {
      refetchUsers();
      setUserData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
      });
      navigate(`/dashboard/users`);
    },
    onError: () => {
      navigate(`/dashboard/users/${UserId}?action=edit`);
    },
  });

  const onCreateUserForm = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
  }) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("password_confirmation", data.password_confirmation);
    formData.append("role", data.role);

    createUser.mutate(formData);
  };

  const onEditUserForm = async (data: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
  }) => {
    const formData = new FormData();
    const previousMail = users.data.find(
      (user: UsersEntity) => user.id === Number(UserId)
    )?.email;
    if (data.firstname !== "") {
      formData.append("firstname", data.firstname);
    }
    if (data.lastname !== "") {
      formData.append("lastname", data.lastname);
    }
    if (data.email !== "" && data.email !== previousMail) {
      formData.append("email", data.email);
    }
    if (data.password !== "") {
      formData.append("password", data.password);
    }
    if (data.password_confirmation !== "") {
      formData.append("password_confirmation", data.password_confirmation);
    }
    if (data.role !== "") {
      formData.append("role", data.role);
    }
    editUser.mutate({ UserId, formData });
  };

  useEffect(() => {
    if (users) {
      setTotalPages(users.last_page);
      setCurrentPage(users.current_page);
    }

    if (searchParams.get("action") === "delete") {
      setOpenDelete(true);
    } else {
      setOpenDelete(false);
    }

    if (searchParams.get("action") === "edit") {
      setOpenEdit(true);
    } else {
      setOpenEdit(false);
    }

    if (isDelete && UserId) {
      deleteUser.mutate(UserId);
    }

    if (isEdit && UserId) {
      onEditUserForm(UserData);
    }
  }, [users, isEdit, isDelete, UserId]);

  return (
    <section className="flex h-full flex-col justify-between">
      <div>
        <div className="mx-6 my-6 flex justify-between text-4xl font-semibold text-sera-jet">
          <div className="flex">
            <h2>Users</h2>
            <Button
              onClick={() => setUserDialogOpen(true)}
              className="ml-4 mt-1 bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
            >
              Add User
            </Button>
          </div>
          <div className="flex justify-between">
            <Dialog
              onOpenChange={() => {
                setUserDialogOpen(!userDialogOpen);
              }}
              open={userDialogOpen}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="mb-6">Add new user</DialogTitle>
                </DialogHeader>
                <div className="mb-4 flex flex-col">
                  <div className="mb-4 flex flex-col">
                    <Label className="mb-2" htmlFor="firstname">
                      Firstname
                    </Label>
                    <Input
                      type="text"
                      id="firstname"
                      value={UserData.firstname}
                      className="col-span-3"
                      onChange={(e) =>
                        setUserData({
                          ...UserData,
                          firstname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4 flex flex-col">
                    <Label className="mb-2" htmlFor="lastname">
                      Lastname
                    </Label>
                    <Input
                      type="text"
                      id="lastname"
                      value={UserData.lastname}
                      className="col-span-3"
                      onChange={(e) =>
                        setUserData({
                          ...UserData,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4 flex flex-col">
                    <Label className="mb-2" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      type="text"
                      id="email"
                      value={UserData.email}
                      className="col-span-3"
                      onChange={(e) =>
                        setUserData({
                          ...UserData,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4 flex flex-col">
                    <Label className="mb-2" htmlFor="password">
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      value={UserData.password}
                      className="col-span-3"
                      onChange={(e) =>
                        setUserData({
                          ...UserData,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4 flex flex-col">
                    <Label className="mb-2" htmlFor="password_confirmation">
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      id="password_confirmation"
                      value={UserData.password_confirmation}
                      className="col-span-3"
                      onChange={(e) =>
                        setUserData({
                          ...UserData,
                          password_confirmation: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-4 flex flex-col">
                    <Label className="mb-2" htmlFor="role">
                      Role
                    </Label>
                    <Select
                      name="role"
                      value={UserData.role}
                      onValueChange={(value) =>
                        setUserData({
                          ...UserData,
                          role: value,
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cursus_director">
                          Cursus Director
                        </SelectItem>
                        <SelectItem value="project_manager">
                          Project Manager
                        </SelectItem>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="video_team">Video Team</SelectItem>
                        <SelectItem value="video_editor">
                          Video Editor
                        </SelectItem>
                        <SelectItem value="transcription_team">
                          Transcription Team
                        </SelectItem>
                        <SelectItem value="traduction_team">
                          Traduction Team
                        </SelectItem>
                        <SelectItem value="editorial_team">
                          Editorial Team
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                      onClick={() => onCreateUserForm(UserData)}
                    >
                      Add User
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
              <Select
                onValueChange={(value) => setRole(value as string)}
                defaultValue={role}
              >
                <SelectTrigger className="mr-2 w-[180px]">
                  <SelectValue placeholder="All Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Role</SelectItem>
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
                  <SelectItem value="editorial_team">Editorial Team</SelectItem>
                </SelectContent>
              </Select>
              <Input
                className="mr-2 w-[360px]"
                type="text"
                placeholder="Search (Firstname, Lastname, Email)"
                value={searchInput}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setSearchInput(inputValue);
                  if (inputValue.trim() === "") {
                    refetchUsers(users);
                  }
                }}
              />
              <Button
                onClick={() => refetchUsers(users)}
                className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
              >
                Search
              </Button>
            </Dialog>
          </div>
        </div>
        <UsersTable users={isLoading ? undefined : users.data} />
        {users && users.data.length === 0 && (
          <div className="flex h-3/4 items-center justify-center">
            <p className="text-2xl">No user found</p>
          </div>
        )}
      </div>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        setNextPage={setPage}
        isCurrentlyLoading={isLoading}
      />
      {!isLoading && (
        <AlertDialog
          open={openDelete}
          onOpenChange={(isOpenDelete) => {
            if (isOpenDelete === true) return;
            setOpenDelete(false);
          }}
        >
          <AlertDialogContent className="max-w-5xl border-[#D3D4D5]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete -
                {users &&
                  users.data &&
                  users.data.map((user: UsersEntity) => (
                    <React.Fragment key={user.id}>
                      {user.id === Number(UserId) &&
                        ` ${user.firstname} ${user.lastname}`}
                    </React.Fragment>
                  ))}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Link to="/dashboard/users">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </Link>
              <Link to={`/dashboard/users/${UserId}/delete`}>
                <AlertDialogAction className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50">
                  Delete
                </AlertDialogAction>
              </Link>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {searchParams.get("action") === "edit" && (
        <Dialog
          open={openEdit}
          onOpenChange={(isOpenEdit) => {
            if (isOpenEdit === true) return;
            setOpenEdit(false);
            navigate(`/dashboard/users`);
          }}
        >
          <DialogContent className="max-w-5xl border-[#D3D4D5]">
            <DialogTitle className="mb-6">
              Edit -
              {users &&
                users.data.map((user: UsersEntity) => (
                  <React.Fragment key={user.id}>
                    {user.id === Number(UserId) &&
                      ` ${user.firstname} ${user.lastname}`}
                  </React.Fragment>
                ))}
            </DialogTitle>
            {users &&
              users.data.map((user: UsersEntity) => (
                <React.Fragment key={user.id}>
                  {user.id === Number(UserId)}
                </React.Fragment>
              ))}
            <div>
              <div className="mb-4 flex flex-col">
                <Label className="mb-2" htmlFor="firstname">
                  Firstname
                </Label>
                <Input
                  type="text"
                  id="firstname"
                  value={UserData.firstname}
                  placeholder={editedUserData?.firstname}
                  className="col-span-3"
                  onChange={(e) =>
                    setUserData({
                      ...UserData,
                      firstname: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4 flex flex-col">
                <Label className="mb-2" htmlFor="lastname">
                  Lastname
                </Label>
                <Input
                  type="text"
                  id="lastname"
                  value={UserData.lastname}
                  placeholder={editedUserData?.lastname}
                  className="col-span-3"
                  onChange={(e) =>
                    setUserData({
                      ...UserData,
                      lastname: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4 flex flex-col">
                <Label className="mb-2" htmlFor="email">
                  Email
                </Label>
                <Input
                  type="text"
                  id="email"
                  value={UserData.email}
                  className="col-span-3"
                  placeholder={editedUserData?.email}
                  onChange={(e) =>
                    setUserData({
                      ...UserData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4 flex flex-col">
                <Label className="mb-2" htmlFor="password">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={UserData.password}
                  className="col-span-3"
                  onChange={(e) =>
                    setUserData({
                      ...UserData,
                      password: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4 flex flex-col">
                <Label className="mb-2" htmlFor="password_confirmation">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="password_confirmation"
                  value={UserData.password_confirmation}
                  className="col-span-3"
                  onChange={(e) =>
                    setUserData({
                      ...UserData,
                      password_confirmation: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-4 flex flex-col">
                <Label className="mb-2" htmlFor="role">
                  Role
                </Label>
                <Select
                  name="role"
                  value={UserData.role}
                  onValueChange={(value) =>
                    setUserData({
                      ...UserData,
                      role: value,
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={editedUserData?.role} />
                  </SelectTrigger>
                  <SelectContent>
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
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-sera-jet text-sera-periwinkle hover:bg-sera-jet/50 hover:text-sera-periwinkle/50"
                    onClick={() => onEditUserForm(UserData)}
                  >
                    Edit User
                  </Button>
                </DialogFooter>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
