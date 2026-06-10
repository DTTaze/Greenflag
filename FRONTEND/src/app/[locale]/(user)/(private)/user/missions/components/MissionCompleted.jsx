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
        : (response?.data && Array.isArray(response.data)
          ? response.data
          : (response && typeof response === "object" && "data" in response && Array.isArray(response.data?.data)
            ? response.data.data
            : []));

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
    <div className="w-full rounded-lg bg-white p-4 shadow-md">
      <h2 className="text-xl font-bold">Danh sách nhiệm vụ đã hoàn thành</h2>

      {loading ? (
        <div className="p-4 text-center text-gray-500">Đang tải...</div>
      ) : userCompletedTasks.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                {columns.map(({ key, label }) => (
                  <th
                    key={key}
                    className="cursor-pointer border p-2"
                    onClick={() => requestSort(key)}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <tr key={task.id} className="border">
                  <td className="border p-2 font-mono text-xs">{task.id}</td>
                  <td className="border p-2">{task.name}</td>
                  <td className="border p-2 text-center font-medium">
                    +{task.points}
                  </td>
                  <td className="border p-2 text-right">
                    {formatDate(task.completedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          Không có nhiệm vụ nào
        </div>
      )}
    </div>
  );
}

export default MissionCompleted;
