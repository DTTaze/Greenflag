export const aggregateCoinLogs = (tasksData = [], transData = []) => {
  const earnedLogs = tasksData
    .filter((t) => t.completed_at)
    .map((t) => ({
      id: `earn-${t.id}`,
      type: "earn",
      amount: t.tasks?.coins || t.coins || 50,
      description: `Hoàn thành nhiệm vụ: ${t.tasks?.title || "Nhiệm vụ xanh"}`,
      date: new Date(t.completed_at),
    }));

  const spentLogs = transData.map((tr) => ({
    id: `spend-${tr.id}`,
    type: "spend",
    amount: tr.total_price || 0,
    description: `Đổi quà: ${tr.name || tr.item_snapshot?.name || "Vật phẩm cửa hàng"}`,
    date: new Date(tr.createdAt),
  }));

  const combinedCoins = [...earnedLogs, ...spentLogs].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  // Fallback mocks if empty
  if (combinedCoins.length === 0) {
    return [
      {
        id: "mock-earn-1",
        type: "earn",
        amount: 100,
        description: "Hoàn thành nhiệm vụ: Phân loại rác thải nhựa tại nhà",
        date: new Date(Date.now() - 3600000 * 2),
      },
      {
        id: "mock-spend-1",
        type: "spend",
        amount: 50,
        description: "Đổi quà: Voucher giảm giá Shopee 20K",
        date: new Date(Date.now() - 3600000 * 24),
      },
      {
        id: "mock-earn-2",
        type: "earn",
        amount: 80,
        description: "Điểm danh tham gia: Ngày hội dọn rác bãi biển",
        date: new Date(Date.now() - 3600000 * 48),
      },
    ];
  }

  return combinedCoins;
};

export const aggregateActivityLogs = (tasksData = [], eventsData = []) => {
  const taskActivities = tasksData.map((t) => ({
    id: `act-task-${t.id}`,
    category: "task",
    title: t.tasks?.title || "Nhiệm vụ xanh",
    status: t.completed_at ? "Đã hoàn thành" : "Đang thực hiện",
    date: new Date(t.completed_at || t.assigned_at),
    details: `Tiến độ: ${t.progress_count || 0}/${t.tasks?.total || 1}`,
  }));

  const eventActivities = eventsData.map((e) => ({
    id: `act-event-${e.id}`,
    category: "event",
    title: e.Event?.title || "Sự kiện môi trường",
    status: e.completed_at ? "Đã check-in" : "Đã đăng ký",
    date: new Date(e.joined_at || e.created_at),
    details: `Địa điểm: ${e.Event?.location || "Trực tuyến"}`,
  }));

  const combinedActivities = [...taskActivities, ...eventActivities].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  // Fallback mocks if empty
  if (combinedActivities.length === 0) {
    return [
      {
        id: "mock-act-1",
        category: "task",
        title: "Trồng thêm một cây xanh ở ban công",
        status: "Đã hoàn thành",
        date: new Date(Date.now() - 3600000 * 12),
        details: "Nhận được +50 xu",
      },
      {
        id: "mock-act-2",
        category: "event",
        title: "Chiến dịch làm sạch kênh Nhiêu Lộc",
        status: "Đã đăng ký",
        date: new Date(Date.now() - 3600000 * 36),
        details: "Địa điểm: Kênh Nhiêu Lộc, Quận 3",
      },
    ];
  }

  return combinedActivities;
};
