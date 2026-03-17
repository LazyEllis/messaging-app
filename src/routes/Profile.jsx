import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useProfile } from "../hooks/useProfile";
import { updateProfile } from "../lib/api";
import Input from "../components/Input";
import LoadingIcon from "../components/LoadingIcon";

const fields = [
  { id: "name", label: "Name", type: "text", required: true },
  { id: "email", label: "Email address", type: "email", required: true },
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  const queryClient = useQueryClient();

  const { data: user, error, isPending } = useProfile();

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      setIsEditing(false);
      setFormData({ name: "", email: "" });
    },
  });

  const handleEditToggle = () => {
    setIsEditing(true);
    setFormData(user);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: "", email: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl/7 font-bold text-white sm:truncate sm:text-3xl sm:tracking-tight">
            User Profile
          </h1>
        </div>
        {!isEditing && (
          <div className="mt-4 lg:mt-0 lg:ml-4">
            <button
              onClick={handleEditToggle}
              className="bg-blurple-500 hover:bg-blurple-600 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              <PencilIcon
                aria-hidden="true"
                className="mr-1.5 -ml-0.5 size-5 text-white"
              />
              Edit
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {mutation.error && <ErrorAlert error={mutation.error} />}

          {fields.map((field) => (
            <Input
              key={field.id}
              value={formData[field.id]}
              onChange={handleChange}
              {...field}
            />
          ))}

          <div className="flex items-center justify-end gap-x-6">
            <button
              onClick={handleCancel}
              type="button"
              className="text-sm/6 font-semibold text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blurple-500 focus-visible:outline-blurple-500 flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {mutation.isPending && <LoadingIcon />}{" "}
              {mutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 border-t border-white/10">
          <dl className="divide-y divide-white/10">
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-100">Name</dt>
              <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">
                {user.name}
              </dd>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <dt className="text-sm/6 font-medium text-gray-100">Email</dt>
              <dd className="mt-1 text-sm/6 text-gray-400 sm:col-span-2 sm:mt-0">
                {user.email}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </>
  );
};

export default Profile;
