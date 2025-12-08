// Calendar Component - Date View & Week Overview
const CalendarTab = ({
  currentUserData,
  partnerData,
  tasks,
  partnerTasks,
  categories,
  selectedDate,
  setSelectedDate,
  toggleTask,
  Icon,
}) => {
  const getTasksForDate = (taskList, date) => {
    return taskList.filter((t) => t.dueDate === date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Icon name="Calendar" className="w-6 h-6 text-blue-500" />
          Calendar View
        </h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <AvatarDisplay avatar={currentUserData.avatar} size="md" />
            My Schedule
          </h3>
          <div className="space-y-3">
            {getTasksForDate(tasks, selectedDate).map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg p-4 shadow-sm border-l-4"
                style={{ borderColor: currentUserData.color }}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task.id, task.completed)}
                    className="mt-0.5"
                  >
                    {task.completed ? (
                      <Icon
                        name="CheckCircle2"
                        className="w-5 h-5"
                        style={{ color: currentUserData.color }}
                      />
                    ) : (
                      <Icon name="Circle" className="w-5 h-5 text-gray-300" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          categories.find((c) => c.id === task.category)?.color
                        }`}
                      >
                        {categories.find((c) => c.id === task.category)?.icon}{" "}
                        {task.category}
                      </span>
                      {task.recurring !== "none" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          🔄 {task.recurring}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {getTasksForDate(tasks, selectedDate).length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Icon
                  name="Calendar"
                  className="w-10 h-10 mx-auto mb-3 opacity-50"
                />
                <div className="text-sm">No tasks for this date</div>
              </div>
            )}
          </div>
        </div>

        {partnerData && (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <AvatarDisplay avatar={partnerData.avatar} size="md" />
              {partnerData.name}'s Schedule
            </h3>
            <div className="space-y-3">
              {getTasksForDate(partnerTasks, selectedDate).map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg p-4 shadow-sm border-l-4"
                  style={{ borderColor: partnerData.color }}
                >
                  <div className="flex items-start gap-3">
                    {task.completed ? (
                      <Icon
                        name="CheckCircle2"
                        className="w-5 h-5 mt-0.5"
                        style={{ color: partnerData.color }}
                      />
                    ) : (
                      <Icon
                        name="Circle"
                        className="w-5 h-5 text-gray-300 mt-0.5"
                      />
                    )}
                    <div className="flex-1">
                      <h4
                        className={`font-medium ${
                          task.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {task.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          categories.find((c) => c.id === task.category)?.color
                        } inline-block mt-2`}
                      >
                        {categories.find((c) => c.id === task.category)?.icon}{" "}
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {getTasksForDate(partnerTasks, selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Icon
                    name="Calendar"
                    className="w-10 h-10 mx-auto mb-3 opacity-50"
                  />
                  <div className="text-sm">No tasks for this date</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Week Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">7-Day Overview</h3>
        <div className="grid grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - 3 + i);
            const dateStr = date.toISOString().split("T")[0];
            const dayTasks = [
              ...getTasksForDate(tasks, dateStr),
              ...getTasksForDate(partnerTasks, dateStr),
            ];
            const completedCount = dayTasks.filter((t) => t.completed).length;
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <button
                key={i}
                onClick={() => setSelectedDate(dateStr)}
                className={`p-3 rounded-lg text-center transition-all ${
                  selectedDate === dateStr
                    ? "bg-gradient-to-br from-blue-500 to-pink-500 text-white shadow-lg"
                    : isToday
                    ? "bg-blue-50 border-2 border-blue-300"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="text-xs font-medium mb-1">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div
                  className={`text-lg font-bold ${
                    selectedDate === dateStr ? "text-white" : "text-gray-800"
                  }`}
                >
                  {date.getDate()}
                </div>
                {dayTasks.length > 0 && (
                  <div className="mt-1">
                    <div
                      className={`text-xs ${
                        selectedDate === dateStr
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {completedCount}/{dayTasks.length}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
