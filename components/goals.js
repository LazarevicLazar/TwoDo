// Goals Component - Progress Tracking
const GoalsTab = ({
  currentUserData,
  partnerData,
  goals,
  showAddGoal,
  setShowAddGoal,
  newGoal,
  setNewGoal,
  addGoal,
  updateGoalProgress,
  deleteGoal,
  Icon,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon name="Target" className="w-6 h-6 text-green-500" />
          Goals & Milestones
        </h2>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all"
        >
          <Icon name="Plus" className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {showAddGoal && (
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-green-200 mb-4">
          <input
            type="text"
            placeholder="Goal title..."
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && addGoal()}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <textarea
            placeholder="Description (optional)..."
            value={newGoal.description}
            onChange={(e) =>
              setNewGoal({ ...newGoal, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows="2"
          />
          <div className="grid grid-cols-3 gap-2 mb-3">
            <input
              type="number"
              placeholder="Target"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  target: parseInt(e.target.value) || 100,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Current"
              value={newGoal.current}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  current: parseInt(e.target.value) || 0,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) =>
                setNewGoal({ ...newGoal, deadline: e.target.value })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          {partnerData && (
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={newGoal.shared}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, shared: e.target.checked })
                }
                className="w-4 h-4 text-green-500"
              />
              <span className="text-sm text-gray-700">
                Shared goal with {partnerData.name}
              </span>
            </label>
          )}
          <div className="flex gap-2">
            <button
              onClick={addGoal}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Goal
            </button>
            <button
              onClick={() => setShowAddGoal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 max-h-[calc(100vh-22rem)] overflow-y-auto">
        {goals.map((goal) => {
          const progress = Math.min(100, (goal.current / goal.target) * 100);
          const isOwner = goal.ownerId === currentUserData.id;
          const ownerData = isOwner ? currentUserData : partnerData;

          return (
            <div key={goal.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex items-start justify-between flex-1 gap-2">
                      <h3 className="font-bold text-gray-800">{goal.title}</h3>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Icon name="X" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {goal.shared && (
                    <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700 inline-block mb-2">
                      👥 Shared
                    </span>
                  )}
                  {goal.description && (
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  )}
                  {goal.deadline && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Icon name="Clock" className="w-3 h-3" />
                      {new Date(goal.deadline).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <span className="text-xl">{ownerData?.avatar}</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-bold text-green-600">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-2xl font-bold text-green-600 mt-2">
                  {Math.round(progress)}%
                </div>
              </div>

              {isOwner && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => updateGoalProgress(goal.id, -1)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 1)}
                    className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    +1
                  </button>
                  <button
                    onClick={() => updateGoalProgress(goal.id, 10)}
                    className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    +10
                  </button>
                </div>
              )}

              {progress >= 100 && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
                  <Icon
                    name="Award"
                    className="w-8 h-8 text-green-500 mx-auto mb-2"
                  />
                  <div className="text-sm font-medium text-green-700">
                    Goal Completed! 🎉
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {goals.length === 0 && (
          <div className="col-span-2 text-center py-12 text-gray-400">
            <Icon name="Target" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <div>No goals yet</div>
            <div className="text-sm mt-2">
              Set a goal and track your progress! 🎯
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
