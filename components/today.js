// Today Tab - Enhanced Tasks View
const TodayTab = ({
  currentUserData,
  partnerData,
  tasks,
  partnerTasks,
  categories,
  filterCategory,
  setFilterCategory,
  selectedDate,
  showAddTask,
  setShowAddTask,
  newTask,
  setNewTask,
  addTask,
  toggleTask,
  deleteTask,
  addReaction,
  Icon,
}) => {
  const filteredTasks = (taskList) => {
    let filtered = taskList.filter((t) => t.dueDate === selectedDate);
    if (filterCategory !== "all")
      filtered = filtered.filter((t) => t.category === filterCategory);
    return filtered;
  };

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterCategory("all")}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            filterCategory === "all"
              ? "bg-gray-800 text-white"
              : "bg-white text-gray-600 hover:bg-gray-100"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? `${cat.color} shadow-md`
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <span>{cat.icon}</span>
            <span className="text-sm font-medium">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* My Tasks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">{currentUserData.avatar}</span>
            My Tasks
          </h2>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all"
          >
            <Icon name="Plus" className="w-4 h-4" />
            Add Task
          </button>
        </div>

        {showAddTask && (
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-200 mb-4 fade-in">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              autoFocus
              className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows="2"
            />
            <div className="grid grid-cols-2 gap-2 mb-3">
              <select
                value={newTask.category}
                onChange={(e) =>
                  setNewTask({ ...newTask, category: e.target.value })
                }
                className="px-3 py-2 border rounded-lg"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
              <select
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: e.target.value })
                }
                className="px-3 py-2 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) =>
                  setNewTask({ ...newTask, dueDate: e.target.value })
                }
                className="px-3 py-2 border rounded-lg"
              />
              <select
                value={newTask.recurring}
                onChange={(e) =>
                  setNewTask({ ...newTask, recurring: e.target.value })
                }
                className="px-3 py-2 border rounded-lg"
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            {partnerData && (
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={newTask.shared}
                  onChange={(e) =>
                    setNewTask({ ...newTask, shared: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  Share with {partnerData.name}
                </span>
              </label>
            )}
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {filteredTasks(tasks).map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100 hover:border-gray-200 fade-in transition-colors"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTask(task.id, task.completed)}
                  className="flex-shrink-0 hover:scale-110 transition-transform"
                >
                  {task.completed ? (
                    <Icon
                      name="CheckCircle2"
                      className="w-6 h-6"
                      style={{ color: currentUserData.color }}
                    />
                  ) : (
                    <Icon name="Circle" className="w-6 h-6 text-gray-300" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className={`font-medium ${
                          task.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Icon name="X" className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        categories.find((c) => c.id === task.category)?.color
                      }`}
                    >
                      {categories.find((c) => c.id === task.category)?.icon}{" "}
                      {task.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {task.priority}
                    </span>
                    {task.recurring !== "none" && (
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                        🔄 {task.recurring}
                      </span>
                    )}
                    {task.shared && (
                      <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                        👥 Shared
                      </span>
                    )}
                  </div>
                  {task.completed && (
                    <div className="flex gap-1 mt-3">
                      {["❤️", "👍", "🔥", "😊"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addReaction(task.id, emoji)}
                          className="text-lg hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                      {task.reactions?.length > 0 && (
                        <div className="ml-2 flex gap-1">
                          {task.reactions.map((r, i) => (
                            <span key={i}>{r}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredTasks(tasks).length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Icon
                name="CheckCircle2"
                className="w-12 h-12 mx-auto mb-4 opacity-50"
              />
              <div>No tasks for today</div>
              <div className="text-sm mt-2">Add a task to get started! 🎯</div>
            </div>
          )}
        </div>
      </div>

      {/* Partner's Tasks */}
      {partnerData && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">{partnerData.avatar}</span>
            {partnerData.name}'s Tasks
          </h2>
          <div className="space-y-3">
            {filteredTasks(partnerTasks).map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100"
              >
                <div className="flex items-start gap-3">
                  {task.completed ? (
                    <Icon
                      name="CheckCircle2"
                      className="w-6 h-6"
                      style={{ color: partnerData.color }}
                    />
                  ) : (
                    <Icon name="Circle" className="w-6 h-6 text-gray-300" />
                  )}
                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          categories.find((c) => c.id === task.category)?.color
                        }`}
                      >
                        {categories.find((c) => c.id === task.category)?.icon}{" "}
                        {task.category}
                      </span>
                    </div>
                    {task.completed && (
                      <div className="flex gap-1 mt-3">
                        {["❤️", "👍", "🔥", "😊"].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => addReaction(task.id, emoji)}
                            className="text-lg hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                        {task.reactions?.length > 0 && (
                          <div className="ml-2 flex gap-1">
                            {task.reactions.map((r, i) => (
                              <span key={i}>{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {filteredTasks(partnerTasks).length === 0 && (
              <div className="text-center py-12 text-gray-400">
                No tasks for today 📝
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
