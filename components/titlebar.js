// Custom Title Bar for Frameless Window
const CustomTitleBar = ({ title = "TwoDo" }) => {
  const { ipcRenderer } =
    typeof require !== "undefined" ? require("electron") : {};

  const minimizeWindow = () => {
    if (ipcRenderer) ipcRenderer.send("window-minimize");
  };

  const maximizeWindow = () => {
    if (ipcRenderer) ipcRenderer.send("window-maximize");
  };

  const closeWindow = () => {
    if (ipcRenderer) ipcRenderer.send("window-close");
  };

  return (
    <div
      className="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 flex items-center justify-between select-none"
      style={{ WebkitAppRegion: "drag" }}
    >
      <div className="flex items-center gap-2">
        <div className="text-lg font-bold">{title}</div>
      </div>
      <div className="flex gap-1" style={{ WebkitAppRegion: "no-drag" }}>
        <button
          onClick={minimizeWindow}
          className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={maximizeWindow}
          className="w-8 h-8 hover:bg-white hover:bg-opacity-20 rounded flex items-center justify-center transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          </svg>
        </button>
        <button
          onClick={closeWindow}
          className="w-8 h-8 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};
