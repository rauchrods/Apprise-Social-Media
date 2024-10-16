import { useState } from "react";
import "./editProfileModal.scss";
import Button from "../../ui/button/Button";
import Input from "../../ui/input/Input";
import "./editProfileModal.scss";
import { FaArrowLeft } from "react-icons/fa6";

const EditProfileModal = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const modal = document.getElementById("edit_profile_modal");

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
          onSubmit={(e) => {
            e.preventDefault();
            alert("Profile updated successfully");
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
              value={formData.username}
              name="username"
              onChange={handleInputChange}
            />
          </div>
          <div className="row">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              name="email"
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
          <Input
            type="text"
            placeholder="Link"
            value={formData.link}
            name="link"
            onChange={handleInputChange}
          />
          <Button style={{ padding: "0.5rem" }}>Update</Button>
        </form>
      </dialog>
    </>
  );
};
export default EditProfileModal;
