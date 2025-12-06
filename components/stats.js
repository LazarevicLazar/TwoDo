// Enhanced Stats Component
const EnhancedStatsTab = ({
  currentUserData,
  partnerData,
  tasks,
  partnerTasks,
  habits,
  partnerHabits,
  goals,
  categories,
  Icon,
}) => {
  const getStats = (userTasks) => {
    const today = new Date().toISOString().split("T")[0];
    const todayTasks = userTasks.filter((t) => t.dueDate === today);
    const completed = todayTasks.filter((t) => t.completed).length;
    const total = todayTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekTasks = userTasks.filter((t) => new Date(t.dueDate) >= weekAgo);
    const weekCompleted = weekTasks.filter((t) => t.completed).length;
    return {
      completed,
      total,
      percentage,
      weekCompleted,
      weekTotal: weekTasks.length,
    };
  };

  const myStats = getStats(tasks);
  const partnerStats = getStats(partnerTasks);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Icon name="TrendingUp" className="w-6 h-6 text-purple-500" />
        Statistics & Insights
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{currentUserData.avatar}</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {currentUserData.name}
              </h3>
              <p className="text-sm text-gray-600">Your Performance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tasks Today</span>
                <span
                  className="font-bold"
                  style={{ color: currentUserData.color }}
                >
                  {myStats.completed}/{myStats.total}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: `${myStats.percentage}%`,
                    backgroundColor: currentUserData.color,
                  }}
                />
              </div>
              <div
                className="text-3xl font-bold text-center mt-3"
                style={{ color: currentUserData.color }}
              >
                {myStats.percentage}%
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {myStats.weekCompleted}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Week Total</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500">
                    {habits.reduce((sum, h) => sum + h.currentStreak, 0)}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Streaks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    {
                      goals.filter(
                        (g) =>
                          g.ownerId === currentUserData.id &&
                          g.current >= g.target
                      ).length
                    }
                  </div>
                  <div className="text-xs text-gray-600 mt-1">Goals Done</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {partnerData && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">{partnerData.avatar}</span>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {partnerData.name}
                </h3>
                <p className="text-sm text-gray-600">Partner Performance</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Tasks Today</span>
                  <span
                    className="font-bold"
                    style={{ color: partnerData.color }}
                  >
                    {partnerStats.completed}/{partnerStats.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${partnerStats.percentage}%`,
                      backgroundColor: partnerData.color,
                    }}
                  />
                </div>
                <div
                  className="text-3xl font-bold text-center mt-3"
                  style={{ color: partnerData.color }}
                >
                  {partnerStats.percentage}%
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-500">
                      {partnerStats.weekCompleted}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Week Total</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">
                      {partnerHabits.reduce(
                        (sum, h) => sum + h.currentStreak,
                        0
                      )}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Streaks</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">
                      {
                        goals.filter(
                          (g) =>
                            g.ownerId === partnerData.id &&
                            g.current >= g.target
                        ).length
                      }
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Goals Done</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-pink-500 rounded-xl p-6 shadow-lg text-white">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Icon name="Heart" className="w-6 h-6" />
          Team Performance
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {myStats.completed + partnerStats.completed}
            </div>
            <div className="text-sm opacity-90">Tasks Completed Today</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {myStats.weekCompleted + partnerStats.weekCompleted}
            </div>
            <div className="text-sm opacity-90">Tasks This Week</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {habits.reduce((sum, h) => sum + h.currentStreak, 0) +
                partnerHabits.reduce((sum, h) => sum + h.currentStreak, 0)}
            </div>
            <div className="text-sm opacity-90">Combined Streaks</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {goals.filter((g) => g.current >= g.target).length}/{goals.length}
            </div>
            <div className="text-sm opacity-90">Goals Achieved</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Category Breakdown
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const myTasks = tasks.filter((t) => t.category === cat.id);
            const partnerTasksByCategory = partnerTasks.filter(
              (t) => t.category === cat.id
            );
            const totalTasks = myTasks.length + partnerTasksByCategory.length;
            const completedTasks = [
              ...myTasks,
              ...partnerTasksByCategory,
            ].filter((t) => t.completed).length;

            if (totalTasks === 0) return null;

            return (
              <div key={cat.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-gray-800">
                      {cat.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">
                    {completedTasks}/{totalTasks}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                      }%`,
                      backgroundColor: cat.color.includes("blue")
                        ? "#3b82f6"
                        : cat.color.includes("purple")
                        ? "#a78bfa"
                        : cat.color.includes("green")
                        ? "#34d399"
                        : cat.color.includes("yellow")
                        ? "#fbbf24"
                        : cat.color.includes("emerald")
                        ? "#10b981"
                        : "#f472b6",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
