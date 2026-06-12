export const aggregateCoinLogs = (
  tasksData: any[] = [],
  transData: any[] = [],
  eventsData: any[] = [],
) => {
  const earnedLogs = tasksData
    .filter((t) => t.completedAt || t.completed_at)
    .map((t) => ({
      id: `earn-${t.id}`,
      type: "earn",
      amount: t.task?.coins || t.tasks?.coins || t.coins || 50,
      translationKey: "earnTask",
      translationParams: {
        title: t.task?.title || t.tasks?.title || "Nhiệm vụ xanh",
      },
      date: new Date(t.completedAt || t.completed_at),
    }));

  const eventEarnedLogs = eventsData
    .filter((e) => e.completedAt || e.completed_at)
    .map((e) => ({
      id: `earn-event-${e.id}`,
      type: "earn",
      amount: e.event?.coins || e.Event?.coins || 100,
      translationKey: "earnEvent",
      translationParams: {
        title: e.event?.title || e.Event?.title || "Sự kiện xanh",
      },
      date: new Date(e.completedAt || e.completed_at),
    }));

  const spentLogs = transData.map((tr) => ({
    id: `spend-${tr.id}`,
    type: "spend",
    amount: tr.totalPrice || tr.total_price || 0,
    translationKey: "spendGift",
    translationParams: {
      title:
        tr.name ||
        tr.itemSnapshot?.name ||
        tr.item_snapshot?.name ||
        tr.item?.name ||
        "Vật phẩm cửa hàng",
    },
    date: new Date(tr.createdAt || tr.created_at),
  }));

  const combinedCoins = [...earnedLogs, ...eventEarnedLogs, ...spentLogs].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return combinedCoins;
};

export const aggregateActivityLogs = (
  tasksData: any[] = [],
  eventsData: any[] = [],
) => {
  const taskActivities = tasksData.map((t) => ({
    id: `act-task-${t.id}`,
    category: "task",
    title: t.task?.title || t.tasks?.title || "Nhiệm vụ xanh",
    statusKey:
      t.completedAt || t.completed_at ? "statusCompleted" : "statusOngoing",
    date: new Date(
      t.completedAt || t.completed_at || t.assignedAt || t.assigned_at,
    ),
    progress: {
      current: t.progressCount || t.progress_count || 0,
      total: t.task?.total || t.tasks?.total || 1,
    },
  }));

  const eventActivities = eventsData.map((e) => {
    const eventObj = e.event || e.Event;
    const completedAt = e.completedAt || e.completed_at;
    const joinedAt = e.joinedAt || e.joined_at;
    const createdAt = e.createdAt || e.created_at;

    return {
      id: `act-event-${e.id}`,
      category: "event",
      title: eventObj?.title || "Sự kiện môi trường",
      statusKey: completedAt
        ? "statusCompleted"
        : joinedAt
          ? "statusCheckin"
          : "statusRegistered",
      date: new Date(completedAt || joinedAt || createdAt),
      details: `Địa điểm: ${eventObj?.location || "Trực tuyến"}`,
    };
  });

  const combinedActivities = [...taskActivities, ...eventActivities].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return combinedActivities;
};