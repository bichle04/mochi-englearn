export type Difficulty = "Easy" | "Medium" | "Hard" | "Very Hard";

export interface ListeningPart {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  iconName: "chat" | "user" | "users" | "academic";
  duration: string;
}

export const listeningPartsMock: ListeningPart[] = [
  {
    id: "part1",
    title: "Part 1: Social Context",
    description: "Two-way conversation",
    difficulty: "Easy",
    iconName: "chat",
    duration: "6-8 mins"
  },
  {
    id: "part2",
    title: "Part 2: Daily Monologue",
    description: "General informative talk",
    difficulty: "Medium",
    iconName: "user",
    duration: "6-8 mins"
  },
  {
    id: "part3",
    title: "Part 3: Educational Context",
    description: "Group discussion or debate",
    difficulty: "Hard",
    iconName: "users",
    duration: "6-8 mins"
  },
  {
    id: "part4",
    title: "Part 4: Academic Lecture",
    description: "University-style lecture",
    difficulty: "Very Hard",
    iconName: "academic",
    duration: "6-8 mins"
  }
];

export interface PartDetail {
  partId: string;
  badgeName: string;
  partLabel: string;
  mainTitle: string;
  introduction: string;
  commonQuestions: string[];
  keyTips: {
    type: 'headphone' | 'spell';
    text: string;
  }[];
}

export const partDetailsMock: Record<string, PartDetail> = {
  "part1": {
    partId: "part1",
    badgeName: "SOCIAL CONTEXT",
    partLabel: "Part 1",
    mainTitle: "Two-way conversation",
    introduction: "IELTS Listening Part 1 có tổng cộng 10 câu hỏi và chỉ được nghe đoạn ghi âm 1 lần, thường là một cuộc hỏi đáp giữa hai người về các chủ đề liên quan đến cuộc sống hàng ngày (đặt phòng khách sạn, đăng ký khóa học).",
    commonQuestions: [
      "Form/ table/ note completion",
      "Mutiple choice",
      "Sentence completion"
    ],
    keyTips: [
      {
        type: 'headphone',
        text: "Hãy lắng nghe cách đánh vần họ và số điện thoại."
      },
      {
        type: 'spell',
        text: "Luôn kiểm tra giới hạn (ví dụ: 'không quá 2 từ')."
      }
    ]
  },
  "part2": {
    partId: "part2",
    badgeName: "DAILY MONOLOGUE",
    partLabel: "Part 2",
    mainTitle: "General informative talk",
    introduction: "Part 2 thường là một bài độc thoại trong bối cảnh xã hội hàng ngày. Bạn có thể nghe một bài phát biểu về các tiện ích địa phương hoặc hướng dẫn tham quan một viện bảo tàng.",
    commonQuestions: [
      "Map/ Plan/ Diagram labelling",
      "Multiple choice",
      "Matching"
    ],
    keyTips: [
      {
        type: 'headphone',
        text: "Ghi nhớ các từ chỉ phương hướng (North, South, Opposite)."
      },
      {
        type: 'spell',
        text: "Chú ý các từ đồng nghĩa (Synonyms) trong đáp án."
      }
    ]
  },
  "part3": {
    partId: "part3",
    badgeName: "EDUCATIONAL CONTEXT",
    partLabel: "Part 3",
    mainTitle: "Group discussion",
    introduction: "Cuộc thảo luận giữa tối đa 4 người trong bối cảnh giáo dục hoặc đào tạo. Thường là các sinh viên thảo luận về bài tập nhóm hoặc giáo viên hướng dẫn nghiên cứu.",
    commonQuestions: [
      "Multiple choice (loại dài)",
      "Matching information",
      "Flow-chart completion"
    ],
    keyTips: [
      {
        type: 'headphone',
        text: "Phân biệt các nhân vật qua giọng nói hoặc tên gọi."
      },
      {
        type: 'spell',
        text: "Lắng nghe sự đồng ý hoặc phản bác giữa các người nói."
      }
    ]
  },
  "part4": {
    partId: "part4",
    badgeName: "ACADEMIC LECTURE",
    partLabel: "Part 4",
    mainTitle: "University-style lecture",
    introduction: "Một bài giảng về chủ đề học thuật bởi duy nhất 1 người nói. Đây là phần khó nhất vì bài nói kéo dài 10 phút liên tục mà không có quãng nghỉ giữa giờ.",
    commonQuestions: [
      "Note completion",
      "Summary completion",
      "Table completion"
    ],
    keyTips: [
      {
        type: 'headphone',
        text: "Nắm bắt các từ nối (Firstly, In addition) để theo kịp bài."
      },
      {
        type: 'spell',
        text: "Kiểm tra kỹ chính tả của các thuật ngữ học thuật."
      }
    ]
  }
};
