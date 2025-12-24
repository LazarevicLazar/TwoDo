// Chat Component - Partner Messaging
const ChatTab = ({
  currentUserData,
  partnerData,
  messages,
  newMessage,
  setNewMessage,
  sendMessage,
  setShowSettings,
  Icon,
}) => {
  if (!partnerData) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon name="MessageCircle" className="w-6 h-6 text-blue-500" />
          Messages
        </h2>
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Icon
            name="MessageCircle"
            className="w-16 h-16 mx-auto mb-4 text-gray-300"
          />
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            No Partner Linked
          </h3>
          <p className="text-gray-600 mb-4">
            Link with your partner to start messaging
          </p>
          <button
            onClick={() => setShowSettings(true)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Link Partner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon name="MessageCircle" className="w-6 h-6 text-blue-500" />
          Messages
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-pink-100 rounded-lg">
          <span className="text-sm font-medium text-gray-700">
            Chatting with {partnerData.name}
          </span>
          <AvatarDisplay avatar={partnerData.avatar} size="md" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <Icon
              name="MessageCircle"
              className="w-12 h-12 mx-auto mb-4 opacity-50"
            />
            <div>No messages yet</div>
            <div className="text-sm mt-2">
              Send a message to start the conversation! 💬
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {messages.map((msg) => {
              const isMine = msg.senderId === currentUserData.id;
              const sender = isMine ? currentUserData : partnerData;

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    isMine ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <AvatarDisplay avatar={sender.avatar} size="md" />
                  <div
                    className={`flex-1 max-w-md ${
                      isMine ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-2xl ${
                        isMine
                          ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.timestamp?.toDate?.()
                        ? msg.timestamp.toDate().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Just now"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
