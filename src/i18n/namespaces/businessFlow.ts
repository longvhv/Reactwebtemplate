/**
 * Business Flow Translations Namespace
 * For Business Flow Detail pages and User Stories
 */

export const businessFlowVI = {
  // Business Flow Detail Page
  backToDocs: 'Quay lại Developer Docs',
  loading: 'Đang tải thông tin business flow...',
  completed: 'Hoàn thành',
  inProgress: 'Đang thực hiện',
  planned: 'Kế hoạch',
  highPriority: 'Ưu tiên cao',
  usecases: 'Usecases',
  testcases: 'Testcases',
  apis: 'APIs',
  tables: 'Tables',
  completionRate: 'hoàn thành',

  // Tabs
  tabs: {
    userStory: 'User Story',
    activityDiagram: 'Activity Diagram',
    sequenceDiagram: 'Sequence Diagram',
    detailSpec: 'Đặc tả chi tiết',
    apiEndpoints: 'API Endpoints',
    databaseTable: 'Database Table',
    testcase: 'Testcase',
  },

  // User Story Tab
  userStory: {
    title: 'User Stories',
    overview: 'User Stories Overview',
    stories: 'Stories',
    completed: 'Completed',
    inProgress: 'In Progress',
    storyPoints: 'Story Points',
    estimatedHours: 'Est. Hours',
    noStories: 'Chưa có User Story',
    noStoriesDescription: 'Business flow này chưa có user stories. Hãy tạo user stories theo mô hình 3C để định nghĩa yêu cầu nghiệp vụ.',
    
    // Status badges
    status: {
      completed: 'Completed',
      inProgress: 'In Progress',
      ready: 'Ready',
      draft: 'Draft',
    },
    
    // Priority
    priority: {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
    },

    // 3C Model
    card: {
      title: 'User Story',
      asA: 'AS A',
      iWant: 'I WANT',
      soThat: 'SO THAT',
    },

    // Acceptance Criteria
    acceptance: {
      title: 'Acceptance Criteria - Detailed Specifications',
      features: 'features',
      description: 'Description',
      criteria: 'Acceptance Criteria',
      status: {
        passed: 'passed',
        failed: 'failed',
        pending: 'pending',
      },
    },

    // Conversation
    conversation: {
      businessValue: 'Business Value',
      technicalNotes: 'Technical Notes',
      notes: 'Notes',
    },

    // Metadata
    sp: 'SP',
    hours: 'h',
  },

  // Activity Diagram Tab
  activityDiagram: {
    title: 'Activity Diagram',
    description: 'Sơ đồ hoạt động mô tả luồng xử lý của business flow',
    notAvailable: 'Activity Diagram chưa có sẵn',
    notAvailableDescription: 'Sơ đồ hoạt động cho business flow này đang được phát triển.',
  },

  // Sequence Diagram Tab
  sequenceDiagram: {
    title: 'Sequence Diagram',
    description: 'Sơ đồ tuần tự mô tả tương tác giữa các thành phần',
    notAvailable: 'Sequence Diagram chưa có sẵn',
    notAvailableDescription: 'Sơ đồ tuần tự cho business flow này đang được phát triển.',
  },

  // Detail Spec Tab
  detailSpec: {
    title: 'Đặc tả chi tiết',
    description: 'Tài liệu đặc tả yêu cầu chi tiết cho business flow',
    notAvailable: 'Đặc tả chi tiết chưa có sẵn',
    notAvailableDescription: 'Tài liệu đặc tả chi tiết cho business flow này đang được phát triển.',
  },

  // API Endpoints Tab
  apiEndpoints: {
    title: 'API Endpoints',
    description: 'Danh sách API endpoints liên quan đến business flow này',
    noEndpoints: 'Chưa có API endpoints',
    noEndpointsDescription: 'Business flow này chưa có API endpoints được định nghĩa.',
    totalEndpoints: 'Tổng số endpoints',
  },

  // Database Table Tab
  databaseTable: {
    title: 'Database Tables',
    description: 'Danh sách bảng dữ liệu liên quan đến business flow này',
    noTables: 'Chưa có database tables',
    noTablesDescription: 'Business flow này chưa có bảng dữ liệu được định nghĩa.',
    totalTables: 'Tổng số bảng',
  },

  // Testcase Tab
  testcaseTab: {
    title: 'Testcases',
    description: 'Danh sách testcases cho business flow này',
    noTestcases: 'Chưa có testcases',
    noTestcasesDescription: 'Business flow này chưa có testcases được định nghĩa.',
    totalTestcases: 'Tổng số testcases',
  },

  // Common labels
  flowLabel: 'Flow:',
  countAPIs: '{{count}} APIs',
  countTables: '{{count}} Tables',
  countTestcases: '{{count}} Testcases',
};

export const businessFlowEN = {
  backToDocs: 'Back to Developer Docs',
  loading: 'Loading business flow information...',
  completed: 'Completed',
  inProgress: 'In Progress',
  planned: 'Planned',
  highPriority: 'High Priority',
  usecases: 'Usecases',
  testcases: 'Testcases',
  apis: 'APIs',
  tables: 'Tables',
  completionRate: 'complete',

  tabs: {
    userStory: 'User Story',
    activityDiagram: 'Activity Diagram',
    sequenceDiagram: 'Sequence Diagram',
    detailSpec: 'Detail Specification',
    apiEndpoints: 'API Endpoints',
    databaseTable: 'Database Table',
    testcase: 'Testcase',
  },

  userStory: {
    title: 'User Stories',
    overview: 'User Stories Overview',
    stories: 'Stories',
    completed: 'Completed',
    inProgress: 'In Progress',
    storyPoints: 'Story Points',
    estimatedHours: 'Est. Hours',
    noStories: 'No User Stories',
    noStoriesDescription: 'This business flow doesn\'t have user stories yet. Create user stories following the 3C model to define business requirements.',
    
    status: {
      completed: 'Completed',
      inProgress: 'In Progress',
      ready: 'Ready',
      draft: 'Draft',
    },
    
    priority: {
      high: 'High Priority',
      medium: 'Medium Priority',
      low: 'Low Priority',
    },

    card: {
      title: 'User Story',
      asA: 'AS A',
      iWant: 'I WANT',
      soThat: 'SO THAT',
    },

    acceptance: {
      title: 'Acceptance Criteria - Detailed Specifications',
      features: 'features',
      description: 'Description',
      criteria: 'Acceptance Criteria',
      status: {
        passed: 'passed',
        failed: 'failed',
        pending: 'pending',
      },
    },

    conversation: {
      businessValue: 'Business Value',
      technicalNotes: 'Technical Notes',
      notes: 'Notes',
    },

    sp: 'SP',
    hours: 'h',
  },

  activityDiagram: {
    title: 'Activity Diagram',
    description: 'Activity diagram showing business flow processing',
    notAvailable: 'Activity Diagram not available',
    notAvailableDescription: 'The activity diagram for this business flow is under development.',
  },

  sequenceDiagram: {
    title: 'Sequence Diagram',
    description: 'Sequence diagram showing component interactions',
    notAvailable: 'Sequence Diagram not available',
    notAvailableDescription: 'The sequence diagram for this business flow is under development.',
  },

  detailSpec: {
    title: 'Detail Specification',
    description: 'Detailed requirement specification for business flow',
    notAvailable: 'Detail Specification not available',
    notAvailableDescription: 'The detail specification for this business flow is under development.',
  },

  apiEndpoints: {
    title: 'API Endpoints',
    description: 'List of API endpoints related to this business flow',
    noEndpoints: 'No API endpoints',
    noEndpointsDescription: 'This business flow doesn\'t have API endpoints defined yet.',
    totalEndpoints: 'Total endpoints',
  },

  databaseTable: {
    title: 'Database Tables',
    description: 'List of database tables related to this business flow',
    noTables: 'No database tables',
    noTablesDescription: 'This business flow doesn\'t have database tables defined yet.',
    totalTables: 'Total tables',
  },

  testcaseTab: {
    title: 'Testcases',
    description: 'List of testcases for this business flow',
    noTestcases: 'No testcases',
    noTestcasesDescription: 'This business flow doesn\'t have testcases defined yet.',
    totalTestcases: 'Total testcases',
  },

  // Common labels
  flowLabel: 'Flow:',
  countAPIs: '{{count}} APIs',
  countTables: '{{count}} Tables',
  countTestcases: '{{count}} Testcases',
};

export type BusinessFlowTranslation = typeof businessFlowVI;

// Spanish (es)
export const businessFlowES = {
  backToDocs: 'Volver a Documentación para Desarrolladores',
  loading: 'Cargando información de flujo de negocio...',
  completed: 'Completado',
  inProgress: 'En Progreso',
  planned: 'Planificado',
  highPriority: 'Alta Prioridad',
  usecases: 'Casos de Uso',
  testcases: 'Casos de Prueba',
  apis: 'APIs',
  tables: 'Tablas',
  completionRate: 'completado',

  tabs: {
    userStory: 'Historia de Usuario',
    activityDiagram: 'Diagrama de Actividad',
    sequenceDiagram: 'Diagrama de Secuencia',
    detailSpec: 'Especificación Detallada',
    apiEndpoints: 'Endpoints de API',
    databaseTable: 'Tabla de Base de Datos',
    testcase: 'Caso de Prueba',
  },

  userStory: {
    title: 'Historias de Usuario',
    overview: 'Resumen de Historias de Usuario',
    stories: 'Historias',
    completed: 'Completado',
    inProgress: 'En Progreso',
    storyPoints: 'Puntos de Historia',
    estimatedHours: 'Horas Est.',
    noStories: 'Sin Historias de Usuario',
    noStoriesDescription: 'Este flujo de negocio aún no tiene historias de usuario. Crea historias siguiendo el modelo 3C para definir requisitos de negocio.',
    
    status: {
      completed: 'Completado',
      inProgress: 'En Progreso',
      ready: 'Listo',
      draft: 'Borrador',
    },
    
    priority: {
      high: 'Alta Prioridad',
      medium: 'Prioridad Media',
      low: 'Baja Prioridad',
    },

    card: {
      title: 'Historia de Usuario',
      asA: 'COMO',
      iWant: 'QUIERO',
      soThat: 'PARA QUE',
    },

    acceptance: {
      title: 'Criterios de Aceptación - Especificaciones Detalladas',
      features: 'características',
      description: 'Descripción',
      criteria: 'Criterios de Aceptación',
      status: {
        passed: 'aprobado',
        failed: 'fallido',
        pending: 'pendiente',
      },
    },

    conversation: {
      businessValue: 'Valor de Negocio',
      technicalNotes: 'Notas Técnicas',
      notes: 'Notas',
    },

    sp: 'SP',
    hours: 'h',
  },

  activityDiagram: {
    title: 'Diagrama de Actividad',
    description: 'Diagrama de actividad que muestra el procesamiento del flujo de negocio',
    notAvailable: 'Diagrama de Actividad no disponible',
    notAvailableDescription: 'El diagrama de actividad para este flujo de negocio está en desarrollo.',
  },

  sequenceDiagram: {
    title: 'Diagrama de Secuencia',
    description: 'Diagrama de secuencia que muestra las interacciones de componentes',
    notAvailable: 'Diagrama de Secuencia no disponible',
    notAvailableDescription: 'El diagrama de secuencia para este flujo de negocio está en desarrollo.',
  },

  detailSpec: {
    title: 'Especificación Detallada',
    description: 'Especificación de requisitos detallada para el flujo de negocio',
    notAvailable: 'Especificación Detallada no disponible',
    notAvailableDescription: 'La especificación detallada para este flujo de negocio está en desarrollo.',
  },

  apiEndpoints: {
    title: 'Endpoints de API',
    description: 'Lista de endpoints de API relacionados con este flujo de negocio',
    noEndpoints: 'Sin endpoints de API',
    noEndpointsDescription: 'Este flujo de negocio aún no tiene endpoints de API definidos.',
    totalEndpoints: 'Total de endpoints',
  },

  databaseTable: {
    title: 'Tablas de Base de Datos',
    description: 'Lista de tablas de base de datos relacionadas con este flujo de negocio',
    noTables: 'Sin tablas de base de datos',
    noTablesDescription: 'Este flujo de negocio aún no tiene tablas de base de datos definidas.',
    totalTables: 'Total de tablas',
  },

  testcaseTab: {
    title: 'Casos de Prueba',
    description: 'Lista de casos de prueba para este flujo de negocio',
    noTestcases: 'Sin casos de prueba',
    noTestcasesDescription: 'Este flujo de negocio aún no tiene casos de prueba definidos.',
    totalTestcases: 'Total de casos de prueba',
  },

  flowLabel: 'Flujo:',
  countAPIs: '{{count}} APIs',
  countTables: '{{count}} Tablas',
  countTestcases: '{{count}} Casos de Prueba',
};

// Chinese (zh)
export const businessFlowZH = {
  backToDocs: '返回开发者文档',
  loading: '正在加载业务流程信息...',
  completed: '已完成',
  inProgress: '进行中',
  planned: '已计划',
  highPriority: '高优先级',
  usecases: '用例',
  testcases: '测试用例',
  apis: 'APIs',
  tables: '表',
  completionRate: '完成',

  tabs: {
    userStory: '用户故事',
    activityDiagram: '活动图',
    sequenceDiagram: '序列图',
    detailSpec: '详细规范',
    apiEndpoints: 'API端点',
    databaseTable: '数据库表',
    testcase: '测试用例',
  },

  userStory: {
    title: '用户故事',
    overview: '用户故事概述',
    stories: '故事',
    completed: '已完成',
    inProgress: '进行中',
    storyPoints: '故事点',
    estimatedHours: '预计小时',
    noStories: '无用户故事',
    noStoriesDescription: '此业务流程尚无用户故事。请按照3C模型创建用户故事以定义业务需求。',
    
    status: {
      completed: '已完成',
      inProgress: '进行中',
      ready: '就绪',
      draft: '草稿',
    },
    
    priority: {
      high: '高优先级',
      medium: '中优先级',
      low: '低优先级',
    },

    card: {
      title: '用户故事',
      asA: '作为',
      iWant: '我想要',
      soThat: '以便',
    },

    acceptance: {
      title: '验收标准 - 详细规范',
      features: '功能',
      description: '描述',
      criteria: '验收标准',
      status: {
        passed: '通过',
        failed: '失败',
        pending: '待处理',
      },
    },

    conversation: {
      businessValue: '业务价值',
      technicalNotes: '技术说明',
      notes: '备注',
    },

    sp: 'SP',
    hours: 'h',
  },

  activityDiagram: {
    title: '活动图',
    description: '显示业务流程处理的活动图',
    notAvailable: '活动图不可用',
    notAvailableDescription: '此业务流程的活动图正在开发中。',
  },

  sequenceDiagram: {
    title: '序列图',
    description: '显示组件交互的序列图',
    notAvailable: '序列图不可用',
    notAvailableDescription: '此业务流程的序列图正在开发中。',
  },

  detailSpec: {
    title: '详细规范',
    description: '业务流程的详细需求规范',
    notAvailable: '详细规范不可用',
    notAvailableDescription: '此业务流程的详细规范正在开发中。',
  },

  apiEndpoints: {
    title: 'API端点',
    description: '与此业务流程相关的API端点列表',
    noEndpoints: '无API端点',
    noEndpointsDescription: '此业务流程尚未定义API端点。',
    totalEndpoints: '端点总数',
  },

  databaseTable: {
    title: '数据库表',
    description: '与此业务流程相关的数据库表列表',
    noTables: '无数据库表',
    noTablesDescription: '此业务流程尚未定义数据库表。',
    totalTables: '表总数',
  },

  testcaseTab: {
    title: '测试用例',
    description: '此业务流程的测试用例列表',
    noTestcases: '无测试用例',
    noTestcasesDescription: '此业务流程尚未定义测试用例。',
    totalTestcases: '测试用例总数',
  },

  flowLabel: '流程：',
  countAPIs: '{{count}} 个APIs',
  countTables: '{{count}} 个表',
  countTestcases: '{{count}} 个测试用例',
};

// Japanese (ja)
export const businessFlowJA = {
  backToDocs: '開発者ドキュメントに戻る',
  loading: 'ビジネスフロー情報を読み込んでいます...',
  completed: '完了',
  inProgress: '進行中',
  planned: '計画済み',
  highPriority: '高優先度',
  usecases: 'ユースケース',
  testcases: 'テストケース',
  apis: 'APIs',
  tables: 'テーブル',
  completionRate: '完了',

  tabs: {
    userStory: 'ユーザーストーリー',
    activityDiagram: 'アクティビティ図',
    sequenceDiagram: 'シーケンス図',
    detailSpec: '詳細仕様',
    apiEndpoints: 'APIエンドポイント',
    databaseTable: 'データベーステーブル',
    testcase: 'テストケース',
  },

  userStory: {
    title: 'ユーザーストーリー',
    overview: 'ユーザーストーリー概要',
    stories: 'ストーリー',
    completed: '完了',
    inProgress: '進行中',
    storyPoints: 'ストーリーポイント',
    estimatedHours: '見積時間',
    noStories: 'ユーザーストーリーなし',
    noStoriesDescription: 'このビジネスフローにはまだユーザーストーリーがありません。3Cモデルに従ってユーザーストーリーを作成し、ビジネス要件を定義してください。',
    
    status: {
      completed: '完了',
      inProgress: '進行中',
      ready: '準備完了',
      draft: '下書き',
    },
    
    priority: {
      high: '高優先度',
      medium: '中優先度',
      low: '低優先度',
    },

    card: {
      title: 'ユーザーストーリー',
      asA: 'として',
      iWant: 'したい',
      soThat: 'ために',
    },

    acceptance: {
      title: '受け入れ基準 - 詳細仕様',
      features: '機能',
      description: '説明',
      criteria: '受け入れ基準',
      status: {
        passed: '合格',
        failed: '不合格',
        pending: '保留中',
      },
    },

    conversation: {
      businessValue: 'ビジネス価値',
      technicalNotes: '技術ノート',
      notes: 'ノート',
    },

    sp: 'SP',
    hours: 'h',
  },

  activityDiagram: {
    title: 'アクティビティ図',
    description: 'ビジネスフロー処理を示すアクティビティ図',
    notAvailable: 'アクティビティ図は利用できません',
    notAvailableDescription: 'このビジネスフローのアクティビティ図は開発中です。',
  },

  sequenceDiagram: {
    title: 'シーケンス図',
    description: 'コンポーネントの相互作用を示すシーケンス図',
    notAvailable: 'シーケンス図は利用できません',
    notAvailableDescription: 'このビジネスフローのシーケンス図は開発中です。',
  },

  detailSpec: {
    title: '詳細仕様',
    description: 'ビジネスフローの詳細要件仕様',
    notAvailable: '詳細仕様は利用できません',
    notAvailableDescription: 'このビジネスフローの詳細仕様は開発中です。',
  },

  apiEndpoints: {
    title: 'APIエンドポイント',
    description: 'このビジネスフローに関連するAPIエンドポイントのリスト',
    noEndpoints: 'APIエンドポイントなし',
    noEndpointsDescription: 'このビジネスフローにはまだAPIエンドポイントが定義されていません。',
    totalEndpoints: 'エンドポイント総数',
  },

  databaseTable: {
    title: 'データベーステーブル',
    description: 'このビジネスフローに関連するデータベーステーブルのリスト',
    noTables: 'データベーステーブルなし',
    noTablesDescription: 'このビジネスフローにはまだデータベーステーブルが定義されていません。',
    totalTables: 'テーブル総数',
  },

  testcaseTab: {
    title: 'テストケース',
    description: 'このビジネスフローのテストケースリスト',
    noTestcases: 'テストケースなし',
    noTestcasesDescription: 'このビジネスフローにはまだテストケースが定義されていません。',
    totalTestcases: 'テストケース総数',
  },

  flowLabel: 'フロー：',
  countAPIs: '{{count}} APIs',
  countTables: '{{count}} テーブル',
  countTestcases: '{{count}} テストケース',
};

// Korean (ko)
export const businessFlowKO = {
  backToDocs: '개발자 문서로 돌아가기',
  loading: '비즈니스 플로우 정보 로딩 중...',
  completed: '완료됨',
  inProgress: '진행 중',
  planned: '계획됨',
  highPriority: '높은 우선순위',
  usecases: '유스케이스',
  testcases: '테스트케이스',
  apis: 'APIs',
  tables: '테이블',
  completionRate: '완료',

  tabs: {
    userStory: '사용자 스토리',
    activityDiagram: '활동 다이어그램',
    sequenceDiagram: '시퀀스 다이어그램',
    detailSpec: '상세 사양',
    apiEndpoints: 'API 엔드포인트',
    databaseTable: '데이터베이스 테이블',
    testcase: '테스트케이스',
  },

  userStory: {
    title: '사용자 스토리',
    overview: '사용자 스토리 개요',
    stories: '스토리',
    completed: '완료됨',
    inProgress: '진행 중',
    storyPoints: '스토리 포인트',
    estimatedHours: '예상 시간',
    noStories: '사용자 스토리 없음',
    noStoriesDescription: '이 비즈니스 플로우에는 아직 사용자 스토리가 없습니다. 3C 모델에 따라 사용자 스토리를 생성하여 비즈니스 요구사항을 정의하세요.',
    
    status: {
      completed: '완료됨',
      inProgress: '진행 중',
      ready: '준비됨',
      draft: '초안',
    },
    
    priority: {
      high: '높은 우선순위',
      medium: '중간 우선순위',
      low: '낮은 우선순위',
    },

    card: {
      title: '사용자 스토리',
      asA: '로서',
      iWant: '원한다',
      soThat: '위해서',
    },

    acceptance: {
      title: '승인 기준 - 상세 사양',
      features: '기능',
      description: '설명',
      criteria: '승인 기준',
      status: {
        passed: '통과',
        failed: '실패',
        pending: '보류 중',
      },
    },

    conversation: {
      businessValue: '비즈니스 가치',
      technicalNotes: '기술 노트',
      notes: '노트',
    },

    sp: 'SP',
    hours: 'h',
  },

  activityDiagram: {
    title: '활동 다이어그램',
    description: '비즈니스 플로우 처리를 보여주는 활동 다이어그램',
    notAvailable: '활동 다이어그램 사용 불가',
    notAvailableDescription: '이 비즈니스 플로우의 활동 다이어그램은 개발 중입니다.',
  },

  sequenceDiagram: {
    title: '시퀀스 다이어그램',
    description: '컴포넌트 상호작용을 보여주는 시퀀스 다이어그램',
    notAvailable: '시퀀스 다이어그램 사용 불가',
    notAvailableDescription: '이 비즈니스 플로우의 시퀀스 다이어그램은 개발 중입니다.',
  },

  detailSpec: {
    title: '상세 사양',
    description: '비즈니스 플로우의 상세 요구사항 사양',
    notAvailable: '상세 사양 사용 불가',
    notAvailableDescription: '이 비즈니스 플로우의 상세 사양은 개발 중입니다.',
  },

  apiEndpoints: {
    title: 'API 엔드포인트',
    description: '이 비즈니스 플로우와 관련된 API 엔드포인트 목록',
    noEndpoints: 'API 엔드포인트 없음',
    noEndpointsDescription: '이 비즈니스 플로우에는 아직 API 엔드포인트가 정의되지 않았습니다.',
    totalEndpoints: '총 엔드포인트 수',
  },

  databaseTable: {
    title: '데이터베이스 테이블',
    description: '이 비즈니스 플로우와 관련된 데이터베이스 테이블 목록',
    noTables: '데이터베이스 테이블 없음',
    noTablesDescription: '이 비즈니스 플로우에는 아직 데이터베이스 테이블이 정의되지 않았습니다.',
    totalTables: '총 테이블 수',
  },

  testcaseTab: {
    title: '테스트케이스',
    description: '이 비즈니스 플로우의 테스트케이스 목록',
    noTestcases: '테스트케이스 없음',
    noTestcasesDescription: '이 비즈니스 플로우에는 아직 테스트케이스가 정의되지 않았습니다.',
    totalTestcases: '총 테스트케이스 수',
  },

  flowLabel: '플로우:',
  countAPIs: '{{count}} APIs',
  countTables: '{{count}} 테이블',
  countTestcases: '{{count}} 테스트케이스',
};