function TodoApp() {
  const [tasks, setTasks] = React.useState(() => {
    try {
      const raw = localStorage.getItem("todo.tasks.v1");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [editingTask, setEditingTask] = React.useState(null);

  React.useEffect(() => {
    localStorage.setItem("todo.tasks.v1", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(e) {
    e?.preventDefault?.();
    const trimmed = description.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now(),
      description: trimmed,
      dueDate: dueDate || null,
      isCompleted: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setDescription("");
    setDueDate("");
  }

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t
      )
    );
  }

  function handleRemove(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(task) {
    setEditingTask({ ...task });
  }

  function saveEdit() {
    if (!editingTask) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTask.id ? editingTask : t))
    );
    setEditingTask(null);
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  function formatDue(d) {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  }

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1585543253202-04d3d9f11961?q=80&w=1770&auto=format&fit=crop')",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 bg-white/80 inline-block px-4 py-2 rounded-lg">
            ToDo List (React)
          </h1>
        </header>

        <main className="bg-white/90 p-6 rounded-2xl shadow-lg">
          <form
            onSubmit={handleAddTask}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
          >
            <div className="md:col-span-2">
              <label
                htmlFor="desc"
                className="block text-sm font-medium text-gray-700"
              >
                Task Description
              </label>
              <input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) handleAddTask(e);
                }}
                placeholder="Write a task..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring p-2"
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="due"
                className="block text-sm font-medium text-gray-700"
              >
                Due Date
              </label>
              <input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring p-2"
              />
            </div>

            <div className="md:col-span-3 flex gap-2 justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
              >
                Add Task
              </button>
              <button
                type="button"
                onClick={() => {
                  setDescription("");
                  setDueDate("");
                }}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Clear
              </button>
            </div>
          </form>

          <section className="mt-6">
            <h2 className="text-xl font-semibold mb-3">Tasks</h2>
            {tasks.length === 0 ? (
              <p className="text-gray-600">
                No tasks yet — add your first one above.
              </p>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className={`p-3 rounded-lg shadow-sm flex items-start justify-between ${
                      task.isCompleted ? "bg-gray-50 opacity-90" : "bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        id={`chk-${task.id}`}
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleComplete(task.id)}
                        className="mt-1"
                      />
                      <div>
                        <label
                          htmlFor={`chk-${task.id}`}
                          className={`block font-medium ${
                            task.isCompleted
                              ? "line-through text-gray-500"
                              : "text-gray-900"
                          }`}
                        >
                          {task.description}
                        </label>
                        <div className="text-sm text-gray-500">
                          Due: {formatDue(task.dueDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemove(task.id)}
                        className="px-3 py-1 border rounded text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {editingTask && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="absolute inset-0 bg-black/40"
                onClick={cancelEdit}
              />
              <div className="relative bg-white rounded-lg p-6 shadow-xl w-11/12 max-w-md z-10">
                <h3 className="text-lg font-semibold mb-2">Edit Task</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm">Description</label>
                    <input
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Due Date</label>
                    <input
                      type="date"
                      value={editingTask.dueDate || ""}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          dueDate: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border p-2"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded border"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center text-sm text-gray-700 mt-4">
          Made with ❤️ — React ToDo
        </footer>
      </div>
    </div>
  );
}
