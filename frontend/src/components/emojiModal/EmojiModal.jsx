import { emojiCategories } from "../../utils/constants";
import { IoCloseSharp } from "react-icons/io5";
import "./emojiModal.scss";

const EmojiModal = ({ setShowEmojiPicker, handleEmojiClick, ...props }) => {
  return (
    <div
      className="emoji-modal-overlay"
      onClick={() => setShowEmojiPicker(false)}
    >
      <div open className="emoji-picker-modal">
        <div className="emoji-picker-header">
          <h3 style={{ margin: 0, color: "#98b89b" }}>Pick an Emoji</h3>
          <IoCloseSharp
            onClick={() => setShowEmojiPicker(false)}
            style={{
              cursor: "pointer",
              fontSize: "20px",
              color: "#666",
            }}
          />
        </div>

        <div className="emoji-picker-content">
          {Object.entries(emojiCategories).map(([category, emojis]) => (
            <div
              key={category}
              style={{ marginBottom: "20px" }}
              className="emoji-category"
            >
              <h4 className="category-title">{category}</h4>
              <div className="emoji-grid">
                {emojis.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiClick(emoji)}
                    className="emoji-button"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiModal;
