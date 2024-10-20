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
import EditProfileModal from "../../components/editProfileModal/EditProfileModal";

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
                accept="image/*"
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type="file"
                hidden
                ref={profileImgRef}
                accept="image/*"
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
              {isMyProfile && <EditProfileModal />}
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

            <div className="profile-details">
              <div className="main-details">
                <span className="full-name">{user?.fullName}</span>
                <span className="user-name">@{user?.username}</span>
                <span className="bio">{user?.bio}</span>
              </div>

              <div className="link-join-date">
                {user?.link && (
                  <div className="link-sec">
                    <FaLink />
                    <a
                      href="https://youtube.com/@asaprogrammer_"
                      target="_blank"
                      rel="noreferrer"
                    >
                      youtube.com/@asaprogrammer_
                    </a>
                  </div>
                )}
                <div className="join-date-sec">
                  <IoCalendarOutline />
                  <span>Joined July 2021</span>
                </div>
              </div>
              <div className="follow-following-sec">
                <div className="following-sec">
                  <span>{user?.following.length}</span>
                  <span>Following</span>
                </div>
                <div className="followers-sec">
                  <span>{user?.followers.length}</span>
                  <span>Followers</span>
                </div>
              </div>
            </div>
            <div className="option-header">
              <div onClick={() => setFeedType("posts")}>
                <span className={feedType === "posts" ? "selected" : ""}>
                  Posts
                </span>
              </div>
              <div onClick={() => setFeedType("likes")}>
                <span className={feedType === "likes" ? "selected" : ""}>
                  Likes
                </span>
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
