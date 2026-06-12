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
    <div className="transform overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/50 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Nhiệm vụ đã hoàn thành
        </h2>
        {userCompletedTasks.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 font-semibold uppercase">Sắp xếp:</span>
            <select
              value={sortKey}
              onChange={(e) => requestSort(e.target.value)}
              className="rounded-xl border border-emerald-200/60 bg-white px-3 py-1.5 font-semibold text-zinc-700 focus:outline-none dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-300"
            >
              <option value="id">ID</option>
              <option value="name">Tên nhiệm vụ</option>
              <option value="points">Xu thưởng</option>
              <option value="completedAt">Ngày hoàn thành</option>
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400">Đang tải...</div>
      ) : userCompletedTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-3xl border border-emerald-100/80 dark:border-emerald-500/10 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-brand-emerald dark:hover:border-brand-emerald/50 transition-all duration-300 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-0.5 rounded-lg">
                  ID: {task.id}
                </span>
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                  {formatDate(task.completedAt)}
                </span>
              </div>
              <h4 className="mt-3.5 font-bold text-zinc-800 dark:text-zinc-200 line-clamp-1">
                {task.name}
              </h4>
              <div className="mt-4 flex items-center justify-between border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Phần thưởng:</span>
                <span className="inline-flex items-center text-sm font-bold text-brand-emerald">
                  +{task.points.toLocaleString()} 🪙
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-zinc-500 dark:text-zinc-450 font-medium">
          Bạn chưa hoàn thành nhiệm vụ nào. Hãy bắt đầu khám phá các thử thách sống xanh!
        </div>
      )}
    </div>
  );
}

export default MissionCompleted;
