import { USERS_FOR_RIGHT_PANEL } from "../../utils/db/dummy";
import "./rightPanel.scss";
import SuggestedUserCard from "../suggestedUserCard/SuggestedUserCard";
import SuggestedUserCardSkeleton from "../suggestedUserCard/SuggestedUserCardSkeleton";


const RightPanel = () => {
  const isLoading = false;

  return (
    <div className="right-panel">
      <p>Who to follow</p>
      <div className="suggestion-container">
        {/* item */}
        {isLoading && (
          <>
            <SuggestedUserCardSkeleton />
            <SuggestedUserCardSkeleton />
            <SuggestedUserCardSkeleton />
            <SuggestedUserCardSkeleton />
          </>
        )}
        {!isLoading &&
          USERS_FOR_RIGHT_PANEL?.map((user) => (
            <SuggestedUserCard user={user} key={user._id} />
          ))}
      </div>
    </div>
  );
};
export default RightPanel;
