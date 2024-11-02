import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdVerified } from "react-icons/md";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFormattedDate } from "../../utils/utilFunctions";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "../../components/common/loadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";
import ProfileHeaderSkeleton from "./ProfileHeaderSkeleton";

const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const { userName } = useParams();

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);

  const { followUnfollow, isPending } = useFollow();

  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${userName}`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: editProfileImage, isPending: isEditImagePending } =
    useMutation({
      mutationFn: async () => {
        try {
          const res = await fetch(`/api/users/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              coverImage: coverImg,
              profileImage: profileImg,
            }),
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
        setCoverImg(null);
        setProfileImg(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  // console.log("userProfile: ", userProfile);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const isMyProfile = authUser?._id === userProfile?._id;
  

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

  useEffect(() => {
    refetch();
  }, [userName, refetch]);

  return (
    <PageLayout>
      <div className="profile-page">
        {/* HEADER */}
        {(isLoading || isRefetching || isEditImagePending) && (
          <ProfileHeaderSkeleton />
        )}
        {!isLoading && !isRefetching && !isEditImagePending && !userProfile && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}

        {!isLoading && !isRefetching && !isEditImagePending && userProfile && (
          <>
            <div className="header">
              <Link to="/">
                <FaArrowLeft />
              </Link>
              <div className="header-info">
                <p>{userProfile?.fullName}</p>
                {/* <span>{POSTS?.length} posts</span> */}
              </div>
            </div>
            {/* COVER IMG */}
            <div className="profile-img-sec">
              <div className="cover-img-container">
                <img
                  src={coverImg || userProfile?.coverImage || "/cover.png"}
                  alt="cover image"
                />
                {(isMyProfile) && (
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
                    profileImg ||
                    userProfile?.profileImage ||
                    "/avatar-placeholder.png"
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
                  onClick={() => followUnfollow({ id: userProfile?._id })}
                  className="invert-btn"
                >
                  {isPending ? (
                    <LoadingSpinner size={20} />
                  ) : authUser.following.includes(userProfile?._id) ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </Button>
              )}
              {(coverImg || profileImg) && (
                <Button
                  onClick={() => editProfileImage()}
                  className="invert-btn"
                >
                  {isEditImagePending ? <LoadingSpinner size={20} /> : "Update"}
                </Button>
              )}
            </div>

            <div className="profile-details">
              <div className="main-details">
                <span className="full-name">
                  {userProfile?.fullName}
                  {userProfile?.isVerified && <MdVerified />}
                </span>
                <span className="user-name">@{userProfile?.userName}</span>
                <span className="bio">{userProfile?.bio}</span>
              </div>

              <div className="link-join-date">
                {userProfile?.link && (
                  <div className="link-sec">
                    <FaLink />
                    <a
                      href={userProfile?.link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {userProfile?.link}
                    </a>
                  </div>
                )}
                <div className="join-date-sec">
                  <IoCalendarOutline />
                  <span>
                    Joined {getUserFormattedDate(userProfile?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="follow-following-sec">
                <div className="following-sec">
                  <span>{userProfile?.following.length}</span>
                  <span>Following</span>
                </div>
                <div className="followers-sec">
                  <span>{userProfile?.followers.length}</span>
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
              <div onClick={() => setFeedType("liked")}>
                <span className={feedType === "liked" ? "selected" : ""}>
                  Liked
                </span>
              </div>
            </div>
          </>
        )}

        <Posts feedType={feedType} />
      </div>
    </PageLayout>
  );
};
export default ProfilePage;
