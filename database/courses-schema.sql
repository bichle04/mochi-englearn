-- ============================================================================
-- COURSES AND WORDS SCHEMA
-- ============================================================================

-- Tạo bảng courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  level TEXT NOT NULL,
  category TEXT NOT NULL,
  color_start TEXT NOT NULL,
  color_end TEXT NOT NULL,
  icon TEXT,
  estimated_time INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng words
CREATE TABLE words (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  pronunciation TEXT,
  definition TEXT NOT NULL,
  example TEXT,
  difficulty TEXT,
  synonyms TEXT[] DEFAULT '{}',
  antonyms TEXT[] DEFAULT '{}',
  audio_url TEXT,
  order_index INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng questions/exercises cho courses
CREATE TABLE course_questions (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'fill_blank', 'matching'
  correct_answer TEXT NOT NULL,
  options TEXT[] DEFAULT '{}', -- Cho multiple choice
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho hiệu suất
CREATE INDEX idx_words_course_id ON words(course_id);
CREATE INDEX idx_words_order_index ON words(order_index);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_course_questions_course_id ON course_questions(course_id);
CREATE INDEX idx_course_questions_word_id ON course_questions(word_id);

-- Enable RLS cho courses
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- RLS policies cho courses (public read, admin write)
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert courses" ON courses
    FOR INSERT WITH CHECK (false);

CREATE POLICY "Only admins can update courses" ON courses
    FOR UPDATE USING (false);

CREATE POLICY "Only admins can delete courses" ON courses
    FOR DELETE USING (false);

-- Enable RLS cho words
ALTER TABLE words ENABLE ROW LEVEL SECURITY;

-- RLS policies cho words (public read, admin write)
CREATE POLICY "Anyone can view words" ON words
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert words" ON words
    FOR INSERT WITH CHECK (false);

CREATE POLICY "Only admins can update words" ON words
    FOR UPDATE USING (false);

CREATE POLICY "Only admins can delete words" ON words
    FOR DELETE USING (false);

-- Enable RLS cho course_questions
ALTER TABLE course_questions ENABLE ROW LEVEL SECURITY;

-- RLS policies cho course_questions (public read, admin write)
CREATE POLICY "Anyone can view course questions" ON course_questions
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert course questions" ON course_questions
    FOR INSERT WITH CHECK (false);

CREATE POLICY "Only admins can update course questions" ON course_questions
    FOR UPDATE USING (false);

CREATE POLICY "Only admins can delete course questions" ON course_questions
    FOR DELETE USING (false);

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert courses
INSERT INTO courses (title, subtitle, description, level, category, color_start, color_end, icon, estimated_time, total_words) VALUES
('TOEIC Vocabulary', 'Business English Essentials', 'Essential business vocabulary for TOEIC preparation with real-world examples', 'Intermediate', 'Business', '#FF6B9D', '#FF8C42', '💼', 45, 20),
('IELTS Academic', 'Academic English, Writing & Speaking', 'Advanced academic vocabulary for IELTS exam preparation', 'Advanced', 'Academic', '#9B59B6', '#8E44AD', '📚', 60, 15),
('Daily Conversation', 'Everyday English', 'Common phrases and words for daily conversations and interactions', 'Beginner', 'General', '#F39C12', '#E67E22', '💬', 25, 10);

-- Insert words for TOEIC Vocabulary (Course 1)
INSERT INTO words (course_id, word, pronunciation, definition, example, difficulty, synonyms, antonyms, order_index) VALUES
(1, 'Collaborate', '/kəˈlæbəreɪt/', 'To work jointly with others or together especially in an intellectual endeavor', 'We need to collaborate with the marketing team on this project.', 'Intermediate', '{"cooperate","work together","partner"}', '{"compete","oppose"}', 1),
(1, 'Comprehensive', '/ˌkɒmprɪˈhensɪv/', 'Complete and including everything that is necessary', 'The report provides a comprehensive analysis of market trends.', 'Advanced', '{"complete","thorough","extensive"}', '{"incomplete","partial"}', 2),
(1, 'Implement', '/ˈɪmplɪment/', 'To put a decision or plan into effect', 'The company will implement new safety procedures next month.', 'Intermediate', '{"execute","carry out","apply"}', '{"abandon","ignore"}', 3),
(1, 'Efficiency', '/ɪˈfɪʃənsi/', 'The state or quality of being efficient', 'The new system improved workplace efficiency by 30%.', 'Intermediate', '{"effectiveness","productivity","competence"}', '{"inefficiency","waste"}', 4),
(1, 'Prioritize', '/praɪˈɒrɪtaɪz/', 'To designate or treat something as more important than other things', 'We need to prioritize customer satisfaction above all else.', 'Intermediate', '{"rank","order","emphasize"}', '{"neglect","ignore"}', 5),
(1, 'Revenue', '/ˈrevənjuː/', 'Income, especially when of a company or organization', 'The company''s revenue increased by 15% this quarter.', 'Intermediate', '{"income","earnings","profit"}', '{"loss","expenditure"}', 6),
(1, 'Negotiate', '/nɪˈɡəʊʃieɪt/', 'To discuss something with someone in order to reach an agreement', 'We will negotiate with the suppliers for better prices.', 'Intermediate', '{"bargain","discuss","haggle"}', '{"refuse","reject"}', 7),
(1, 'Allocate', '/ˈæləkeɪt/', 'To distribute or assign something for a particular purpose', 'We need to allocate more budget to the marketing department.', 'Intermediate', '{"assign","distribute","provide"}', '{"withhold","retain"}', 8),
(1, 'Facilitate', '/fəˈsɪlɪteɪt/', 'To make something easier or help it to progress', 'Good communication facilitates teamwork and productivity.', 'Advanced', '{"enable","aid","promote"}', '{"hinder","obstruct"}', 9),
(1, 'Objective', '/əbˈdʒektɪv/', 'A goal or target that is aimed to be achieved', 'Our main objective is to increase market share by 20%.', 'Intermediate', '{"goal","aim","target"}', '{"subjective","bias"}', 10),
(1, 'Accrual', '/əˈkruːəl/', 'The accumulation or gathering of something over time', 'Interest accrual begins from the date of purchase.', 'Advanced', '{"accumulation","gathering","collection"}', '{"deduction","reduction"}', 11),
(1, 'Audit', '/ˈɔːdɪt/', 'An official examination of records and accounts', 'The company undergoes an annual audit by an external firm.', 'Intermediate', '{"examination","inspection","review"}', '{"ignore","overlook"}', 12),
(1, 'Benchmark', '/ˈbentʃmɑːrk/', 'A standard against which something can be measured', 'Our performance is measured against industry benchmarks.', 'Intermediate', '{"standard","reference","criterion"}', '{"anomaly","exception"}', 13),
(1, 'Contingency', '/kənˈtɪndʒənsi/', 'A possible event or circumstance that is not certain to happen', 'We have a contingency plan in case of system failure.', 'Advanced', '{"possibility","eventuality","chance"}', '{"certainty","assurance"}', 14),
(1, 'Delegate', '/ˈdelɪɡeɪt/', 'To assign responsibility or authority to another person', 'The manager will delegate tasks to team members.', 'Intermediate', '{"assign","entrust","authorize"}', '{"retain","hold"}', 15),
(1, 'Depreciation', '/dəˌpriːʃiˈeɪʃn/', 'A decrease in value of an asset over time', 'Vehicle depreciation is a significant business expense.', 'Advanced', '{"decline","decrease","reduction"}', '{"appreciation","increase"}', 16),
(1, 'Fiscal', '/ˈfɪskəl/', 'Related to government finances or money', 'The fiscal year ends on December 31st.', 'Intermediate', '{"financial","monetary","budget-related"}', '{"non-financial"}', 17),
(1, 'Leverage', '/ˈlevərɪdʒ/', 'To use something to maximum advantage', 'We can leverage our strengths to gain competitive advantage.', 'Intermediate', '{"use","utilize","exploit"}', '{"squander","waste"}', 18),
(1, 'Logistics', '/ləˈdʒɪstɪks/', 'The detailed organization of a complex operation', 'Supply chain logistics is crucial for timely delivery.', 'Intermediate', '{"organization","coordination","management"}', '{"chaos","disorder"}', 19),
(1, 'Optimize', '/ˈɒptɪmaɪz/', 'To make something as good as or as efficient as possible', 'We need to optimize our production processes.', 'Intermediate', '{"improve","enhance","refine"}', '{"worsen","deteriorate"}', 20);

-- Insert words for IELTS Academic (Course 2)  
INSERT INTO words (course_id, word, pronunciation, definition, example, difficulty, synonyms, antonyms, order_index) VALUES
(2, 'Elucidate', '/ɪˈluːsɪdeɪt/', 'To make something clearer by explanation', 'The professor will elucidate the complex theory in the next lecture.', 'Advanced', '{"clarify","explain","illuminate"}', '{"obscure","confuse"}', 1),
(2, 'Cogent', '/ˈkəʊdʒənt/', 'Clear, logical, and convincing', 'The argument presented was cogent and well-supported.', 'Advanced', '{"compelling","persuasive","convincing"}', '{"weak","unconvincing"}', 2),
(2, 'Ambiguous', '/æmˈbɪɡjuəs/', 'Open to more than one interpretation; unclear', 'The question was ambiguous and caused confusion among students.', 'Advanced', '{"unclear","vague","equivocal"}', '{"clear","unambiguous"}', 3),
(2, 'Mitigate', '/ˈmɪtɪɡeɪt/', 'To make something less severe or serious', 'Proper planning can mitigate the risks of project failure.', 'Advanced', '{"alleviate","reduce","lessen"}', '{"aggravate","worsen"}', 4),
(2, 'Paradigm', '/ˈpærədaɪm/', 'A typical example or pattern of something; a model', 'The scientific paradigm shifted after the new discovery.', 'Advanced', '{"example","model","framework"}', '{"exception"}', 5),
(2, 'Rhetoric', '/ˈretərɪk/', 'The art of effective or persuasive speaking and writing', 'Political rhetoric often contains emotional appeals.', 'Advanced', '{"eloquence","persuasion","oratory"}', '{"honesty","straightforwardness"}', 6),
(2, 'Empirical', '/ɪmˈpɪrɪkəl/', 'Based on observation, experience, or experiment rather than theory', 'The study provides empirical evidence for the hypothesis.', 'Advanced', '{"experimental","observable","factual"}', '{"theoretical","hypothetical"}', 7),
(2, 'Pertinent', '/ˈpɜːtɪnənt/', 'Relevant or applicable to a particular matter', 'The witness provided pertinent information to the investigation.', 'Advanced', '{"relevant","applicable","appropriate"}', '{"irrelevant","inappropriate"}', 8),
(2, 'Corroborate', '/kəˈrɒbəreɪt/', 'To confirm or give support to a statement or theory', 'The evidence will corroborate the defendant''s alibi.', 'Advanced', '{"confirm","support","verify"}', '{"contradict","refute"}', 9),
(2, 'Nuance', '/ˈnjuːɑːns/', 'A subtle difference or distinction in meaning, expression, or sound', 'The speaker captured the nuances of the complex issue.', 'Advanced', '{"subtlety","refinement","shade"}', '{"obviousness","crudeness"}', 10),
(2, 'Postulate', '/ˈpɒstʃuleɪt/', 'To suggest or assume something as a basis for reasoning', 'Einstein postulated that energy and mass are equivalent.', 'Advanced', '{"assume","propose","suggest"}', '{"prove","demonstrate"}', 11),
(2, 'Meticulous', '/məˈtɪkjələs/', 'Showing great attention to detail; very careful and precise', 'The researcher was meticulous in documenting every observation.', 'Advanced', '{"careful","precise","thorough"}', '{"careless","sloppy"}', 12),
(2, 'Validate', '/ˈvælɪdeɪt/', 'To prove or confirm the validity or accuracy of something', 'Further research is needed to validate the findings.', 'Advanced', '{"confirm","verify","authenticate"}', '{"invalidate","disprove"}', 13),
(2, 'Pedagogy', '/ˈpedəɡɑːdʒi/', 'The method and practice of teaching', 'Modern pedagogy emphasizes student-centered learning.', 'Advanced', '{"teaching","instruction","education"}', '{"learning"}', 14),
(2, 'Synthesis', '/ˈsɪnθəsɪs/', 'The combination of components or elements to form a whole', 'The synthesis of multiple theories provides new insights.', 'Advanced', '{"combination","fusion","integration"}', '{"analysis","separation"}', 15);

-- Insert words for Daily Conversation (Course 3)
INSERT INTO words (course_id, word, pronunciation, definition, example, difficulty, synonyms, antonyms, order_index) VALUES
(3, 'Hello', '/həˈləʊ/', 'A polite word used when greeting someone', 'Hello! How are you today?', 'Beginner', '{"hi","greetings","hey"}', '{"goodbye","farewell"}', 1),
(3, 'Thank you', '/θæŋk ˈjuː/', 'An expression of gratitude', 'Thank you for helping me with that.', 'Beginner', '{"thanks","appreciation","gratitude"}', '{"ingratitude","rudeness"}', 2),
(3, 'Excuse me', '/ɪkˈskjuːz mɪ/', 'A polite phrase used to get someone''s attention', 'Excuse me, could you help me please?', 'Beginner', '{"pardon me","sorry","attention"}', '{"ignore"}', 3),
(3, 'Please', '/pliːz/', 'A polite word used in requests', 'Could you please pass the salt?', 'Beginner', '{"kindly","would you mind"}', '{"rudely","demand"}', 4),
(3, 'Nice to meet you', '/naɪs tə miːt juː/', 'A polite greeting when meeting someone for the first time', 'Nice to meet you! I''m Sarah.', 'Beginner', '{"pleased to meet you","good to meet you"}', '{"unpleasant"}', 5),
(3, 'How are you?', '/haʊ ɑː juː/', 'A common greeting asking about someone''s well-being', 'How are you feeling today?', 'Beginner', '{"How do you do?","How are you doing?"}', '{}', 6),
(3, 'I don''t understand', '/aɪ dəʊnt ˌʌndəˈstænd/', 'Expression indicating confusion or lack of comprehension', 'I don''t understand this problem.', 'Beginner', '{"I''m confused","I can''t follow","unclear"}', '{"I understand","clear"}', 7),
(3, 'See you later', '/siː juː ˈleɪtə/', 'A casual way to say goodbye',  'See you later! Have a great day!', 'Beginner', '{"goodbye","take care","bye"}', '{"hello","see you now"}', 8),
(3, 'Good morning', '/ɡʊd ˈmɔːnɪŋ/', 'A polite greeting in the morning', 'Good morning! How are you?', 'Beginner', '{"morning","hi"}', '{"goodbye","night"}', 9),
(3, 'You''re welcome', '/jɔː ˈwelkəm/', 'A polite response to someone''s thanks', 'You''re welcome! Anytime!', 'Beginner', '{"glad to help","my pleasure","no problem"}', '{"rudely"}', 10);

-- Insert questions for TOEIC Vocabulary (Course 1)
INSERT INTO course_questions (course_id, word_id, question_text, question_type, correct_answer, options, explanation) VALUES
(1, 1, 'What does "collaborate" mean?', 'multiple_choice', 'To work jointly with others', '{"To work alone on a project","To work jointly with others","To compete against others","To avoid working with others"}', 'Collaborate means to work together with others on a common goal.'),
(1, 1, 'We need to _______ with the marketing team on this project.', 'fill_blank', 'collaborate', '{}', 'The verb "collaborate" fits perfectly in this context.'),
(1, 2, 'Which word is a synonym for "comprehensive"?', 'multiple_choice', 'thorough', '{"brief","thorough","vague","partial"}', 'Thorough and comprehensive both mean complete and covering all details.'),
(1, 2, 'The report provides a _______ analysis of market trends.', 'fill_blank', 'comprehensive', '{}', 'Comprehensive describes complete and thorough analysis.'),
(1, 3, 'What does "implement" mean in business?', 'multiple_choice', 'To put a plan into effect', '{"To plan something","To put a plan into effect","To propose an idea","To analyze a strategy"}', 'Implement means to execute or carry out a plan or decision.'),
(1, 3, 'The company will _______ new safety procedures next month.', 'fill_blank', 'implement', '{}', 'Implement is the correct verb to use for putting procedures into action.'),
(1, 4, 'Efficiency in the workplace can increase _______.', 'fill_blank', 'productivity', '{}', 'Efficiency results in higher productivity.'),
(1, 5, 'When you _______ tasks, you decide which ones are most important.', 'fill_blank', 'prioritize', '{}', 'Prioritize means to rank things by importance.'),
(1, 6, 'The company increased its _______ by 15% this quarter.', 'fill_blank', 'revenue', '{}', 'Revenue refers to income earned by a company.'),
(1, 7, 'We will _______ with suppliers to get better prices.', 'fill_blank', 'negotiate', '{}', 'Negotiate is used when discussing terms to reach an agreement.'),
(1, 8, 'The manager needs to _______ more budget to the marketing department.', 'fill_blank', 'allocate', '{}', 'Allocate means to distribute or assign resources for specific purposes.');

-- Insert questions for IELTS Academic (Course 2)
INSERT INTO course_questions (course_id, word_id, question_text, question_type, correct_answer, options, explanation) VALUES
(2, 1, 'The professor will _______ the complex theory in the next lecture.', 'fill_blank', 'elucidate', '{}', 'Elucidate means to make something clearer through explanation.'),
(2, 2, 'Which of the following is the closest meaning to "cogent"?', 'multiple_choice', 'Compelling and convincing', '{"Weak and unconvincing","Compelling and convincing","Confusing and unclear","Irrelevant and off-topic"}', 'Cogent means logically sound and persuasive.'),
(2, 3, 'The question was _______ and caused confusion among the students.', 'fill_blank', 'ambiguous', '{}', 'Ambiguous means unclear or open to multiple interpretations.'),
(2, 4, 'Proper planning can _______ the risks of project failure.', 'fill_blank', 'mitigate', '{}', 'Mitigate means to reduce or make less severe.'),
(2, 5, 'A scientific _______ is a broadly accepted model for solving problems.', 'fill_blank', 'paradigm', '{}', 'Paradigm refers to a typical example or pattern used in a field.'),
(2, 7, 'The study provides _______ evidence that supports the hypothesis.', 'fill_blank', 'empirical', '{}', 'Empirical evidence is based on observation and experimentation.'),
(2, 9, 'The documentary will _______ the eyewitness statements with video footage.', 'fill_blank', 'corroborate', '{}', 'Corroborate means to confirm or support with additional evidence.'),
(2, 10, 'Understanding the _______ of language is important for good communication.', 'fill_blank', 'nuance', '{}', 'Nuance refers to subtle differences or delicate shades of meaning.');

-- Insert questions for Daily Conversation (Course 3)
INSERT INTO course_questions (course_id, word_id, question_text, question_type, correct_answer, options, explanation) VALUES
(3, 1, 'Which is a proper greeting?', 'multiple_choice', 'Hello! How are you?', '{"Goodbye!","Hello! How are you?","See you later!","Excuse me!"}', 'Hello is a standard polite greeting.'),
(3, 2, 'How do you respond to someone who helped you?', 'multiple_choice', 'Thank you', '{"Excuse me","Hello","Thank you","See you"}', 'Thank you is the polite way to express gratitude.'),
(3, 3, 'Which phrase is used to get someone''s attention politely?', 'multiple_choice', 'Excuse me', '{"Hello","Nice to meet you","Excuse me","You''re welcome"}', 'Excuse me is commonly used to politely get someone''s attention.'),
(3, 4, 'What word do you add to make a request more polite?', 'multiple_choice', 'Please', '{"Thank you","Excuse me","Please","Hello"}', 'Adding please makes a request more courteous.'),
(3, 5, 'What do you say when meeting someone for the first time?', 'multiple_choice', 'Nice to meet you', '{"Goodbye","See you later","Nice to meet you","You''re welcome"}', 'Nice to meet you is a proper greeting for first meetings.'),
(3, 6, 'How should you respond when someone thanks you?', 'multiple_choice', 'You''re welcome', '{"Thank you","Please","Hello","Excuse me"}', 'You''re welcome is the polite response to gratitude.'),
(3, 10, 'Good morning is an appropriate greeting at what time?', 'multiple_choice', 'In the morning', '{"At night","In the afternoon","In the morning","In the evening"}', 'Good morning is used specifically in the morning hours.');
