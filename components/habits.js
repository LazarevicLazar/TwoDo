// Habits Component - Streak Tracking
const HabitsTab = ({
  currentUserData,
  partnerData,
  habits,
  partnerHabits,
  categories,
  showAddHabit,
  setShowAddHabit,
  newHabit,
  setNewHabit,
  addHabit,
  toggleHabit,
  deleteHabit,
  Icon,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon name="Zap" className="w-6 h-6 text-orange-500" />
          Daily Habits
        </h2>
        <button
          onClick={() => setShowAddHabit(!showAddHabit)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Icon name="Plus" className="w-4 h-4" />
          Add Habit
        </button>
      </div>

      {showAddHabit && (
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-orange-200 mb-4">
          <input
            type="text"
            placeholder="Habit title..."
            value={newHabit.title}
            onChange={(e) =>
              setNewHabit({ ...newHabit, title: e.target.value })
            }
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="grid grid-cols-2 gap-2 mb-3">
            <select
              value={newHabit.category}
              onChange={(e) =>
                setNewHabit({ ...newHabit, category: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Target streak"
              value={newHabit.targetStreak}
              onChange={(e) =>
                setNewHabit({
                  ...newHabit,
                  targetStreak: parseInt(e.target.value) || 30,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={addHabit}
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Add Habit
            </button>
            <button
              onClick={() => setShowAddHabit(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 max-h-[calc(100vh-24rem)] overflow-y-auto">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 sticky top-0 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 py-2">
            <span className="text-xl">{currentUserData.avatar}</span>
            My Habits
          </h3>
          <div className="space-y-3">
            {habits.map((habit) => {
              const today = new Date().toISOString().split("T")[0];
              const completedToday = habit.completedDates?.includes(today);
              return (
                <div
                  key={habit.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">
                            {habit.title}
                          </h4>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              categories.find((c) => c.id === habit.category)
                                ?.color
                            } inline-block mt-1`}
                          >
                            {
                              categories.find((c) => c.id === habit.category)
                                ?.icon
                            }{" "}
                            {habit.category}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteHabit(habit.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Icon name="X" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleHabit(habit.id)}
                      className={`p-2 rounded-lg transition-all flex-shrink-0 ${
                        completedToday
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                      }`}
                    >
                      {completedToday ? (
                        <Icon name="CheckCircle2" className="w-5 h-5" />
                      ) : (
                        <Icon name="Circle" className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                          {habit.currentStreak}
                        </div>
                        <div className="text-xs text-gray-600">Current</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">
                          {habit.bestStreak}
                        </div>
                        <div className="text-xs text-gray-600">Best</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">
                        {habit.currentStreak}/{habit.targetStreak}
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              (habit.currentStreak / habit.targetStreak) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {habits.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Icon
                  name="Zap"
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                />
                <div>No habits yet</div>
                <div className="text-sm mt-2">
                  Add a habit to start building streaks! 🔥
                </div>
              </div>
            )}
          </div>
        </div>

        {partnerData && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2 sticky top-0 bg-gradient-to-br from-blue-50 via-pink-50 to-purple-50 py-2">
              <span className="text-xl">{partnerData.avatar}</span>
              {partnerData.name}'s Habits
            </h3>
            <div className="space-y-3">
              {partnerHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">
                        {habit.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          categories.find((c) => c.id === habit.category)?.color
                        } inline-block mt-1`}
                      >
                        {categories.find((c) => c.id === habit.category)?.icon}{" "}
                        {habit.category}
                      </span>
                    </div>
                    <Icon name="Flame" className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">
                        {habit.currentStreak}
                      </div>
                      <div className="text-xs text-gray-600">Current</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-400">
                        {habit.bestStreak}
                      </div>
                      <div className="text-xs text-gray-600">Best</div>
                    </div>
                  </div>
                </div>
              ))}
              {partnerHabits.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No habits yet 🔥
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
