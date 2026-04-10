export const LISTENING_CORRECT_ANSWERS: Record<number, string> = {
  1: "David Brown",
  2: "15th June",
  3: "Double",
  4: "Late check-in",
  5: "0934582211",
  6: "2",
  7: "Included",
  8: "7 pm",
  9: "Credit card",
  10: "david.brown@gmail.com"
};

export const LISTENING_LABELS: Record<number, string> = {
  1: "GUEST NAME",
  2: "CHECK-IN DATE",
  3: "ROOM TYPE",
  4: "SPECIAL REQUESTS",
  5: "CONTACT PHONE NUMBER",
  6: "NUMBER OF GUESTS",
  7: "BREAKFAST OPTION",
  8: "ESTIMATED ARRIVAL TIME",
  9: "PAYMENT METHOD",
  10: "EMAIL ADDRESS"
};

export interface ListeningExplanation {
  topic: string;
  questionText: string;
  transcript: string;
  highlight: string;
  explanation: string;
}

export const LISTENING_EXPLANATIONS: Record<string, ListeningExplanation> = {
  "1": {
    topic: "FORM COMPLETION - HOTEL RESERVATION",
    questionText: "Guest Name [1] ________",
    transcript: "...I'll be checking in under the name David Brown. That’s B-R-O-W-N.",
    highlight: "David Brown",
    explanation: "Người nói đánh vần tên họ là B-R-O-W-N và xác nhận tên là David Brown. Đây là thông tin trực tiếp cần điền vào mẫu."
  },
  "2": {
    topic: "FORM COMPLETION - HOTEL RESERVATION",
    questionText: "Check-in Date [2] ________",
    transcript: "I initially planned for the 13th, but my flight was delayed, so I'll be arriving on the 15th of June.",
    highlight: "15th of June",
    explanation: "Mặc dù người nói có nhắc đến ngày 13, nhưng sau đó đã đính chính lại là ngày 15 tháng 6 do chuyến bay bị hoãn. Chú ý các thông tin gây nhiễu (distractors)."
  },
  "4": {
    topic: "FORM COMPLETION - HOTEL RESERVATION",
    questionText: "Special Requests [4] ________",
    transcript: "...I won't be arriving until quite late, probably around 11 PM, so I'll need a late check-in if that’s possible.",
    highlight: "late check-in",
    explanation: "Người nói đề cập rõ ràng đến việc đến trễ và yêu cầu \"late check-in\". Điều quan trọng là phải lắng nghe cụm từ cụ thể phù hợp với ngữ cảnh."
  }
};
