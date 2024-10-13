import { useState } from "react";
import CreatePost from "./CreatePost";
import Posts from "../../components/common/posts/Posts";
import "./homePage.scss";
import PageLayout from "../../components/pageLayout/PageLayout";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <PageLayout>
      <div className="home-page">
        {/* Header */}
        <div className="header">
          <span
            onClick={() => setFeedType("forYou")}
            className={feedType === "forYou" ? "selected" : ""}
          >
            For you
          </span>
          <span
            onClick={() => setFeedType("following")}
            className={feedType === "following" ? "selected" : ""}
          >
            Following
          </span>
        </div>

        {/*  CREATE POST INPUT */}
        <CreatePost />

        {/* POSTS */}
        <Posts />
      </div>
    </PageLayout>
  );
};
export default HomePage;
