// TwoDo Main App - Modular Architecture with All Features
const { useState, useEffect, useRef } = React;

function sendDesktopNotification(title, body) {
  if (typeof require !== "undefined") {
    const { ipcRenderer } = require("electron");
    ipcRenderer.send("show-notification", { title, body });
  }
}

const TwoDoApp = () => {
  // Auth State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [partnerData, setPartnerData] = useState(null);

  // Data State
  const [tasks, setTasks] = useState([]);
  const [partnerTasks, setPartnerTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [partnerHabits, setPartnerHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [messages, setMessages] = useState([]);

  // UI State
  const [activeTab, setActiveTab] = useState("today");
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [partnerCodeInput, setPartnerCodeInput] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    category: "personal",
    priority: "medium",
    dueDate: new Date().toISOString().split("T")[0],
    recurring: "none",
    shared: false,
  });

  const [newHabit, setNewHabit] = useState({
    title: "",
    category: "health",
    targetStreak: 30,
  });

  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal",
    target: 100,
    current: 0,
    deadline: "",
    shared: true,
  });

  const unsubscribeRef = useRef([]);

  const categories = [
    {
      id: "personal",
      label: "Personal",
      color: "bg-blue-100 text-blue-700",
      icon: "👤",
    },
    {
      id: "work",
      label: "Work",
      color: "bg-purple-100 text-purple-700",
      icon: "💼",
    },
    {
      id: "health",
      label: "Health",
      color: "bg-green-100 text-green-700",
      icon: "💪",
    },
    {
      id: "home",
      label: "Home",
      color: "bg-yellow-100 text-yellow-700",
      icon: "🏠",
    },
    {
      id: "finance",
      label: "Finance",
      color: "bg-emerald-100 text-emerald-700",
      icon: "💰",
    },
    {
      id: "social",
      label: "Social",
      color: "bg-pink-100 text-pink-700",
      icon: "👥",
    },
  ];

  const avatars = ["👨", "👩", "🧑", "👴", "👵", "🧔", "👱", "👨‍💼", "👩‍💼", "🧑‍💻"];
  const colors = [
    "#60a5fa",
    "#f472b6",
    "#a78bfa",
    "#34d399",
    "#fbbf24",
    "#fb923c",
  ];

  // Auth listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        await loadUserData(user.uid);
      } else {
        resetAppState();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const resetAppState = () => {
    setCurrentUserData(null);
    setPartnerData(null);
    setTasks([]);
    setPartnerTasks([]);
    setHabits([]);
    setPartnerHabits([]);
    setGoals([]);
    setMessages([]);
  };

  const loadUserData = async (userId) => {
    try {
      const userDoc = await db.collection("users").doc(userId).get();
      if (userDoc.exists) {
        const userData = { id: userDoc.id, ...userDoc.data() };
        setCurrentUserData(userData);

        if (userData.partnerId) {
          const partnerDoc = await db
            .collection("users")
            .doc(userData.partnerId)
            .get();
          if (partnerDoc.exists) {
            setPartnerData({ id: partnerDoc.id, ...partnerDoc.data() });
            setupPartnerListeners(userData.partnerId);
          }
        }

        setupUserListeners(userId);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const setupUserListeners = (userId) => {
    const tasksUnsub = db
      .collection("tasks")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>
        setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    const habitsUnsub = db
      .collection("habits")
      .where("userId", "==", userId)
      .onSnapshot((snapshot) =>
        setHabits(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    const goalsUnsub = db
      .collection("goals")
      .where("userIds", "array-contains", userId)
      .onSnapshot((snapshot) =>
        setGoals(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    const messagesUnsub = db
      .collection("messages")
      .where("participants", "array-contains", userId)
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      );

    unsubscribeRef.current.push(
      tasksUnsub,
      habitsUnsub,
      goalsUnsub,
      messagesUnsub
    );
  };

  const setupPartnerListeners = (partnerId) => {
    const tasksUnsub = db
      .collection("tasks")
      .where("userId", "==", partnerId)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) =>
        setPartnerTasks(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      );

    const habitsUnsub = db
      .collection("habits")
      .where("userId", "==", partnerId)
      .onSnapshot((snapshot) =>
        setPartnerHabits(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        )
      );

    unsubscribeRef.current.push(tasksUnsub, habitsUnsub);
  };

  useEffect(() => {
    return () => unsubscribeRef.current.forEach((unsub) => unsub());
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!user) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setShowAddTask(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setShowSettings(true);
      }
      if (e.key === "Escape") {
        setShowAddTask(false);
        setShowAddHabit(false);
        setShowAddGoal(false);
        setShowSettings(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [user]);

  // Avatar functions
  const [signupAvatar, setSignupAvatar] = useState("👤");

  const handleAvatarChange = async (avatar) => {
    if (!user) return;
    try {
      await db.collection("users").doc(user.uid).update({ avatar: avatar });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleImageUpload = async (imageData) => {
    if (!user) return;
    try {
      await db.collection("users").doc(user.uid).update({ avatar: imageData });
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  // Initialize Firebase operations
  const operations = user
    ? FirebaseOperations(user, sendDesktopNotification)
    : null;

  // Wrapper functions for components
  const handleAddTask = async () => {
    const success = await operations.addTask(newTask);
    if (success) {
      setNewTask({
        title: "",
        description: "",
        category: "personal",
        priority: "medium",
        dueDate: new Date().toISOString().split("T")[0],
        recurring: "none",
        shared: false,
      });
      setShowAddTask(false);
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const success = await operations.toggleTask(taskId, currentStatus);
    if (success && !currentStatus) {
      const task =
        tasks.find((t) => t.id === taskId) ||
        partnerTasks.find((t) => t.id === taskId);
      sendDesktopNotification(
        "Task Completed! 🎉",
        `Great job completing "${task?.title}"`
      );
    }
  };

  const handleDeleteTask = async (taskId) => {
    await operations.deleteTask(taskId);
  };

  const handleAddReaction = async (taskId, emoji) => {
    await operations.addReaction(taskId, emoji, tasks, partnerTasks);
  };

  const handleAddHabit = async () => {
    const success = await operations.addHabit(newHabit);
    if (success) {
      setNewHabit({ title: "", category: "health", targetStreak: 30 });
      setShowAddHabit(false);
    }
  };

  const handleToggleHabit = async (habitId) => {
    await operations.toggleHabit(habitId, habits);
  };

  const handleDeleteHabit = async (habitId) => {
    await operations.deleteHabit(habitId);
  };

  const handleAddGoal = async () => {
    const success = await operations.addGoal(newGoal, partnerData);
    if (success) {
      setNewGoal({
        title: "",
        description: "",
        category: "personal",
        target: 100,
        current: 0,
        deadline: "",
        shared: true,
      });
      setShowAddGoal(false);
    }
  };

  const handleUpdateGoalProgress = async (goalId, increment) => {
    await operations.updateGoalProgress(goalId, increment, goals);
  };

  const handleDeleteGoal = async (goalId) => {
    await operations.deleteGoal(goalId);
  };

  const handleSendMessage = async () => {
    const success = await operations.sendMessage(newMessage, partnerData);
    if (success) setNewMessage("");
  };

  const handleLinkPartner = async () => {
    const success = await operations.linkPartner(
      partnerCodeInput,
      loadUserData
    );
    if (success) setPartnerCodeInput("");
  };

  // Auth functions
  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === "signup") {
        const userCredential = await auth.createUserWithEmailAndPassword(
          authForm.email,
          authForm.password
        );
        const partnerCode = `${authForm.name
          .substring(0, 3)
          .toUpperCase()}${Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase()}`;
        await db
          .collection("users")
          .doc(userCredential.user.uid)
          .set({
            name: authForm.name,
            email: authForm.email,
            avatar:
              selectedAvatar ||
              avatars[Math.floor(Math.random() * avatars.length)],
            color: colors[Math.floor(Math.random() * colors.length)],
            partnerCode: partnerCode,
            partnerId: null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        sendDesktopNotification(
          "Welcome to TwoDo! 🎉",
          `Account created for ${authForm.name}`
        );
      } else {
        await auth.signInWithEmailAndPassword(
          authForm.email,
          authForm.password
        );
        sendDesktopNotification("Welcome back! 👋", "You're logged in");
      }
    } catch (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setShowSettings(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const copyPartnerCode = () => {
    if (!currentUserData) return;
    navigator.clipboard.writeText(currentUserData.partnerCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  // Login screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent mb-2">
              TwoDo
            </div>
            <p className="text-gray-600">Stay accountable. Together.</p>
          </div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 rounded-lg font-medium ${
                authMode === "login"
                  ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode("signup")}
              className={`flex-1 py-2 rounded-lg font-medium ${
                authMode === "signup"
                  ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Sign Up
            </button>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === "signup" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-center">
                    Choose Your Avatar
                  </label>
                  <div className="flex justify-center mb-3">
                    <AvatarPicker
                      currentAvatar={signupAvatar}
                      onAvatarChange={setSignupAvatar}
                      onImageUpload={setSignupAvatar}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <Icon
                      name="User"
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                    />
                    <input
                      type="text"
                      value={authForm.name}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, name: e.target.value })
                      }
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Icon
                  name="Mail"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Icon
                  name="Lock"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                />
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength="6"
                />
              </div>
            </div>
            {authError && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg"
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!currentUserData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">
          Setting up your account...
        </div>
      </div>
    );
  }

  // Prepare props for components
  const componentProps = {
    currentUserData,
    partnerData,
    tasks,
    partnerTasks,
    habits,
    partnerHabits,
    goals,
    messages,
    categories,
    filterCategory,
    setFilterCategory,
    selectedDate,
    setSelectedDate,
    showAddTask,
    setShowAddTask,
    showAddHabit,
    setShowAddHabit,
    showAddGoal,
    setShowAddGoal,
    newTask,
    setNewTask,
    newHabit,
    setNewHabit,
    newGoal,
    setNewGoal,
    newMessage,
    setNewMessage,
    addTask: handleAddTask,
    toggleTask: handleToggleTask,
    deleteTask: handleDeleteTask,
    addReaction: handleAddReaction,
    addHabit: handleAddHabit,
    toggleHabit: handleToggleHabit,
    deleteHabit: handleDeleteHabit,
    addGoal: handleAddGoal,
    updateGoalProgress: handleUpdateGoalProgress,
    deleteGoal: handleDeleteGoal,
    sendMessage: handleSendMessage,
    setShowSettings,
    Icon,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50">
      {/* Custom Title Bar */}
      <CustomTitleBar title="TwoDo - Together, Better" />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                TwoDo
              </div>
              {partnerData && (
                <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-pink-100 rounded-full">
                  <span className="text-sm">{currentUserData.avatar}</span>
                  <Icon name="Heart" className="w-3 h-3 text-pink-500" />
                  <span className="text-sm">{partnerData.avatar}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Icon name="Settings" className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <AvatarDisplay avatar={currentUserData.avatar} size="sm" />
                <span className="text-sm font-medium">
                  {currentUserData.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
          {[
            { id: "today", label: "Today", icon: "CheckCircle2" },
            { id: "habits", label: "Habits", icon: "Zap" },
            { id: "goals", label: "Goals", icon: "Target" },
            { id: "calendar", label: "Calendar", icon: "Calendar" },
            { id: "stats", label: "Stats", icon: "TrendingUp" },
            { id: "chat", label: "Chat", icon: "MessageCircle" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Icon name={tab.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "today" && <TodayTab {...componentProps} />}
        {activeTab === "habits" && <HabitsTab {...componentProps} />}
        {activeTab === "goals" && <GoalsTab {...componentProps} />}
        {activeTab === "calendar" && <CalendarTab {...componentProps} />}
        {activeTab === "stats" && <EnhancedStatsTab {...componentProps} />}
        {activeTab === "chat" && <ChatTab {...componentProps} />}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Settings</h2>
              <button onClick={() => setShowSettings(false)}>
                <Icon name="X" className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Your Avatar</h3>
                <div className="flex items-center justify-center">
                  <AvatarPicker
                    currentAvatar={currentUserData.avatar}
                    onAvatarChange={handleAvatarChange}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Your Partner Code
                </h3>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentUserData.partnerCode}
                    readOnly
                    className="flex-1 px-3 py-2 bg-white border rounded-lg text-sm font-mono"
                  />
                  <button
                    onClick={copyPartnerCode}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    {copiedCode ? (
                      <Icon name="Check" className="w-4 h-4" />
                    ) : (
                      <Icon name="Copy" className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {!partnerData ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Icon name="UserPlus" className="w-4 h-4" />
                    Link Partner
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Enter your partner's code
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={partnerCodeInput}
                      onChange={(e) =>
                        setPartnerCodeInput(e.target.value.toUpperCase())
                      }
                      placeholder="PARTNER-CODE"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono uppercase"
                    />
                    <button
                      onClick={handleLinkPartner}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      Link
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-pink-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Linked with</p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{partnerData.avatar}</span>
                        <span className="font-medium text-gray-800">
                          {partnerData.name}
                        </span>
                      </div>
                    </div>
                    <Icon name="Heart" className="w-8 h-8 text-pink-500" />
                  </div>
                </div>
              )}

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Version</div>
                <div className="font-medium">TwoDo Enhanced v2.0.0</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">
                  Keyboard Shortcuts
                </div>
                <div className="text-xs space-y-1 mt-2">
                  <div>
                    <kbd className="px-2 py-1 bg-white rounded border">
                      Cmd/Ctrl + N
                    </kbd>{" "}
                    - New Task
                  </div>
                  <div>
                    <kbd className="px-2 py-1 bg-white rounded border">
                      Cmd/Ctrl + ,
                    </kbd>{" "}
                    - Settings
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
              >
                <Icon name="LogOut" className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<TwoDoApp />, document.getElementById("root"));
