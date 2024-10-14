import { useRef, useState } from "react";
import { Link } from "react-router-dom";

// import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
// import EditProfileModal from "./EditProfileModal";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import PageLayout from "../../components/pageLayout/PageLayout";
import { POSTS } from "../../utils/db/dummy";
import Posts from "../../components/common/posts/Posts";
import "./profilePage.scss";
import Avatar from "../../ui/avatar/Avatar";
import Button from "../../ui/button/Button";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const isLoading = false;
  const isMyProfile = true;

  const user = {
    _id: "1",
    fullName: "John Doe",
    username: "johndoe",
    profileImg: "/avatars/boy2.png",
    coverImg: "/cover.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link: "https://youtube.com/@asaprogrammer_",
    following: ["1", "2", "3"],
    followers: ["1", "2", "3"],
  };

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <PageLayout>
      <div className="profile-page">
        {/* HEADER */}
        {/* {isLoading && <ProfileHeaderSkeleton />} */}
        {!isLoading && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}

        {!isLoading && user && (
          <>
            <div className="header">
              <Link to="/">
                <FaArrowLeft />
              </Link>
              <div className="header-info">
                <p>{user?.fullName}</p>
                <span>{POSTS?.length} posts</span>
              </div>
            </div>
            {/* COVER IMG */}
            <div className="profile-img-sec">
              <div className="cover-img-container">
                <img
                  src={coverImg || user?.coverImg || "/cover.png"}
                  alt="cover image"
                />
                {isMyProfile && (
                  <div className="edit-cover-svg">
                    <MdEdit onClick={() => coverImgRef.current.click()} />
                  </div>
                )}
              </div>

              <input
                type="file"
                hidden
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />
              {/* USER AVATAR */}

              <div className="profile-pic-container">
                <Avatar
                  src={
                    profileImg || user?.profileImg || "/avatar-placeholder.png"
                  }
                  style={{ width: "100px", height: "100px" }}
                />
                {isMyProfile && (
                  <div className="edit-profile-svg">
                    <MdEdit
                      className="profile-edit"
                      onClick={() => profileImgRef.current.click()}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="btn-sec">
              {/* {isMyProfile && <EditProfileModal />} */}
              {!isMyProfile && (
                <Button
                  onClick={() => alert("Followed successfully")}
                  className="invert-btn"
                >
                  Follow
                </Button>
              )}
              {(coverImg || profileImg) && (
                <Button
                  onClick={() => alert("Profile updated successfully")}
                  className="invert-btn"
                >
                  Update
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-4 mt-14 px-4">
              <div className="flex flex-col">
                <span className="font-bold text-lg">{user?.fullName}</span>
                <span className="text-sm text-slate-500">
                  @{user?.username}
                </span>
                <span className="text-sm my-1">{user?.bio}</span>
              </div>

              <div className="flex gap-2 flex-wrap">
                {user?.link && (
                  <div className="flex gap-1 items-center ">
                    <>
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href="https://youtube.com/@asaprogrammer_"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        youtube.com/@asaprogrammer_
                      </a>
                    </>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">
                    Joined July 2021
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.following.length}
                  </span>
                  <span className="text-slate-500 text-xs">Following</span>
                </div>
                <div className="flex gap-1 items-center">
                  <span className="font-bold text-xs">
                    {user?.followers.length}
                  </span>
                  <span className="text-slate-500 text-xs">Followers</span>
                </div>
              </div>
            </div>
            <div className="flex w-full border-b border-gray-700 mt-4">
              <div
                className="flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("posts")}
              >
                Posts
                {feedType === "posts" && (
                  <div className="absolute bottom-0 w-10 h-1 rounded-full bg-primary" />
                )}
              </div>
              <div
                className="flex justify-center flex-1 p-3 text-slate-500 hover:bg-secondary transition duration-300 relative cursor-pointer"
                onClick={() => setFeedType("likes")}
              >
                Likes
                {feedType === "likes" && (
                  <div className="absolute bottom-0 w-10  h-1 rounded-full bg-primary" />
                )}
              </div>
            </div>
          </>
        )}

        <Posts />
      </div>
    </PageLayout>
  );
};
export default ProfilePage;
