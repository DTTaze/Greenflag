import { useCallback, useEffect, useMemo, useState } from "react";

import { getMyCompletedTasks, getUser } from "@/src/utils/api";

function MissionCompleted() {
  const [userCompletedTasks, setUserCompletedTasks] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);

  const fetchUserCompletedTasks = useCallback(async () => {
    try {
      await getUser();
      const response = await getMyCompletedTasks();
      const tasks = Array.isArray(response)
        ? response
        : response?.data && Array.isArray(response.data)
          ? response.data
          : response &&
              typeof response === "object" &&
              "data" in response &&
              Array.isArray(response.data?.data)
            ? response.data.data
            : [];

      setUserCompletedTasks(
        tasks.map(({ id, title, coins, created_at, createdAt }) => ({
          id,
          name: title,
          points: coins,
          completedAt: created_at || createdAt,
        })),
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserCompletedTasks();
  }, [fetchUserCompletedTasks]);

  const requestSort = (key) => {
    setSortOrder((prevOrder) =>
      sortKey === key && prevOrder === "asc" ? "desc" : "asc",
    );
    setSortKey(key);
  };

  const sortedTasks = useMemo(() => {
    return [...userCompletedTasks].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [userCompletedTasks, sortKey, sortOrder]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Tên nhiệm vụ" },
    { key: "points", label: "Điểm" },
    { key: "completedAt", label: "Ngày hoàn thành" },
  ];

  return (
    <div className="transform overflow-hidden rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-xl transition-all duration-300 dark:border-emerald-500/15 dark:bg-zinc-950">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Danh sách nhiệm vụ đã hoàn thành</h2>

      {loading ? (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">Đang tải...</div>
      ) : userCompletedTasks.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-emerald-100 dark:border-emerald-500/10">
            <thead>
              <tr className="bg-emerald-50/50 dark:bg-zinc-900/50">
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    className="cursor-pointer border border-emerald-100 p-3 text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:border-emerald-500/10 dark:text-zinc-300 hover:bg-emerald-100/50 dark:hover:bg-zinc-800/50 transition-colors"
                    onClick={() => requestSort(key)}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id} className="border-b border-emerald-100 dark:border-emerald-500/10 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="border border-emerald-100 p-3 font-mono text-xs text-zinc-600 dark:border-emerald-500/10 dark:text-zinc-400">{task.id}</td>
                  <td className="border border-emerald-100 p-3 text-sm text-zinc-800 dark:border-emerald-500/10 dark:text-zinc-200">{task.name}</td>
                  <td className="border border-emerald-100 p-3 text-center font-bold text-emerald-600 dark:border-emerald-500/10 dark:text-emerald-400">
                    +{task.points}
                  </td>
                  <td className="border border-emerald-100 p-3 text-right text-xs text-zinc-500 dark:border-emerald-500/10 dark:text-zinc-400">
                    {formatDate(task.completedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">
          Không có nhiệm vụ nào
        </div>
      )}
    </div>
  );
}

export default MissionCompleted;
