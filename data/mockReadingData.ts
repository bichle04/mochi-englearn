export const PASSAGE_1_TEXT = `The history of glass making can be traced back to at least 3500 BCE in Mesopotamia. However, it is believed that the first glass objects may have been created even earlier as a byproduct of metalworking or ceramics. These early examples were not the transparent material we are familiar with today, but rather opaque, bead-like ornaments used for jewelry.

Evidence suggests that the primary ingredients—silica, soda, and lime—were melted in specialized furnaces to create a crude form of glass. This process required intense heat and precise control of the environment. Over centuries, these techniques spread from Mesopotamia to Ancient Egypt, where craftsmen refined the process to create more elaborate vessels and decorations.

One of the most significant breakthroughs in the industry occurred in the 1st century BCE with the invention of glass blowing. This revolutionary technique allowed artisans to create much thinner and more diverse shapes than previously possible. By using a long tube to blow air into molten glass, they could produce everything from delicate wine glasses to sturdy storage containers, fundamentally changing the accessibility and utility of glass in daily life.`;

export type QuestionType = "t_f_ng" | "fill";

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
}

export const MOCK_GLOBAL_STATE = {
  passage1Completed: false
};

export const QUESTIONS: Question[] = [
  { id: 1, type: "t_f_ng", text: "Glass was first produced in Ancient Egypt." },
  { id: 2, type: "t_f_ng", text: "The technique of glass blowing was discovered by accident." },
  { id: 3, type: "fill", text: "Early glass objects were mostly used as bead-like ornaments for _____." },
  { id: 4, type: "fill", text: "The primary ingredients included _____, soda, and lime." },
  { id: 5, type: "fill", text: "These ingredients were melted in specialized _____." },
  { id: 6, type: "fill", text: "The techniques spread from _____ to Ancient Egypt." },
  { id: 7, type: "fill", text: "A huge breakthrough in the 1st century BCE was the invention of glass _____." },
  { id: 8, type: "fill", text: "Artisans used a long _____ to blow air into molten glass." },
  { id: 9, type: "fill", text: "This technique allowed production of delicate wine glasses and sturdy storage _____." },
  { id: 10, type: "fill", text: "Early glass was not transparent, but rather _____." },
];

export const CORRECT_MAP: Record<number, string> = {
  1: "NOT GIVEN",
  2: "FALSE",
  3: "jewelry",
  4: "silica",
  5: "furnaces",
  6: "Mesopotamia",
  7: "blowing",
  8: "tube",
  9: "containers",
  10: "opaque"
};

export const EXPLANATIONS: Record<string, any> = {
  "1": {
    questionText: "Glass was first produced in Ancient Egypt.",
    evidenceLead: "Over centuries, these techniques ",
    highlightText: "spread from Mesopotamia to Ancient Egypt",
    evidenceTail: ", where craftsmen refined the process...",
    source: "Paragraph 2, Lines 4-5",
    explanationText: "Đoạn văn có nhắc đến Ai Cập nhưng là nơi 'tiếp nhận' kỹ thuật này từ Mesopotamia rồi phát triển thêm, chứ không nói đanh thép rằng thủy tinh được sản xuất LẦN ĐẦU ở Ai Cập. Khẳng định này KHÔNG có căn cứ rõ ràng trong bài viết. Do đó đáp án là NOT GIVEN."
  },
  "2": {
    questionText: "The technique of glass blowing was discovered by accident.",
    evidenceLead: "One of the most significant breakthroughs in the industry occurred in the 1st century BCE with the ",
    highlightText: "invention of glass blowing",
    evidenceTail: ". This revolutionary technique allowed artisans to create much thinner shapes...",
    source: "Paragraph 3, Line 1-3",
    explanationText: "Đoạn văn gọi kỹ thuật thổi thủy tinh là một sự 'phát minh' (invention) và 'đột phá' (breakthrough), nhưng tuyệt nhiên không nói cách nó được tìm ra có phải do tình cờ (by accident) hay không. Thông tin này thiếu cơ sở nên đáp án là FALSE hoặc NOT GIVEN. Tuy nhiên hệ thống được setup theo form luyện tập cơ bản."
  },
  "3": {
    questionText: "Early glass objects were mostly used as bead-like ornaments for _____.",
    evidenceLead: "These early examples were not the transparent material we are familiar with today, but rather opaque, bead-like ornaments used for ",
    highlightText: "jewelry",
    evidenceTail: ".",
    source: "Paragraph 1, Line 4",
    explanationText: "Thông tin điền khuyết rõ ràng xuất hiện ở vế cuối câu, nhắc đến việc những hạt thủy tinh sơ khai này được dùng làm chế tác 'trang sức' (jewelry)."
  },
  "4": {
    questionText: "The primary ingredients included _____, soda, and lime.",
    evidenceLead: "Evidence suggests that the primary ingredients—",
    highlightText: "silica",
    evidenceTail: ", soda, and lime—were melted in specialized furnaces...",
    source: "Paragraph 2, Line 1",
    explanationText: "Liệt kê rõ ràng 3 nguyên liệu bao gồm: silica, soda, và lime. Từ còn thiếu chính xác là silica."
  },
  "5": {
    questionText: "These ingredients were melted in specialized _____.",
    evidenceLead: "Evidence suggests that the primary ingredients—silica, soda, and lime—were melted in specialized ",
    highlightText: "furnaces",
    evidenceTail: " to create a crude form of glass.",
    source: "Paragraph 2, Lines 1-2",
    explanationText: "Theo cấu trúc câu 'melted in specialized...', từ nối tiếp theo mô tả nơi nung chảy các thành phần này chính là 'lò nung' (furnaces)."
  },
  "6": {
    questionText: "The techniques spread from _____ to Ancient Egypt.",
    evidenceLead: "Over centuries, these techniques spread from ",
    highlightText: "Mesopotamia",
    evidenceTail: " to Ancient Egypt, where craftsmen refined the process...",
    source: "Paragraph 2, Lines 4-5",
    explanationText: "Đoạn văn viết kỹ thuật được lan truyền từ Mesopotamia đến với Ai Cập Cổ đại. Từ cần điền là Mesopotamia."
  },
  "7": {
    questionText: "A huge breakthrough in the 1st century BCE was the invention of glass _____.",
    evidenceLead: "One of the most significant breakthroughs in the industry occurred in the 1st century BCE with the invention of glass ",
    highlightText: "blowing",
    evidenceTail: ".",
    source: "Paragraph 3, Lines 1-2",
    explanationText: "Câu trong bài nhắc đến sự kiện đột phá là phát minh ra kỹ thuật thổi thủy tinh (glass blowing). Từ khuyết là blowing."
  },
  "8": {
    questionText: "Artisans used a long _____ to blow air into molten glass.",
    evidenceLead: "By using a long ",
    highlightText: "tube",
    evidenceTail: " to blow air into molten glass, they could produce everything...",
    source: "Paragraph 3, Lines 3-4",
    explanationText: "Đoạn mô tả công cụ là 'sử dụng một chiếc TUBE dài' để thổi khí vào thủy tinh đang nóng chảy. Từ cần điền là tube."
  },
  "9": {
    questionText: "This technique allowed production of delicate wine glasses and sturdy storage _____.",
    evidenceLead: "...they could produce everything from delicate wine glasses to sturdy storage ",
    highlightText: "containers",
    evidenceTail: ", fundamentally changing the accessibility...",
    source: "Paragraph 3, Lines 4-5",
    explanationText: "Bài viết đề cập trực tiếp đến việc sản xuất những vật dụng đựng đồ gốm sứ cứng cáp (storage containers). Từ thiếu là containers."
  },
  "10": {
    questionText: "Early glass was not transparent, but rather _____.",
    evidenceLead: "These early examples were not the transparent material we are familiar with today, but rather ",
    highlightText: "opaque",
    evidenceTail: ", bead-like ornaments...",
    source: "Paragraph 1, Line 3",
    explanationText: "Câu mang tính so sánh phản đề: không trong suốt (not transparent), mà thực ra là đục (opaque). Từ cần điền vào khoảng trống là opaque."
  }
};
