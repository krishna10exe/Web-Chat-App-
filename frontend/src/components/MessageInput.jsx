import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Loader2, Smile, Sticker } from "lucide-react";
import toast from "react-hot-toast";
import React from "react";

const emojis = ["😀", "😂", "😍", "😎", "😢", "😡", "👍", "🔥", "🎉", "💻", "🧠", "💬"];

const stickers = [
  "https://res.cloudinary.com/dwuskaqah/image/upload/v1760625915/sticker_feghnm.webp",
  "https://res.cloudinary.com/dwuskaqah/image/upload/v1760625969/sticker_20_eoaypy.webp",
  "https://res.cloudinary.com/dwuskaqah/image/upload/v1760626002/sticker_1_xtewwt.png",
  "https://res.cloudinary.com/dwuskaqah/image/upload/v1760626025/sticker_14_tivue6.png",
];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState("emoji"); // 'emoji' or 'sticker'
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type?.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEmojiClick = (emoji) => {
    setText((prev) => prev + emoji);
    setShowPicker(false);
  };

  const handleStickerClick = async (stickerUrl) => {
    try {
      await sendMessage({ image: stickerUrl, text: "" });
      setShowPicker(false);
    } catch (error) {
      toast.error("Failed to send sticker");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (isSending || (!text.trim() && !imagePreview)) return;

    setIsSending(true);
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 w-full relative">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              type="button"
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 relative">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isSending}
          />

          {/* Picker Button */}
          <button
            type="button"
            className="btn btn-circle btn-sm text-zinc-400"
            onClick={() => setShowPicker(!showPicker)}
          >
            <Smile size={20} />
          </button>

          {/* Emoji + Sticker Picker */}
          {showPicker && (
            <div className="absolute bottom-12 right-0 w-64 bg-base-200 shadow-lg p-2 rounded-xl border border-zinc-700 z-50">
              {/* Tabs */}
              <div className="flex mb-2 border-b border-zinc-700">
                <button
                  type="button"
                  onClick={() => setActiveTab("emoji")}
                  className={`flex-1 py-1 text-sm ${
                    activeTab === "emoji" ? "font-bold border-b-2 border-primary" : "opacity-60"
                  }`}
                >
                  😊 Emojis
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sticker")}
                  className={`flex-1 py-1 text-sm ${
                    activeTab === "sticker" ? "font-bold border-b-2 border-primary" : "opacity-60"
                  }`}
                >
                  🐾 Stickers
                </button>
              </div>

              {/* Emoji Grid */}
              {activeTab === "emoji" && (
                <div className="grid grid-cols-6 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      className="text-lg hover:scale-110 transition-transform"
                      onClick={() => handleEmojiClick(emoji)}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Sticker Grid */}
              {activeTab === "sticker" && (
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1">
                  {stickers.map((sticker) => (
                    <button
                      key={sticker}
                      type="button"
                      onClick={() => handleStickerClick(sticker)}
                      className="hover:scale-105 transition-transform"
                    >
                      <img
                        src={sticker}
                        alt="sticker"
                        className="w-16 h-16 object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Image upload */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
            disabled={isSending}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => !isSending && fileInputRef.current?.click()}
            disabled={isSending}
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={isSending || (!text.trim() && !imagePreview)}
        >
          {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={22} />}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
