// Avatar Display Component - Handles both emoji and image avatars
const AvatarDisplay = ({ avatar, size = "md", className = "" }) => {
  const isImage = avatar?.startsWith("data:image");

  const sizeClasses = {
    sm: "w-8 h-8 text-xl",
    md: "w-12 h-12 text-2xl",
    lg: "w-16 h-16 text-3xl",
    xl: "w-20 h-20 text-4xl",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  if (isImage) {
    return (
      <img
        src={avatar}
        alt="Avatar"
        className={`${sizeClass} rounded-full object-cover border-2 border-gray-300 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-blue-100 to-pink-100 flex items-center justify-center ${className}`}
    >
      {avatar || "👤"}
    </div>
  );
};
