export type Locale = "vi" | "en";

export type Messages = {
  app: {
    name: string;
    versionTag: string;
  };
  nav: {
    dashboard: string;
    challenges: string;
    tracks: string;
    achievements: string;
    profile: string;
  };
  common: {
    languageVi: string;
    languageEn: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    confirm: string;
    delete: string;
    edit: string;
    view: string;
    back: string;
    next: string;
    previous: string;
    close: string;
    open: string;
    search: string;
    filter: string;
    sort: string;
    refresh: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    totalPoints: string;
    currentLevel: string;
    streakAndCompleted: string;
    studyPlan: string;
    strengthsWeaknesses: string;
  };
  challenges: {
    title: string;
    subtitle: string;
    detailPlaceholder: string;
  };
  profile: {
    title: string;
    subtitle: string;
    mainInfo: string;
    learningConfig: string;
    displayName: string;
    email: string;
    preferredLanguage: string;
    uiLanguage: string;
    selfAssessedLevel: string;
  };
  tracks: {
    title: string;
    subtitle: string;
    empty: string;
    difficulty: string;
    estimatedHours: string;
    totalChallenges: string;
    progress: string;
    status: {
      notStarted: string;
      inProgress: string;
      completed: string;
    };
    viewTrack: string;
    startTrack: string;
    continueTrack: string;
    backToTracks: string;
    trackOverview: string;
    challengesInTrack: string;
    noChallenges: string;
    challengeNumber: string;
    review: string;
    start: string;
  };
  achievements: {
    title: string;
    subtitle: string;
    unlocked: string;
    locked: string;
    noAchievements: string;
    noUnlockedAchievements: string;
    completeChallenge: string;
    stats: {
      unlocked: string;
      remaining: string;
      completion: string;
      legendary: string;
    };
    categories: {
      all: string;
      unlocked: string;
      locked: string;
      streak: string;
      challenges: string;
      tracks: string;
      points: string;
      special: string;
    };
    rarity: {
      common: string;
      rare: string;
      epic: string;
      legendary: string;
    };
    progress: string;
    unlockedOn: string;
  };
  leaderboard: {
    title: string;
    subtitle: string;
    yourRanking: string;
    filtersAndSorting: string;
    timeframe: string;
    sortBy: string;
    reset: string;
    top10: string;
    fullLeaderboard: string;
    rank: string;
    user: string;
    level: string;
    points: string;
    streak: string;
    completed: string;
    country: string;
    lastActive: string;
    you: string;
    timeframes: {
      allTime: string;
      monthly: string;
      weekly: string;
    };
    sortOptions: {
      points: string;
      streak: string;
      completed: string;
    };
  };
  settings: {
    title: string;
    basicInfo: string;
    learningPreferences: string;
    editorSettings: string;
    notificationSettings: string;
    displayName: string;
    email: string;
    preferredLanguage: string;
    uiLanguage: string;
    selfAssessedLevel: string;
    theme: string;
    fontSize: string;
    wordWrap: string;
    minimap: string;
    emailNotifications: string;
    pushNotifications: string;
    weeklyProgress: string;
    saveChanges: string;
    saving: string;
    reset: string;
    themes: {
      dark: string;
      light: string;
      highContrast: string;
    };
    wordWrapOptions: {
      on: string;
      off: string;
      atColumn: string;
      bounded: string;
    };
    notifications: {
      emailDesc: string;
      pushDesc: string;
      weeklyDesc: string;
    };
    minimapDesc: string;
  };
};

export const messages: Record<Locale, Messages> = {
  vi: {
    app: {
      name: "CodeThinker",
      versionTag: "MVP",
    },
    nav: {
      dashboard: "Dashboard",
      challenges: "Thử thách",
      tracks: "Lộ trình",
      achievements: "Thành tích",
      profile: "Hồ sơ",
    },
    common: {
      languageVi: "Tiếng Việt",
      languageEn: "English",
    },
    dashboard: {
      title: "Dashboard",
      subtitle:
        "Tổng quan tiến độ học code độc lập của bạn (hiện tại đang dùng dữ liệu mock, sẽ nối backend sau).",
      totalPoints: "Tổng điểm",
      currentLevel: "Level hiện tại",
      streakAndCompleted: "Streak & số bài hoàn thành",
      studyPlan: "Kế hoạch học tập",
      strengthsWeaknesses: "Khu vực mạnh / yếu (mock)",
    },
    challenges: {
      title: "Challenges",
      subtitle:
        "Danh sách thử thách luyện tư duy và kỹ năng debug. Hiện tại đang dùng dữ liệu mock.",
      detailPlaceholder:
        "Mô tả chi tiết sẽ được tải từ backend trong các bước sau.",
    },
    profile: {
      title: "Profile",
      subtitle:
        "Thông tin cá nhân và cấu hình học tập (hiện tại là dữ liệu mock).",
      mainInfo: "Thông tin chính",
      learningConfig: "Cấu hình học tập",
      displayName: "Tên hiển thị",
      email: "Email",
      preferredLanguage: "Ngôn ngữ mặc định",
      uiLanguage: "Ngôn ngữ giao diện",
      selfAssessedLevel: "Self-assessed level",
    },
    tracks: {
      title: "Lộ trình học",
      subtitle: "Những lộ trình nhỏ, mỗi lộ trình gom một nhóm thử thách theo chủ đề.",
      empty: "Chưa có lộ trình nào.",
      difficulty: "Độ khó",
      estimatedHours: "giờ ước tính",
      totalChallenges: "bài tập",
      progress: "Tiến độ",
      status: {
        notStarted: "Chưa bắt đầu",
        inProgress: "Đang học",
        completed: "Hoàn thành",
      },
      viewTrack: "Xem lộ trình",
      startTrack: "Bắt đầu lộ trình",
      continueTrack: "Tiếp tục học",
      backToTracks: "← Quay lại danh sách lộ trình",
      trackOverview: "Tổng quan lộ trình",
      challengesInTrack: "Các bài tập trong lộ trình",
      noChallenges: "Không có bài tập nào trong lộ trình này.",
      challengeNumber: "Bài tập",
      review: "Xem lại",
      start: "Bắt đầu",
    },
    achievements: {
      title: "Thành tích",
      subtitle: "Khám phá và mở khóa các thành tích khi bạn học tập và tiến bộ.",
      unlocked: "Đã mở khóa",
      locked: "Đã khóa",
      noAchievements: "Không có thành tích nào.",
      noUnlockedAchievements: "Chưa có thành tích nào được mở khóa.",
      completeChallenge: "Hoàn thành thử thách để mở khóa thành tích đầu tiên của bạn!",
      stats: {
        unlocked: "Đã mở khóa",
        remaining: "Còn lại",
        completion: "Hoàn thành",
        legendary: "Huyền thoại",
      },
      categories: {
        all: "Tất cả",
        unlocked: "Đã mở khóa",
        locked: "Chưa mở khóa",
        streak: "🔥 Streak",
        challenges: "🎯 Thử thách",
        tracks: "🛤️ Lộ trình",
        points: "💯 Điểm số",
        special: "✨ Đặc biệt",
      },
      rarity: {
        common: "Common",
        rare: "Rare",
        epic: "Epic",
        legendary: "Legendary",
      },
      progress: "Tiến độ",
      unlockedOn: "Mở khóa",
    },
    leaderboard: {
      title: "Bảng xếp hạng",
      subtitle: "Xem thứ hạng của bạn so với những người học khác trên nền tảng.",
      yourRanking: "Thứ hạng của bạn",
      filtersAndSorting: "Bộ lọc & Sắp xếp",
      timeframe: "Khoảng thời gian",
      sortBy: "Sắp xếp theo",
      reset: "Reset",
      top10: "Top 10 người học",
      fullLeaderboard: "Bảng xếp hạng đầy đủ",
      rank: "Hạng",
      user: "Người dùng",
      level: "Cấp độ",
      points: "Điểm",
      streak: "Chuỗi",
      completed: "Hoàn thành",
      country: "Quốc gia",
      lastActive: "Hoạt động lần cuối",
      you: "Bạn",
      timeframes: {
        allTime: "Tất cả thời gian",
        monthly: "Tháng này",
        weekly: "Tuần này",
      },
      sortOptions: {
        points: "Điểm",
        streak: "Chuỗi",
        completed: "Đã hoàn thành",
      },
    },
    settings: {
      title: "Cài đặt",
      basicInfo: "Thông tin cơ bản",
      learningPreferences: "Cấu hình học tập",
      editorSettings: "Cài đặt Editor",
      notificationSettings: "Cài đặt thông báo",
      displayName: "Tên hiển thị",
      email: "Email",
      preferredLanguage: "Ngôn ngữ lập trình ưa thích",
      uiLanguage: "Ngôn ngữ giao diện",
      selfAssessedLevel: "Trình độ tự đánh giá",
      theme: "Chủ đề",
      fontSize: "Cỡ chữ",
      wordWrap: "Word Wrap",
      minimap: "Hiển thị Minimap",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      weeklyProgress: "Báo cáo tiến độ hàng tuần",
      saveChanges: "Lưu thay đổi",
      saving: "Đang lưu...",
      reset: "Reset",
      themes: {
        dark: "Dark",
        light: "Light",
        highContrast: "High Contrast",
      },
      wordWrapOptions: {
        on: "On",
        off: "Off",
        atColumn: "At Column",
        bounded: "Bounded",
      },
      notifications: {
        emailDesc: "Nhận thông báo qua email",
        pushDesc: "Nhận thông báo đẩy trên trình duyệt",
        weeklyDesc: "Nhận email tổng kết tiến độ học tập",
      },
      minimapDesc: "Hiển thị bản đồ thu nhỏ của code",
    },
  },
  en: {
    app: {
      name: "CodeThinker",
      versionTag: "MVP",
    },
    nav: {
      dashboard: "Dashboard",
      challenges: "Challenges",
      tracks: "Tracks",
      achievements: "Achievements",
      profile: "Profile",
    },
    common: {
      languageVi: "Vietnamese",
      languageEn: "English",
    },
    dashboard: {
      title: "Dashboard",
      subtitle:
        "Overview of your independent coding practice (currently using mock data, backend coming soon).",
      totalPoints: "Total points",
      currentLevel: "Current level",
      streakAndCompleted: "Streak & completed challenges",
      studyPlan: "Study plan",
      strengthsWeaknesses: "Strengths / weaknesses (mock)",
    },
    challenges: {
      title: "Challenges",
      subtitle:
        "List of challenges to practice problem solving and debugging. Currently using mock data.",
      detailPlaceholder:
        "Detailed description will be loaded from the backend in the next steps.",
    },
    profile: {
      title: "Profile",
      subtitle:
        "Personal information and study configuration (currently mock data).",
      mainInfo: "Main information",
      learningConfig: "Learning configuration",
      displayName: "Display name",
      email: "Email",
      preferredLanguage: "Preferred language",
      uiLanguage: "UI language",
      selfAssessedLevel: "Self-assessed level",
    },
    tracks: {
      title: "Learning Tracks",
      subtitle: "Small tracks, each track groups challenges by topic so you can focus better.",
      empty: "No tracks available.",
      difficulty: "Difficulty",
      estimatedHours: "estimated hours",
      totalChallenges: "challenges",
      progress: "Progress",
      status: {
        notStarted: "Not Started",
        inProgress: "In Progress",
        completed: "Completed",
      },
      viewTrack: "View Track",
      startTrack: "Start Track",
      continueTrack: "Continue Learning",
      backToTracks: "← Back to Track List",
      trackOverview: "Track Overview",
      challengesInTrack: "Challenges in Track",
      noChallenges: "No challenges in this track.",
      challengeNumber: "Challenge",
      review: "Review",
      start: "Start",
    },
    achievements: {
      title: "Achievements",
      subtitle: "Discover and unlock achievements as you learn and progress.",
      unlocked: "Unlocked",
      locked: "Locked",
      noAchievements: "No achievements available.",
      noUnlockedAchievements: "No achievements unlocked yet.",
      completeChallenge: "Complete challenges to unlock your first achievement!",
      stats: {
        unlocked: "Unlocked",
        remaining: "Remaining",
        completion: "Completion",
        legendary: "Legendary",
      },
      categories: {
        all: "All",
        unlocked: "Unlocked",
        locked: "Locked",
        streak: "🔥 Streak",
        challenges: "🎯 Challenges",
        tracks: "🛤️ Tracks",
        points: "💯 Points",
        special: "✨ Special",
      },
      rarity: {
        common: "Common",
        rare: "Rare",
        epic: "Epic",
        legendary: "Legendary",
      },
      progress: "Progress",
      unlockedOn: "Unlocked",
    },
    leaderboard: {
      title: "Leaderboard",
      subtitle: "See how you rank against other learners on the platform.",
      yourRanking: "Your Ranking",
      filtersAndSorting: "Filters & Sorting",
      timeframe: "Timeframe",
      sortBy: "Sort By",
      reset: "Reset",
      top10: "Top 10 Learners",
      fullLeaderboard: "Full Leaderboard",
      rank: "Rank",
      user: "User",
      level: "Level",
      points: "Points",
      streak: "Streak",
      completed: "Completed",
      country: "Country",
      lastActive: "Last Active",
      you: "You",
      timeframes: {
        allTime: "All Time",
        monthly: "This Month",
        weekly: "This Week",
      },
      sortOptions: {
        points: "Points",
        streak: "Streak",
        completed: "Completed",
      },
    },
    settings: {
      title: "Settings",
      basicInfo: "Basic Information",
      learningPreferences: "Learning Preferences",
      editorSettings: "Editor Settings",
      notificationSettings: "Notification Settings",
      displayName: "Display Name",
      email: "Email",
      preferredLanguage: "Preferred Programming Language",
      uiLanguage: "UI Language",
      selfAssessedLevel: "Self-Assessed Level",
      theme: "Theme",
      fontSize: "Font Size",
      wordWrap: "Word Wrap",
      minimap: "Show Minimap",
      emailNotifications: "Email Notifications",
      pushNotifications: "Push Notifications",
      weeklyProgress: "Weekly Progress Report",
      saveChanges: "Save Changes",
      saving: "Saving...",
      reset: "Reset",
      themes: {
        dark: "Dark",
        light: "Light",
        highContrast: "High Contrast",
      },
      wordWrapOptions: {
        on: "On",
        off: "Off",
        atColumn: "At Column",
        bounded: "Bounded",
      },
      notifications: {
        emailDesc: "Receive notifications via email",
        pushDesc: "Receive push notifications in browser",
        weeklyDesc: "Receive weekly progress summary email",
      },
      minimapDesc: "Show minimap of code",
    },
    common: {
      languageVi: "Vietnamese",
      languageEn: "English",
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous",
      close: "Close",
      open: "Open",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      refresh: "Refresh",
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
    },
  },
};
