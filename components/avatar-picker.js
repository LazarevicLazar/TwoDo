// Avatar Picker Component
const AvatarPicker = ({ currentAvatar, onAvatarChange, onImageUpload }) => {
  const [showPicker, setShowPicker] = useState(false);

  const emojiAvatars = [
    "👨",
    "👩",
    "🧑",
    "👴",
    "👵",
    "🧔",
    "👱",
    "👨‍💼",
    "👩‍💼",
    "🧑‍💻",
    "👨‍🎓",
    "👩‍🎓",
    "👨‍🏫",
    "👩‍🏫",
    "👨‍⚕️",
    "👩‍⚕️",
    "👨‍🔬",
    "👩‍🔬",
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
        setShowPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const isImageAvatar = currentAvatar?.startsWith("data:image");

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="relative group focus:outline-none"
      >
        {isImageAvatar ? (
          <img
            src={currentAvatar}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-gray-200 group-hover:border-blue-400 transition-colors"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center text-4xl border-4 border-gray-200 group-hover:border-blue-400 transition-colors">
            {currentAvatar || "👤"}
          </div>
        )}
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100">
            Edit
          </span>
        </div>
      </button>

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          ></div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl p-5 z-50 border-2 border-gray-200 w-80">
            <div className="mb-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">
                Choose Emoji Avatar
              </h4>
              <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                {emojiAvatars.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onAvatarChange(emoji);
                      setShowPicker(false);
                    }}
                    className={`text-3xl p-2 rounded-lg hover:bg-blue-50 transition-colors ${
                      currentAvatar === emoji
                        ? "bg-blue-100 ring-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-800 mb-3 text-center">
                Or Upload Photo
              </h4>
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg text-center hover:shadow-lg transition-all text-sm font-medium">
                  📸 Upload Photo
                </div>
              </label>
              <p className="text-xs text-gray-500 mt-2 text-center">
                JPG, PNG (max 5MB)
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800 py-2"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};
