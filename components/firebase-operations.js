// Firebase CRUD Operations
const FirebaseOperations = (user, sendDesktopNotification) => {
  // Tasks
  const addTask = async (taskData) => {
    if (!taskData.title.trim() || !user) return;
    try {
      await db.collection("tasks").add({
        ...taskData,
        userId: user.uid,
        completed: false,
        reactions: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      sendDesktopNotification("Task Added", `"${taskData.title}" added`);
      return true;
    } catch (error) {
      console.error("Error adding task:", error);
      return false;
    }
  };

  const toggleTask = async (taskId, currentStatus) => {
    try {
      await db
        .collection("tasks")
        .doc(taskId)
        .update({
          completed: !currentStatus,
          completedAt: !currentStatus
            ? firebase.firestore.FieldValue.serverTimestamp()
            : null,
        });
      return true;
    } catch (error) {
      console.error("Error toggling task:", error);
      return false;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await db.collection("tasks").doc(taskId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      return false;
    }
  };

  const addReaction = async (taskId, emoji, tasks, partnerTasks) => {
    try {
      const task =
        tasks.find((t) => t.id === taskId) ||
        partnerTasks.find((t) => t.id === taskId);
      await db
        .collection("tasks")
        .doc(taskId)
        .update({
          reactions: [...(task?.reactions || []), emoji],
        });
      return true;
    } catch (error) {
      console.error("Error adding reaction:", error);
      return false;
    }
  };

  // Habits
  const addHabit = async (habitData) => {
    if (!habitData.title.trim() || !user) return;
    try {
      await db.collection("habits").add({
        ...habitData,
        userId: user.uid,
        currentStreak: 0,
        bestStreak: 0,
        completedDates: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error adding habit:", error);
      return false;
    }
  };

  const toggleHabit = async (habitId, habits) => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return false;

    const today = new Date().toISOString().split("T")[0];
    const completedDates = habit.completedDates || [];
    const isCompletedToday = completedDates.includes(today);
    const newDates = isCompletedToday
      ? completedDates.filter((d) => d !== today)
      : [...completedDates, today];
    const newStreak = isCompletedToday
      ? Math.max(0, habit.currentStreak - 1)
      : habit.currentStreak + 1;

    try {
      await db
        .collection("habits")
        .doc(habitId)
        .update({
          completedDates: newDates,
          currentStreak: newStreak,
          bestStreak: Math.max(habit.bestStreak, newStreak),
        });
      return true;
    } catch (error) {
      console.error("Error toggling habit:", error);
      return false;
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await db.collection("habits").doc(habitId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting habit:", error);
      return false;
    }
  };

  // Goals
  const addGoal = async (goalData, partnerData) => {
    if (!goalData.title.trim() || !user) return;
    try {
      const userIds =
        goalData.shared && partnerData
          ? [user.uid, partnerData.id]
          : [user.uid];
      await db.collection("goals").add({
        ...goalData,
        ownerId: user.uid,
        userIds: userIds,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error adding goal:", error);
      return false;
    }
  };

  const updateGoalProgress = async (goalId, increment, goals) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return false;

    const newCurrent = Math.max(
      0,
      Math.min(goal.target, goal.current + increment)
    );
    try {
      await db.collection("goals").doc(goalId).update({ current: newCurrent });
      return true;
    } catch (error) {
      console.error("Error updating goal:", error);
      return false;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      await db.collection("goals").doc(goalId).delete();
      return true;
    } catch (error) {
      console.error("Error deleting goal:", error);
      return false;
    }
  };

  // Messages
  const sendMessage = async (messageText, partnerData) => {
    if (!messageText.trim() || !user || !partnerData) return;
    try {
      await db.collection("messages").add({
        text: messageText,
        senderId: user.uid,
        participants: [user.uid, partnerData.id],
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    }
  };

  // Partner
  const linkPartner = async (partnerCode, loadUserData) => {
    if (!partnerCode.trim()) return;
    try {
      const usersSnapshot = await db
        .collection("users")
        .where("partnerCode", "==", partnerCode.toUpperCase())
        .get();

      if (usersSnapshot.empty) {
        alert("Partner code not found!");
        return false;
      }

      const partnerDoc = usersSnapshot.docs[0];
      const partnerId = partnerDoc.id;

      if (partnerId === user.uid) {
        alert("You can't link with yourself!");
        return false;
      }

      await db
        .collection("users")
        .doc(user.uid)
        .update({ partnerId: partnerId });
      await db
        .collection("users")
        .doc(partnerId)
        .update({ partnerId: user.uid });

      sendDesktopNotification(
        "Partner Linked! ❤️",
        `You're now linked with ${partnerDoc.data().name}`
      );
      await loadUserData(user.uid);
      return true;
    } catch (error) {
      console.error("Error linking partner:", error);
      alert("Error linking partner. Please try again.");
      return false;
    }
  };

  return {
    addTask,
    toggleTask,
    deleteTask,
    addReaction,
    addHabit,
    toggleHabit,
    deleteHabit,
    addGoal,
    updateGoalProgress,
    deleteGoal,
    sendMessage,
    linkPartner,
  };
};
