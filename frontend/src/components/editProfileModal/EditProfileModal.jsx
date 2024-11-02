import { useEffect, useState } from "react";
import "./editProfileModal.scss";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";
import "./editProfileModal.scss";
import { FaArrowLeft } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "../common/loadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

const EditProfileModal = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const queryClient = useQueryClient();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const modal = document.getElementById("edit_profile_modal");

  const { mutate: editProfileData, isPending: isEditProfileData } = useMutation(
    {
      mutationFn: async () => {
        try {
          const res = await fetch(`/api/users/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error || "Something went wrong");
          }
          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
      onSuccess: () => {
        toast.success("Profile updated successfully");
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        ]);

        setFormData({
          fullName: "",
          userName: "",
          bio: "",
          link: "",
          newPassword: "",
          currentPassword: "",
        });

        modal.close();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser?.fullName,
        userName: authUser?.userName,
        bio: authUser?.bio,
        link: authUser?.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, []);

  return (
    <>
      <Button onClick={() => modal.showModal()}>Edit profile</Button>
      <dialog id="edit_profile_modal" className="my-modal">
        <div className="header">
          <h3>Update Profile</h3>
          <FaArrowLeft
            onClick={() => {
              modal.close();
            }}
          />
        </div>

        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            editProfileData();
          }}
        >
          <div className="row">
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              name="fullName"
              onChange={handleInputChange}
            />
            <Input
              type="text"
              placeholder="Username"
              value={formData.userName}
              name="userName"
              onChange={handleInputChange}
            />
          </div>
          <div className="row">
            {/* <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              name="email"
              onChange={handleInputChange}
            /> */}
            <Input
              type="text"
              placeholder="Link"
              value={formData.link}
              name="link"
              onChange={handleInputChange}
            />
            <Input
              placeholder="Bio"
              value={formData.bio}
              name="bio"
              onChange={handleInputChange}
              isTextarea={true}
              resize="both"
            />
          </div>
          <div className="row">
            <Input
              type="password"
              placeholder="Current Password"
              value={formData.currentPassword}
              name="currentPassword"
              onChange={handleInputChange}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={formData.newPassword}
              name="newPassword"
              onChange={handleInputChange}
            />
          </div>

          <Button style={{ padding: "0.5rem" }} type="submit">
            {isEditProfileData ? <LoadingSpinner size={20} /> : "Update"}
          </Button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
