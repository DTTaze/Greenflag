import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';

import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { Item } from '../modules/commerce/entities/item.entity';
import { Product } from '../modules/commerce/entities/product.entity';
import { Transaction } from '../modules/commerce/entities/transaction.entity';
import { DeliveryAccount } from '../modules/delivery/entities/delivery-account.entity';
import { DeliveryOrder } from '../modules/delivery/entities/delivery-order.entity';
import { ReceiverInformation } from '../modules/delivery/entities/receiver-information.entity';
import { EventUser } from '../modules/event/entities/event-user.entity';
import { Event } from '../modules/event/entities/event.entity';
import { CommentVote } from '../modules/forum/entities/comment-vote.entity';
import { Comment } from '../modules/forum/entities/comment.entity';
import { PostVote } from '../modules/forum/entities/post-vote.entity';
import { Post } from '../modules/forum/entities/post.entity';
import {
  Notification,
  NotificationType,
} from '../modules/notification/entities/notification.entity';
import { SystemConfig } from '../modules/system-config/system-config.entity';
import { TaskSubmit } from '../modules/task/entities/task-submit.entity';
import { TaskType } from '../modules/task/entities/task-type.entity';
import { TaskUser } from '../modules/task/entities/task-user.entity';
import { Task } from '../modules/task/entities/task.entity';
import { Type } from '../modules/task/entities/type.entity';
import { Coin } from '../modules/user/entities/coin.entity';
import { Rank } from '../modules/user/entities/rank.entity';
import { UserProfile } from '../modules/user/entities/user-profile.entity';
// Import Entities
import { User } from '../modules/user/entities/user.entity';
// Import Enums
import {
  CARRIER_TYPE,
  DELIVERY_ORDER_STATUS,
  ENTITY_STATUS,
  FORUM_POST_STATUS,
  FORUM_VOTE_TYPE,
  ITEM_STATUS,
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
  RECEIVER_ACCOUNT_TYPE,
  ROLE,
  SYSTEM_CONFIG_KEY,
  TASK_DIFFICULTY,
  TASK_SUBMIT_STATUS,
  TASK_VISIBILITY,
  TRANSACTION_STATUS,
} from '../shared/enums';

async function bootstrap() {
  console.log('🚀 Bootstrapping NestJS Application Context for Seeder...');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });
  const dataSource = app.get(DataSource);

  console.log('🔌 Connected to database. Executing seeder transaction...');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. Truncate all tables in reverse dependency order
    console.log('🧹 Truncating existing tables...');
    await queryRunner.query(`
      TRUNCATE TABLE 
        comment_votes, 
        comments, 
        post_votes, 
        posts, 
        event_users, 
        events, 
        task_submits, 
        task_users, 
        task_types, 
        tasks, 
        types, 
        delivery_orders, 
        transactions, 
        items, 
        products, 
        receiver_informations, 
        delivery_accounts, 
        ranks, 
        coins, 
        user_profiles, 
        user_social_accounts, 
        users, 
        system_configs, 
        notifications 
      CASCADE;
    `);

    // Helper to generate dates relative to current date
    const relativeDate = (days: number, hours = 0) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      date.setHours(date.getHours() + hours);
      return date;
    };

    // Password hashing
    const salt = bcrypt.genSaltSync(10);
    const demoPasswordHash = bcrypt.hashSync('Abcd@1234', salt);

    // ============================================================================
    // 2. SYSTEM CONFIGS
    // ============================================================================
    console.log('⚙️ Seeding System Configs...');
    const systemConfigs = [
      {
        key: SYSTEM_CONFIG_KEY.MAX_IMAGE_SIZE_MB,
        value: '10',
        description: 'Maximum upload image size in megabytes',
      },
      {
        key: SYSTEM_CONFIG_KEY.POST_EXPIRE_DAYS,
        value: '7',
        description: 'Number of days before pending posts expire',
      },
      {
        key: SYSTEM_CONFIG_KEY.BANNED_WORDS,
        value: JSON.stringify(['chửi thề', 'thuốc giả', 'lừa đảo']),
        description: 'List of banned keywords on the forum (JSON array)',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_AUTO_MODERATION_ENABLED,
        value: 'false',
        description:
          'Trạng thái hoạt động của tự động hóa AI kiểm duyệt bài viết và bình luận trực tiếp',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_MODERATION_POST_ROLES,
        value: JSON.stringify(['USER']),
        description:
          'Danh sách các vai trò cần được AI lọc và kiểm duyệt trước khi đăng bài viết (JSON array)',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_MODERATION_COMMENT_ROLES,
        value: JSON.stringify(['USER']),
        description:
          'Danh sách các vai trò cần được AI lọc và kiểm duyệt trước khi bình luận (JSON array)',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_CRON_MODERATION_ENABLED,
        value: 'false',
        description:
          'Trạng thái hoạt động của Cron Job quét duyệt bài viết và bình luận chạy nền',
      },
      {
        key: SYSTEM_CONFIG_KEY.AI_CRON_DELAY_MINUTES,
        value: '15',
        description:
          'Số phút trễ trước khi quét các bài viết/bình luận PENDING',
      },
    ];
    await queryRunner.manager.save(SystemConfig, systemConfigs);

    // ============================================================================
    // 3. TASK TYPES
    // ============================================================================
    console.log('🏷️ Seeding Task Types reference table...');
    const typesData = [
      { type: 'daily' },
      { type: 'weekly' },
      { type: 'event' },
      { type: 'others' },
    ];
    const seededTypes = await queryRunner.manager.save(Type, typesData);
    const typeDaily = seededTypes.find((t) => t.type === 'daily')!;
    const typeWeekly = seededTypes.find((t) => t.type === 'weekly')!;
    const typeOthers = seededTypes.find((t) => t.type === 'others')!;

    // ============================================================================
    // 4. USERS & PROFILES (Fixed demo accounts + dummy accounts)
    // ============================================================================
    console.log('👥 Seeding Users...');

    // Fixed Demo Accounts
    const demoUsers = [
      {
        email: 'admin@greenflag.id.vn',
        username: 'admin',
        role: ROLE.ADMIN,
        fullName: 'GreenFlag Administrator',
        avatarUrl:
          'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      },
      {
        email: 'partner@greenflag.id.vn',
        username: 'partner',
        role: ROLE.PARTNER,
        fullName: 'GreenFlag Partner Business',
        avatarUrl:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&auto=format&fit=crop&q=80',
      },
      {
        email: 'user@greenflag.id.vn',
        username: 'user',
        role: ROLE.USER,
        fullName: 'Thành viên Demo GreenFlag',
        avatarUrl:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      },
    ];

    // Dummy Accounts for variety
    const dummyUsers = [
      {
        email: 'johndoe@greenflag.id.vn',
        username: 'johndoe',
        role: ROLE.USER,
        fullName: 'John Doe Green',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      },
      {
        email: 'janesmith@greenflag.id.vn',
        username: 'janesmith',
        role: ROLE.USER,
        fullName: 'Jane Smith Eco',
        avatarUrl:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      },
      {
        email: 'zerocoin@greenflag.id.vn',
        username: 'zerouser',
        role: ROLE.USER,
        fullName: 'Newbie Zero Balance',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      },
    ];

    const allUsersToCreate = [...demoUsers, ...dummyUsers];
    const createdUsers: User[] = [];

    for (const u of allUsersToCreate) {
      const user = queryRunner.manager.create(User, {
        email: u.email,
        username: u.username,
        password: demoPasswordHash,
        role: u.role,
        avatarUrl: u.avatarUrl,
        status: ENTITY_STATUS.ACTIVE,
      });
      const savedUser = await queryRunner.manager.save(User, user);

      const profile = queryRunner.manager.create(UserProfile, {
        userId: savedUser.id,
        fullName: u.fullName,
        streak: u.username === 'user' ? 5 : u.role === ROLE.USER ? 2 : 0,
        phoneNumber:
          u.username === 'user'
            ? '0987654321'
            : `0911${Math.floor(100000 + Math.random() * 900000)}`,
        lastCompletedTask: u.username === 'user' ? relativeDate(-1) : undefined,
      });
      await queryRunner.manager.save(UserProfile, profile);

      createdUsers.push(savedUser);
    }

    const adminUser = createdUsers.find((u) => u.username === 'admin')!;
    const partnerUser = createdUsers.find((u) => u.username === 'partner')!;
    const mainDemoUser = createdUsers.find((u) => u.username === 'user')!;
    const johnUser = createdUsers.find((u) => u.username === 'johndoe')!;
    const janeUser = createdUsers.find((u) => u.username === 'janesmith')!;
    const zeroUser = createdUsers.find((u) => u.username === 'zerouser')!;

    // ============================================================================
    // 5. TASKS (Missions)
    // ============================================================================
    console.log('📝 Seeding Tasks (Missions)...');
    const tasksData = [
      {
        creatorId: adminUser.id,
        title: 'Phân loại rác tại nguồn',
        description:
          'Phân loại rác hữu cơ, rác tái chế và rác vô cơ tại gia đình bạn.',
        content:
          'Chụp hình ảnh túi rác tái chế và túi rác hữu cơ đã được tách riêng đặt tại điểm tập kết hoặc thùng rác gia đình.',
        coins: 1500,
        difficulty: TASK_DIFFICULTY.EASY,
        total: 1,
        status: TASK_VISIBILITY.PUBLIC,
      },
      {
        creatorId: partnerUser.id,
        title: 'Đạp xe vì môi trường',
        description:
          'Sử dụng xe đạp thay thế xe máy cho các chặng đường đi lại hàng ngày dưới 5km.',
        content:
          'Chụp ảnh bạn đi xe đạp kèm ứng dụng đo quãng đường (Strava, Runkeeper...) đạt tối thiểu 3km.',
        coins: 2000,
        difficulty: TASK_DIFFICULTY.MEDIUM,
        total: 2,
        status: TASK_VISIBILITY.PUBLIC,
      },
      {
        creatorId: partnerUser.id,
        title: 'Trồng thêm một cây xanh',
        description:
          'Trồng cây xanh hoặc chậu cây mini tại ban công, bàn làm việc hoặc sân vườn.',
        content:
          'Chụp ảnh chậu cây mới trồng kèm thẻ GreenFlag hoặc biển tên viết tay ngày chụp để xác nhận.',
        coins: 3000,
        difficulty: TASK_DIFFICULTY.HARD,
        total: 1,
        status: TASK_VISIBILITY.PUBLIC,
      },
      {
        creatorId: adminUser.id,
        title: 'Không dùng ống hút nhựa một tuần',
        description:
          'Sử dụng bình nước cá nhân và ống hút tre/inox hoặc uống trực tiếp không dùng ống hút nhựa.',
        content:
          'Ghi chép nhật ký 3 ngày không dùng ống hút nhựa qua hình ảnh cốc nước cá nhân tại công sở/quán cafe.',
        coins: 1000,
        difficulty: TASK_DIFFICULTY.EASY,
        total: 3,
        status: TASK_VISIBILITY.PUBLIC,
      },
      {
        creatorId: partnerUser.id,
        title: 'Chiến dịch Sống Xanh Nội Bộ',
        description:
          'Nhiệm vụ riêng tư dành cho nhân viên văn phòng đối tác thực hành tiết kiệm điện.',
        content: 'Chụp ảnh tắt điều hòa/thiết bị điện khi ra về.',
        coins: 1200,
        difficulty: TASK_DIFFICULTY.EASY,
        total: 1,
        status: TASK_VISIBILITY.PRIVATE, // Test layout/private states
      },
      {
        creatorId: adminUser.id,
        title: 'Sử dụng túi vải thay thế túi nilon',
        description: 'Mang theo túi vải canvas cá nhân khi mua sắm tại siêu thị, chợ hoặc cửa hàng tiện lợi.',
        content: 'Chụp ảnh bạn sử dụng túi vải đựng hàng hóa thanh toán tại quầy thu ngân.',
        coins: 1200,
        difficulty: TASK_DIFFICULTY.EASY,
        total: 1,
        status: TASK_VISIBILITY.PUBLIC,
      },
      {
        creatorId: partnerUser.id,
        title: 'Tiết kiệm nước sinh hoạt',
        description: 'Tận dụng nước rửa rau, vo gạo để tưới cây hoặc lau nhà trong gia đình.',
        content: 'Chụp ảnh/quay video ngắn cảnh bạn tái sử dụng nước cho mục đích tưới cây.',
        coins: 1800,
        difficulty: TASK_DIFFICULTY.MEDIUM,
        total: 1,
        status: TASK_VISIBILITY.PUBLIC,
      },
    ];

    const seededTasks = await queryRunner.manager.save(Task, tasksData);

    // Map tasks to types
    await queryRunner.manager.save(TaskType, [
      { taskId: seededTasks[0].id, typeId: typeDaily.id },
      { taskId: seededTasks[1].id, typeId: typeWeekly.id },
      { taskId: seededTasks[2].id, typeId: typeOthers.id },
      { taskId: seededTasks[3].id, typeId: typeDaily.id },
      { taskId: seededTasks[4].id, typeId: typeDaily.id },
      { taskId: seededTasks[5].id, typeId: typeDaily.id },
      { taskId: seededTasks[6].id, typeId: typeWeekly.id },
    ]);

    // ============================================================================
    // 6. TASK SUBMISSIONS & USER ASSIGNMENT (Ledger calculation helper)
    // ============================================================================
    console.log('📥 Seeding Task Submissions & User Progress...');

    // We will build coin calculations based on completed (approved) tasks
    // Each user's Ledger profile:
    // mainDemoUser ('user'):
    //   Earns from:
    //     - 'Phân loại rác tại nguồn' (EASY, total=1, coins=1500) -> approved
    //     - 'Đạp xe vì môi trường' (MEDIUM, total=2, coins=2000) -> approved (needs 2 approved submits)
    //     - 'Không dùng ống hút nhựa một tuần' (EASY, total=3, coins=1000) -> pending (1 submit pending, progressCount = 2, incomplete, no coin yet)
    //   Total Earned: 1500 + 2000 = 3500 coins.
    //   We will also manually credit 1000 coins from event completion later. Total Earned = 4500 points.
    //   Spent: 1000 coins (purchased a bamboo bottle).
    //   Final Coin Balance: 3500.

    // 1. Phân loại rác tại nguồn - user
    const tu1 = queryRunner.manager.create(TaskUser, {
      userId: mainDemoUser.id,
      taskId: seededTasks[0].id,
      progressCount: 1,
      assignedAt: relativeDate(-5),
      completedAt: relativeDate(-4),
    });
    const savedTu1 = await queryRunner.manager.save(TaskUser, tu1);
    await queryRunner.manager.save(TaskSubmit, {
      taskUserId: savedTu1.id,
      description: 'Em đã phân loại vỏ lon nhôm và bã cafe riêng biệt ạ.',
      status: TASK_SUBMIT_STATUS.APPROVED,
      submittedAt: relativeDate(-5, 2),
      images: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80',
      ],
    });

    // 2. Đạp xe vì môi trường - user
    const tu2 = queryRunner.manager.create(TaskUser, {
      userId: mainDemoUser.id,
      taskId: seededTasks[1].id,
      progressCount: 2,
      assignedAt: relativeDate(-3),
      completedAt: relativeDate(-2),
    });
    const savedTu2 = await queryRunner.manager.save(TaskUser, tu2);
    await queryRunner.manager.save(TaskSubmit, [
      {
        taskUserId: savedTu2.id,
        description: 'Ngày 1: Đạp xe đi học từ quận Bình Thạnh sang quận 1.',
        status: TASK_SUBMIT_STATUS.APPROVED,
        submittedAt: relativeDate(-3, 4),
        images: [
          'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        taskUserId: savedTu2.id,
        description: 'Ngày 2: Đạp xe đi uống cafe cuối tuần với bạn.',
        status: TASK_SUBMIT_STATUS.APPROVED,
        submittedAt: relativeDate(-2, 2),
        images: [
          'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=400&auto=format&fit=crop&q=80',
        ],
      },
    ]);

    // 3. Không dùng ống hút nhựa - user (Pending state check)
    const tu3 = queryRunner.manager.create(TaskUser, {
      userId: mainDemoUser.id,
      taskId: seededTasks[3].id,
      progressCount: 2, // 2 completed, 1 pending (total=3)
      assignedAt: relativeDate(-1),
      completedAt: null,
    });
    const savedTu3 = await queryRunner.manager.save(TaskUser, tu3);
    await queryRunner.manager.save(TaskSubmit, [
      {
        taskUserId: savedTu3.id,
        description: 'Ống hút thủy tinh tự mang theo ngày thứ 1.',
        status: TASK_SUBMIT_STATUS.APPROVED,
        submittedAt: relativeDate(-1, 1),
        images: [
          'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        taskUserId: savedTu3.id,
        description: 'Cốc cafe kim loại tự mang theo ngày thứ 2.',
        status: TASK_SUBMIT_STATUS.APPROVED,
        submittedAt: relativeDate(-1, 8),
        images: [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        taskUserId: savedTu3.id,
        description:
          'Hôm nay em dùng cốc sứ ở quán không lấy ống hút nhựa. Nhờ admin duyệt ạ.',
        status: TASK_SUBMIT_STATUS.PENDING, // Pending state to display on moderation dashboards
        submittedAt: relativeDate(0, -1),
        images: [
          'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop&q=80',
        ],
      },
    ]);

    // 4. Sử dụng túi vải thay thế túi nilon - user (Completed)
    const tu4 = queryRunner.manager.create(TaskUser, {
      userId: mainDemoUser.id,
      taskId: seededTasks[5].id,
      progressCount: 1,
      assignedAt: relativeDate(-3),
      completedAt: relativeDate(-2),
    });
    const savedTu4 = await queryRunner.manager.save(TaskUser, tu4);
    await queryRunner.manager.save(TaskSubmit, {
      taskUserId: savedTu4.id,
      description: 'Tôi đã mang túi canvas đi Coopmart mua sắm tối qua.',
      status: TASK_SUBMIT_STATUS.APPROVED,
      submittedAt: relativeDate(-3, 1),
      images: [
        'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
      ],
    });

    // 5. Tiết kiệm nước sinh hoạt - user (Completed)
    const tu5 = queryRunner.manager.create(TaskUser, {
      userId: mainDemoUser.id,
      taskId: seededTasks[6].id,
      progressCount: 1,
      assignedAt: relativeDate(-2),
      completedAt: relativeDate(-1),
    });
    const savedTu5 = await queryRunner.manager.save(TaskUser, tu5);
    await queryRunner.manager.save(TaskSubmit, {
      taskUserId: savedTu5.id,
      description: 'Nước rửa rau cải xà lách được giữ lại để tưới cho dàn ớt ban công.',
      status: TASK_SUBMIT_STATUS.APPROVED,
      submittedAt: relativeDate(-2, 3),
      images: [
        'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80',
      ],
    });

    // John User:
    //   Completed: 'Trồng thêm một cây xanh' (HARD, coins=3000) -> approved
    //   Total Earned: 3000 points. Spent: 0. Balance: 3000.
    const tuJohn = queryRunner.manager.create(TaskUser, {
      userId: johnUser.id,
      taskId: seededTasks[2].id,
      progressCount: 1,
      assignedAt: relativeDate(-6),
      completedAt: relativeDate(-5),
    });
    const savedTuJohn = await queryRunner.manager.save(TaskUser, tuJohn);
    await queryRunner.manager.save(TaskSubmit, {
      taskUserId: savedTuJohn.id,
      description: 'Chậu sen đá mini em trồng tại bàn làm việc ở văn phòng.',
      status: TASK_SUBMIT_STATUS.APPROVED,
      submittedAt: relativeDate(-6, 3),
      images: [
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&auto=format&fit=crop&q=80',
      ],
    });

    // Jane User:
    //   Completed: 'Phân loại rác tại nguồn' (EASY, coins=1500) -> approved
    //   Completed: 'Đạp xe vì môi trường' (MEDIUM, coins=2000) -> approved
    //   Total Earned: 3500 points. Spent: 1500. Balance: 2000.
    const tuJane1 = queryRunner.manager.create(TaskUser, {
      userId: janeUser.id,
      taskId: seededTasks[0].id,
      progressCount: 1,
      assignedAt: relativeDate(-8),
      completedAt: relativeDate(-8),
    });
    const savedTuJane1 = await queryRunner.manager.save(TaskUser, tuJane1);
    await queryRunner.manager.save(TaskSubmit, {
      taskUserId: savedTuJane1.id,
      description: 'Đã gom và dán nhãn vỏ chai nhựa Pet tại nhà.',
      status: TASK_SUBMIT_STATUS.APPROVED,
      submittedAt: relativeDate(-8, 1),
      images: [
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&auto=format&fit=crop&q=80',
      ],
    });

    const tuJane2 = queryRunner.manager.create(TaskUser, {
      userId: janeUser.id,
      taskId: seededTasks[1].id,
      progressCount: 2,
      assignedAt: relativeDate(-4),
      completedAt: relativeDate(-3),
    });
    const savedTuJane2 = await queryRunner.manager.save(TaskUser, tuJane2);
    await queryRunner.manager.save(TaskSubmit, [
      {
        taskUserId: savedTuJane2.id,
        description: 'Jane Day 1 bike ride.',
        status: TASK_SUBMIT_STATUS.APPROVED,
        submittedAt: relativeDate(-4, 2),
        images: [
          'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        taskUserId: savedTuJane2.id,
        description: 'Jane Day 2 bike ride.',
        status: TASK_SUBMIT_STATUS.APPROVED,
        submittedAt: relativeDate(-3, 3),
        images: [
          'https://images.unsplash.com/photo-1541614101331-1a5a3a194e92?w=400&auto=format&fit=crop&q=80',
        ],
      },
    ]);

    // Zero User:
    //   Assigned to a task but has progressCount = 0 and no submits.
    //   Total Earned: 0 points. Spent: 0. Balance: 0. (Zero state checks)
    const tuZero = queryRunner.manager.create(TaskUser, {
      userId: zeroUser.id,
      taskId: seededTasks[0].id,
      progressCount: 0,
      assignedAt: relativeDate(-1),
      completedAt: null,
    });
    await queryRunner.manager.save(TaskUser, tuZero);

    // ============================================================================
    // 7. EVENTS & EVENT REGISTRATIONS
    // ============================================================================
    console.log('📅 Seeding Events...');
    const eventsData = [
      {
        publicId: 'EV-001',
        creatorId: partnerUser.id,
        title: 'Hội thảo “Sống Xanh Không Rác Thải”',
        description:
          'Hội thảo chia sẻ các phương pháp giảm thiểu rác thải sinh hoạt hàng ngày, tự ủ phân hữu cơ compost tại nhà và làm enzyme tẩy rửa sinh học từ vỏ trái cây.',
        location:
          'Văn phòng Trung tâm Môi trường Xanh, 45 Nguyễn Huệ, Quận 1, TP. HCM',
        capacity: 50,
        coins: 1000,
        endSign: relativeDate(-2), // Past sign-up deadline
        startTime: relativeDate(-3), // Past event
        endTime: relativeDate(-3, 4),
        status: 'finished', // Expired event
        images: [
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        publicId: 'EV-002',
        creatorId: partnerUser.id,
        title: 'Chiến dịch “Thu Gom Pin Cũ Đổi Cây”',
        description:
          'Hãy mang pin cũ đã qua sử dụng tới điểm thu gom của chúng tôi. Với mỗi 10 viên pin, bạn sẽ nhận được một sen đá xinh xắn và 1000 xu thưởng GreenFlag.',
        location:
          'Sảnh chính Nhà văn hóa Thanh Niên, 4 Phạm Ngọc Thạch, Quận 1, TP. HCM',
        capacity: 200,
        coins: 1000,
        endSign: relativeDate(3),
        startTime: relativeDate(-1), // Ongoing event
        endTime: relativeDate(2),
        status: 'ongoing',
        images: [
          'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?w=800&auto=format&fit=crop&q=80',
        ],
      },
      {
        publicId: 'EV-003',
        creatorId: partnerUser.id,
        title: 'Tình nguyện dọn rác bãi biển Vũng Tàu',
        description:
          'Chiến dịch thu dọn rác thải nhựa đại dương tại bờ biển Bãi Sau. GreenFlag hỗ trợ xe bus đưa đón, găng tay, bao tải và cung cấp nước uống cho toàn bộ tình nguyện viên.',
        location:
          'Bờ biển Bãi Sau (Đối diện khách sạn Imperial), Thành phố Vũng Tàu',
        capacity: 100,
        coins: 2500,
        endSign: relativeDate(8), // Upcoming event
        startTime: relativeDate(10),
        endTime: relativeDate(10, 8),
        status: 'upcoming',
        images: [
          'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&auto=format&fit=crop&q=80',
        ],
      },
    ];

    const seededEvents = await queryRunner.manager.save(Event, eventsData);

    // Event Registrations & completions
    // mainDemoUser completed Event 1 (finished) and earns 1000 coins!
    await queryRunner.manager.save(EventUser, {
      userId: mainDemoUser.id,
      eventId: seededEvents[0].id,
      joinedAt: relativeDate(-5),
      completedAt: relativeDate(-3),
    });

    // mainDemoUser also joined Event 2 (ongoing) but not completed yet (ongoing)
    await queryRunner.manager.save(EventUser, {
      userId: mainDemoUser.id,
      eventId: seededEvents[1].id,
      joinedAt: relativeDate(-1),
      completedAt: null,
    });

    // Jane User completed Event 1 (finished)
    await queryRunner.manager.save(EventUser, {
      userId: janeUser.id,
      eventId: seededEvents[0].id,
      joinedAt: relativeDate(-4),
      completedAt: relativeDate(-3),
    });

    // ============================================================================
    // 8. COMMERCE - PRODUCTS & ITEMS (Exchange Market)
    // ============================================================================
    console.log('🛍️ Seeding Products & Exchange Market Items...');

    // Products (Sản phẩm ký gửi/trao đổi của người dùng đăng lên)
    const productsData = [
      {
        sellerId: johnUser.id,
        name: 'Chậu đất nung trồng cây cũ',
        description:
          'Mình dư 3 chậu đất nung cỡ trung không xài đến. Có trầy xước nhẹ nhưng không nứt vỡ.',
        price: 500,
        category: PRODUCT_CATEGORY.PLANTS,
        productStatus: PRODUCT_CONDITION.USED,
        postStatus: PRODUCT_POST_STATUS.PUBLIC,
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        sellerId: janeUser.id,
        name: 'Túi tote canvas vẽ tay thủ công',
        description:
          'Tự vẽ họa tiết lá xanh bảo vệ môi trường, vải dày dặn giặt thoải mái không phai màu.',
        price: 1500,
        category: PRODUCT_CATEGORY.HANDICRAFT,
        productStatus: PRODUCT_CONDITION.NEW,
        postStatus: PRODUCT_POST_STATUS.PUBLIC,
        images: [
          'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&auto=format&fit=crop&q=80',
        ],
      },
    ];
    await queryRunner.manager.save(Product, productsData);

    // Items (Quà tặng/Vật phẩm đổi từ Coin tích lũy của GreenFlag hoặc Partner)
    const itemsData = [
      {
        creatorId: partnerUser.id,
        name: 'Bình giữ nhiệt tre khắc tên',
        description:
          'Lõi bình inox 304 không gỉ, vỏ ngoài ốp gỗ tre tự nhiên thân thiện. Khả năng giữ nhiệt lên tới 12 tiếng. Dung tích 500ml nhỏ gọn thích hợp mang theo hàng ngày.',
        price: 1000,
        stock: 15,
        status: ITEM_STATUS.AVAILABLE,
        weight: 350,
        length: 25,
        width: 7,
        height: 7,
        images: [
          'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        creatorId: partnerUser.id,
        name: 'Set ống hút cỏ bàng sấy khô',
        description:
          'Ống hút cỏ bàng hoàn toàn tự nhiên phân hủy sinh học, sản phẩm thủ công từ miền Tây. Một set gồm 50 ống hút kèm cọ xơ dừa vệ sinh.',
        price: 300,
        stock: 50,
        status: ITEM_STATUS.AVAILABLE,
        weight: 150,
        length: 20,
        width: 10,
        height: 3,
        images: [
          'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        creatorId: partnerUser.id,
        name: 'Bàn chải tre phân hủy sinh học',
        description:
          'Thân tre tự nhiên được phủ sáp chống mốc, sợi lông bàn chải mềm mịn làm từ nylon sinh học chứa than hoạt tính kháng khuẩn. Dành cho những ai muốn loại bỏ nhựa khỏi nhà tắm.',
        price: 200,
        stock: 0, // Out of stock to test Sold Out / Empty state cards
        status: ITEM_STATUS.SOLD_OUT,
        weight: 50,
        length: 19,
        width: 2,
        height: 1,
        images: [
          'https://images.unsplash.com/photo-1593005510509-d05b264f1c9c?w=400&auto=format&fit=crop&q=80',
        ],
      },
      {
        creatorId: partnerUser.id,
        name: 'Sổ tay bìa giấy Kraft xi măng tái chế độc quyền GreenFlag 2026',
        // VERY LONG DESCRIPTION for testing layout word-wrap limits and truncation
        description:
          'Sổ tay A5 tiện lợi với bìa làm hoàn toàn từ bột giấy tái chế ép cứng bảo vệ môi trường, mang đậm dấu ấn phong cách bụi bặm retro. Ruột sổ gồm 160 trang giấy kẻ ngang màu ngà chống mỏi mắt khi đọc viết, không chứa hóa chất tẩy trắng công nghiệp độc hại. Từng cuốn sổ được khâu chỉ gáy thủ công cực kỳ chắc chắn, có dây ruy băng đánh dấu trang xanh teal lá cây mát mắt. Mua cuốn sổ này là bạn đã đóng góp 10% doanh thu vào quỹ trồng rừng phòng hộ đầu nguồn của GreenFlag tại miền Trung Việt Nam. Thích hợp làm quà tặng ý nghĩa cho những người có lối sống thân thiện môi trường hoặc ghi chép kế hoạch xanh mỗi ngày.',
        price: 800,
        stock: 5,
        status: ITEM_STATUS.AVAILABLE,
        weight: 200,
        length: 21,
        width: 15,
        height: 2,
        images: [
          'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&auto=format&fit=crop&q=80',
        ],
      },
    ];
    const seededItems = await queryRunner.manager.save(Item, itemsData);

    // ============================================================================
    // 9. TRANSACTIONS & DELIVERY
    // ============================================================================
    console.log('💳 Seeding Transactions & Delivery...');

    // Receiver Information
    const mainAddress = queryRunner.manager.create(ReceiverInformation, {
      userId: mainDemoUser.id,
      toName: 'Trần Eco User',
      toPhone: '0987654321',
      toAddress: '24 Xô Viết Nghệ Tĩnh, Phường 19, Quận Bình Thạnh, TP HCM',
      toWardName: 'Phường 19',
      toDistrictName: 'Quận Bình Thạnh',
      toProvinceName: 'Hồ Chí Minh',
      accountType: RECEIVER_ACCOUNT_TYPE.HOME,
      isDefault: true,
    });
    const savedAddress = await queryRunner.manager.save(
      ReceiverInformation,
      mainAddress,
    );

    const janeAddress = queryRunner.manager.create(ReceiverInformation, {
      userId: janeUser.id,
      toName: 'Jane Smith',
      toPhone: '0901234567',
      toAddress:
        'Văn phòng tòa nhà Green, 102 Nguyễn Đình Chiểu, Phường Đa Kao, Quận 1',
      toWardName: 'Phường Đa Kao',
      toDistrictName: 'Quận 1',
      toProvinceName: 'Hồ Chí Minh',
      accountType: RECEIVER_ACCOUNT_TYPE.OFFICE,
      isDefault: true,
    });
    const savedJaneAddress = await queryRunner.manager.save(
      ReceiverInformation,
      janeAddress,
    );

    // Delivery Accounts (for partners to ship)
    const partnerCarrier = queryRunner.manager.create(DeliveryAccount, {
      name: 'Kho Giao Hàng Hỏa Tốc Partner',
      userId: partnerUser.id,
      carrier: CARRIER_TYPE.GHN,
      apiConfig: {
        token: process.env.GHN_TOKEN || 'c3f24415-29b9-11f0-9b81-222185cb68c8',
        shop_id: process.env.GHN_SHOP_ID || '196506',
      },
      isDefault: true,
    });
    const savedCarrier = await queryRunner.manager.save(
      DeliveryAccount,
      partnerCarrier,
    );

    // Transactions (Lịch sử giao dịch chi tiêu xu)
    // 1. user: bought Bình giữ nhiệt tre (cost = 1000) -> accepted
    const txUser = queryRunner.manager.create(Transaction, {
      receiverInformationId: savedAddress.id,
      buyerId: mainDemoUser.id,
      sellerId: partnerUser.id,
      itemId: seededItems[0].id, // Bình giữ nhiệt
      name: 'Đổi Bình giữ nhiệt tre',
      totalPrice: 1000, // spent 1000 coins
      quantity: 1,
      status: TRANSACTION_STATUS.ACCEPTED,
      itemSnapshot: {
        id: seededItems[0].id,
        name: seededItems[0].name,
        price: seededItems[0].price,
        images: seededItems[0].images,
      },
    });
    const savedTxUser = await queryRunner.manager.save(Transaction, txUser);

    // Create delivery order for that transaction to test tracking UI
    const doUser = queryRunner.manager.create(DeliveryOrder, {
      transactionId: savedTxUser.id,
      sellerId: partnerUser.id,
      buyerId: mainDemoUser.id,
      deliveryAccountId: savedCarrier.id,
      orderCode: 'GGF2026X109',
      status: DELIVERY_ORDER_STATUS.DELIVERED,
      toName: savedAddress.toName,
      toPhone: savedAddress.toPhone,
      toAddress: savedAddress.toAddress,
      isPrinted: true,
      codAmount: 0, // Coin exchange, so COD is 0
      weight: seededItems[0].weight,
      paymentTypeId: 1,
      totalAmount: 0,
      itemSnapshot: savedTxUser.itemSnapshot,
      createdDate: relativeDate(-2),
    });
    await queryRunner.manager.save(DeliveryOrder, doUser);

    // 2. Jane User: bought Bình giữ nhiệt tre (cost = 1000) & Sổ tay Kraft (cost = 800 but let's assume quantity 1 for set-up, total cost = 1000 + 500 = 1500)
    // Let's create a transaction for Jane buying product or item.
    // Jane bought items. Total Spent: 1800 coins.
    const txJane = queryRunner.manager.create(Transaction, {
      receiverInformationId: savedJaneAddress.id,
      buyerId: janeUser.id,
      sellerId: partnerUser.id,
      itemId: seededItems[0].id, // Bình giữ nhiệt
      name: 'Đổi quà bình giữ nhiệt - Jane',
      totalPrice: 1000,
      quantity: 1,
      status: TRANSACTION_STATUS.ACCEPTED,
      itemSnapshot: {
        id: seededItems[0].id,
        name: seededItems[0].name,
        price: seededItems[0].price,
        images: seededItems[0].images,
      },
    });
    await queryRunner.manager.save(Transaction, txJane);

    const txJane2 = queryRunner.manager.create(Transaction, {
      receiverInformationId: savedJaneAddress.id,
      buyerId: janeUser.id,
      sellerId: partnerUser.id,
      itemId: seededItems[3].id, // Sổ tay Kraft
      name: 'Đổi quà sổ tay Kraft - Jane',
      totalPrice: 800,
      quantity: 1,
      status: TRANSACTION_STATUS.ACCEPTED,
      itemSnapshot: {
        id: seededItems[3].id,
        name: seededItems[3].name,
        price: seededItems[3].price,
        images: seededItems[3].images,
      },
    });
    await queryRunner.manager.save(Transaction, txJane2);

    // ============================================================================
    // 10. FORUM - POSTS, COMMENTS, VOTES
    // ============================================================================
    console.log('💬 Seeding Forum Posts & Discussions...');

    const postsData = [
      {
        authorId: mainDemoUser.id,
        content:
          'Chào cả nhà, mình vừa hoàn thành nhiệm vụ trồng cây ban công. Nhìn mầm xanh bé nhỏ lớn lên mỗi ngày thấy vui cực kỳ! Có ai có mẹo nhỏ nào để chăm sóc sen đá trong nhà không bị úng không, chia sẻ cho mình với nha? Chúc mọi người một ngày sống xanh lành mạnh!',
        category: 'Kinh nghiệm',
        status: FORUM_POST_STATUS.APPROVED,
        tags: ['Sống xanh', 'Trồng cây', 'Sen đá'],
        upvotes: 4,
        downvotes: 0,
        score: 4,
        commentCount: 2,
        isAdminPost: false,
        createdAt: relativeDate(-2),
      },
      {
        authorId: janeUser.id,
        content:
          'Chiến dịch đổi pin hôm nay siêu đông vui luôn mọi người ơi! Mình gom được 20 viên pin hỏng mang đi đổi được hai em sen đá đáng yêu xỉu. Hành động nhỏ nhưng giúp bảo vệ mạch nước ngầm khỏi kim loại nặng độc hại đó. Hãy chung tay bảo vệ môi trường nha!',
        category: 'Thảo luận chung',
        status: FORUM_POST_STATUS.APPROVED,
        tags: ['Tái chế', 'Thu gom pin', 'Sống sạch'],
        eventId: seededEvents[1].id, // Linked to the ongoing Event
        upvotes: 6,
        downvotes: 1,
        score: 5,
        commentCount: 1,
        isAdminPost: false,
        createdAt: relativeDate(-1),
      },
      {
        authorId: adminUser.id,
        content:
          '📣 [THÔNG BÁO QUAN TRỌNG] Quy tắc kiểm duyệt bài viết mới tại cộng đồng GreenFlag. Các bài viết chứa từ ngữ tục tĩu hoặc không liên quan đến bảo vệ môi trường sẽ bị AI tự động gắn cờ và loại bỏ để xây dựng môi trường lành mạnh.',
        category: 'Thảo luận chung',
        status: FORUM_POST_STATUS.APPROVED,
        tags: ['Thông báo', 'Quy định'],
        upvotes: 12,
        downvotes: 0,
        score: 12,
        commentCount: 0,
        isAdminPost: true,
        createdAt: relativeDate(-4),
      },
    ];

    const seededPosts = await queryRunner.manager
      .getRepository(Post)
      .save(postsData);

    // Votes for Post 1
    await queryRunner.manager.getRepository(PostVote).save([
      {
        postId: seededPosts[0].id,
        userId: johnUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
      {
        postId: seededPosts[0].id,
        userId: janeUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
      {
        postId: seededPosts[0].id,
        userId: partnerUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
    ]);

    // Votes for Post 2
    await queryRunner.manager.getRepository(PostVote).save([
      {
        postId: seededPosts[1].id,
        userId: mainDemoUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
      {
        postId: seededPosts[1].id,
        userId: johnUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
      {
        postId: seededPosts[1].id,
        userId: adminUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
      {
        postId: seededPosts[1].id,
        userId: zeroUser.id,
        type: FORUM_VOTE_TYPE.DOWN,
      },
    ]);

    // Comments for Post 1
    const comment1 = queryRunner.manager.create(Comment, {
      postId: seededPosts[0].id,
      authorId: johnUser.id,
      content:
        'Sen đá ưa nắng và thoáng gió lắm bạn ơi, đặc biệt 1 tuần chỉ nên tưới 1 lần quanh gốc thôi nè, tưới nhiều úng chết ngay á.',
      upvotes: 3,
      downvotes: 0,
      status: FORUM_POST_STATUS.APPROVED,
      createdAt: relativeDate(-1, -6),
    });
    const savedComment1 = await queryRunner.manager.save(Comment, comment1);

    // Reply to comment1 (nested comment)
    const reply1 = queryRunner.manager.create(Comment, {
      postId: seededPosts[0].id,
      authorId: mainDemoUser.id,
      parentId: savedComment1.id,
      content:
        'Cảm ơn chia sẻ hữu ích từ bạn nhiều nhé! Mình sẽ lưu ý để cây khô thoáng hơn.',
      upvotes: 1,
      downvotes: 0,
      status: FORUM_POST_STATUS.APPROVED,
      createdAt: relativeDate(-1, -4),
    });
    await queryRunner.manager.save(Comment, reply1);

    // Comment for Post 2
    const comment2 = queryRunner.manager.create(Comment, {
      postId: seededPosts[1].id,
      authorId: mainDemoUser.id,
      content:
        'Tiếc ghê hôm nay bận không ra Nhà văn hóa Thanh Niên được, không biết chương trình còn kéo dài đến chủ nhật không ạ?',
      upvotes: 2,
      downvotes: 0,
      status: FORUM_POST_STATUS.APPROVED,
      createdAt: relativeDate(-1, 1),
    });
    await queryRunner.manager.save(Comment, comment2);

    // Comment Votes
    await queryRunner.manager.getRepository(CommentVote).save([
      {
        commentId: savedComment1.id,
        userId: mainDemoUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
      {
        commentId: savedComment1.id,
        userId: janeUser.id,
        type: FORUM_VOTE_TYPE.UP,
      },
    ]);

    // ============================================================================
    // 11. LEDGER LEDGER BALANCE CALCULATION & INSERTS (Coins & Ranks)
    // ============================================================================
    console.log('🪙 Computing Ledger Balances for Coins & Ranks...');

    // We now have all the actual history seeded! Let's calculate and seed user coins/ranks.
    // Calculations:
    // 1. mainDemoUser ('user'):
    //    Earned:
    //      - Phân loại rác: 1500 (Task 1)
    //      - Đạp xe: 2000 (Task 2)
    //      - Túi vải: 1200 (Task 6)
    //      - Tiết kiệm nước: 1800 (Task 7)
    //      - Event 1: 1000
    //      Total Earned = 1500 + 2000 + 1200 + 1800 + 1000 = 7500 points (rank.amount = 7500)
    //    Spent:
    //      - Item exchange: 1000 (Bình giữ nhiệt)
    //      Total Spent = 1000
    //    Balance (coin.amount): 7500 - 1000 = 6500.

    // 2. johnUser ('johndoe'):
    //    Earned:
    //      - Trồng cây: 3000 (Task 3)
    //      Total Earned = 3000 points (rank.amount = 3000)
    //    Spent: 0
    //    Balance: 3000.

    // 3. janeUser ('janesmith'):
    //    Earned:
    //      - Phân loại rác: 1500 (Task 1)
    //      - Đạp xe: 2000 (Task 2)
    //      - Event 1: 1000
    //      Total Earned = 4500 points (rank.amount = 4500)
    //    Spent:
    //      - Item exchange 1: 1000
    //      - Item exchange 2: 800
    //      Total Spent = 1800
    //    Balance: 4500 - 1800 = 2700.

    // 4. zeroUser ('zerouser'):
    //    Earned: 0, Spent: 0, Balance: 0 (rank.amount = 0, coin.amount = 0)

    // 5. admin & partner: Let's give them solid start balances
    //    admin: earned 10000, spent 0.
    //    partner: earned 15000, spent 0.

    const balances = [
      { user: adminUser, earned: 10000, balance: 10000 },
      { user: partnerUser, earned: 15000, balance: 15000 },
      { user: mainDemoUser, earned: 7500, balance: 6500 },
      { user: johnUser, earned: 3000, balance: 3000 },
      { user: janeUser, earned: 4500, balance: 2700 },
      { user: zeroUser, earned: 0, balance: 0 },
    ];

    for (const b of balances) {
      await queryRunner.manager.save(Coin, {
        userId: b.user.id,
        amount: b.balance,
      });

      await queryRunner.manager.save(Rank, {
        userId: b.user.id,
        amount: b.earned,
        order: 99, // Will be updated via rearrangeRanks at the end
      });
    }

    // ============================================================================
    // 12. NOTIFICATIONS
    // ============================================================================
    console.log('🔔 Seeding initial notifications...');
    const notifications = [
      {
        recipientId: mainDemoUser.id,
        senderId: partnerUser.id,
        type: NotificationType.COIN_RECEIVED,
        content:
          'Bạn được cộng 1,000 xu từ việc hoàn thành sự kiện: Hội thảo "Sống Xanh Không Rác Thải".',
        link: `/events/${seededEvents[0].id}`,
        isRead: true,
      },
      {
        recipientId: mainDemoUser.id,
        senderId: adminUser.id,
        type: NotificationType.NEW_COMMENT,
        content: 'johndoe đã bình luận bài viết của bạn: "Sen đá ưa nắng..."',
        link: `/forum/posts/${seededPosts[0].id}`,
        isRead: false,
      },
    ];
    await queryRunner.manager.getRepository(Notification).save(notifications);

    await queryRunner.commitTransaction();
    console.log('✅ Base transactions completed successfully!');
  } catch (error) {
    console.error(
      '❌ Error seeding database! Rolling back transaction...',
      error,
    );
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }

  // ============================================================================
  // 13. RUN BATCH RANKS REARRANGEMENT
  // ============================================================================
  console.log('🏆 Rearranging user ranks (Bảng xếp hạng)...');
  try {
    const rankRepo = dataSource.getRepository(Rank);
    const ranks = await rankRepo.find({
      order: { amount: 'DESC' },
    });

    for (let i = 0; i < ranks.length; i++) {
      const rank = ranks[i];
      rank.order = i + 1;
      await rankRepo.save(rank);
    }
    console.log('👑 Rankings rearranged successfully!');
  } catch (err) {
    console.error('❌ Failed to rearrange ranks:', err);
  }

  console.log('🎉 Seeding process completed successfully!');
  await app.close();
  console.log('👋 Headless context closed.');
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('💥 Seeder failed completely:', err);
  process.exit(1);
});
