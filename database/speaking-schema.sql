-- ============================================================================
-- SPEAKING PRACTICE SCHEMA
-- ============================================================================

-- Drop old tables if they exist (clean slate)
DROP TABLE IF EXISTS public.speaking_history CASCADE;
DROP TABLE IF EXISTS public.speaking_parts CASCADE;

-- Tạo bảng speaking_parts để lưu các phần thi nói
CREATE TABLE speaking_parts (
  id SERIAL PRIMARY KEY,
  part INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng speaking_history để lưu lịch sử bài tập nói
CREATE TABLE speaking_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  part TEXT,
  part_id INTEGER REFERENCES speaking_parts(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  overall_score NUMERIC(3,1),
  details JSONB, -- Chứa fluency, grammar, vocabulary, pronunciation scores
  general_suggestions TEXT[] DEFAULT '{}',
  mode INTEGER DEFAULT 0, -- 0: Practice, 1: Real Exam
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index cho hiệu suất
CREATE INDEX idx_speaking_history_user_id ON speaking_history(user_id);
CREATE INDEX idx_speaking_history_part_id ON speaking_history(part_id);
CREATE INDEX idx_speaking_history_created_at ON speaking_history(created_at);
CREATE INDEX idx_speaking_parts_part ON speaking_parts(part);

-- Enable RLS cho speaking_parts
ALTER TABLE speaking_parts ENABLE ROW LEVEL SECURITY;

-- RLS policies cho speaking_parts (public read, no write)
CREATE POLICY "Anyone can view speaking parts" ON speaking_parts
    FOR SELECT USING (true);

-- Enable RLS cho speaking_history
ALTER TABLE speaking_history ENABLE ROW LEVEL SECURITY;

-- RLS policies cho speaking_history (users can view/insert their own, admins can manage all)
CREATE POLICY "Users can view their own speaking history" ON speaking_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own speaking history" ON speaking_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own speaking history" ON speaking_history
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own speaking history" ON speaking_history
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger để auto update updated_at cho speaking_parts
CREATE TRIGGER update_speaking_parts_updated_at
    BEFORE UPDATE ON speaking_parts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger để auto update updated_at cho speaking_history
CREATE TRIGGER update_speaking_history_updated_at
    BEFORE UPDATE ON speaking_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert speaking parts (103 parts from speaking_parts_rows.sql)
INSERT INTO
    "public"."speaking_parts" ("id", "part", "title", "description", "questions")
VALUES
    (
        '1',
        '1',
        'Art',
        'Part 1 topic: Art',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Do you like art?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What type of art do you enjoy the most?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Have you ever tried creating art yourself?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How important do you think art is in today''s society?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think art is taught enough in schools?","speakTime":60}]'
    ),
    (
        '2',
        '1',
        'Birthday',
        'Part 1 topic: Birthday',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Do you usually celebrate your birthday?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How do you typically celebrate your birthday?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"What was your most memorable birthday celebration?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Is there a particular birthday that stands out in your memory? Why?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think birthdays are more important for children or for adults? Why?","speakTime":60}]'
    ),
    (
        '3',
        '2',
        'Cue Card: Family Member You Spend Most Time With',
        'Part 2 cue card focusing on describing a close family member and your relationship with them.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a family member that you spend most time with. You should say: Who this person is, What you like to do together, When you usually spend time together, And explain why you spend so much time with him/her.","speakTime":120}]'
    ),
    (
        '4',
        '2',
        'Cue Card: A Person Who You Think is Fashionable',
        'Part 2 cue card focusing on describing a person''s style and why you consider them fashionable.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a person who you think is fashionable. You should say: Who the person is, What kinds of clothes this person likes to wear, How you know the person, And explain why you think he/she is fashionable.","speakTime":120}]'
    ),
    (
        '5',
        '3',
        'Discussion: Art',
        'Part 3 discussion questions about art and its role in society.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How important do you think art is in our daily lives?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"Do you believe that everyone can appreciate and understand art in the same way?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In your opinion, should art education be mandatory in schools?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has the role of art in society changed over the years?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Can you discuss the impact of technology on traditional art forms?","speakTime":60}]'
    ),
    (
        '6',
        '3',
        'Discussion: Birthday',
        'Part 3 discussion questions about birthdays and cultural significance.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Do you think people''s attitudes towards celebrating birthdays have changed in recent years?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In your culture, what is the significance of milestone birthdays, such as turning 18 or 50?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How do you usually celebrate your own birthday and why?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Is it more important to give or receive gifts on birthdays, in your opinion?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think birthday celebrations will continue to be popular in the future?","speakTime":60}]'
    ),
    (
        '13',
        '1',
        'Introduction & Interview',
        'Answer general questions about yourself, your home, family, job, studies, and interests.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Can you tell me your full name?","speakTime":10},{"id":2,"audioUrl":"","prepTime":0,"question":"What shall I call you?","speakTime":10},{"id":3,"audioUrl":"","prepTime":0,"question":"Where are you from? And can you tell me about your family, hobbies?","speakTime":180}]'
    ),
    (
        '14',
        '2',
        'Individual Long Turn',
        'Speak for 1-2 minutes on a particular topic. You have 1 minute to prepare.',
        '[{"id":1,"audioUrl":"","prepTime":1,"question":"Describe a book you have recently read. You should say: what kind of book it is, who wrote it, what it is about, and explain why you enjoyed it.","speakTime":2}]'
    ),
    (
        '15',
        '3',
        'Two-way Discussion',
        'Discuss more abstract issues and concepts related to the topic in Part 2.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Do you think people read enough nowadays?","speakTime":150},{"id":2,"audioUrl":"","prepTime":0,"question":"How do you think reading habits will change in the future?","speakTime":150}]'
    ),
    (
        '16',
        '1',
        'Chocolate',
        'Simple personal questions about chocolate preferences and habits.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you like chocolate? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What is your favorite type of chocolate?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you eat chocolate?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Is chocolate popular in your country? Why do you think so?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think people should give chocolate as a gift? Why or why not?","speakTime":60}]'
    ),
    (
        '17',
        '1',
        'Family & Friends',
        'Basic personal questions about relationships with family and friends.',
        '[{"audioUrl":"","prepTime":0,"question":"Can you tell me about your family?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you spend time with your family?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What activities do you enjoy doing with your friends?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How important are friends to you?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"In your culture, what role do family and friends play in people''s lives?","speakTime":60}]'
    ),
    (
        '18',
        '1',
        'Geography',
        'Simple questions about geography, learning, and geographical interests.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy studying geography?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How important do you think geography is in today''s world?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any famous geographical landmarks in your country that you would recommend visiting?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What types of geographical features do you find most interesting?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How has technology affected the way people learn about geography today?","speakTime":60}]'
    ),
    (
        '19',
        '1',
        'Happiness',
        'Basic personal questions about happiness, daily life, and cultural views.',
        '[{"audioUrl":"","prepTime":0,"question":"What makes you happy in your daily life?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Can you describe a specific moment that made you really happy recently?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you think people can achieve happiness in their lives?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you believe that money is essential for happiness? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"In your culture, are there any specific traditions or celebrations associated with happiness?","speakTime":60}]'
    ),
    (
        '20',
        '1',
        'Housework and Cooking',
        'Basic personal questions about cooking habits and household responsibilities.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy cooking? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Who usually does the cooking in your family? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What is your favorite dish to cook, and why do you like it?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you help with household chores? Which ones do you prefer?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think it''s important for everyone to contribute to housework? Why or why not?","speakTime":60}]'
    ),
    (
        '21',
        '1',
        'Jewelry',
        'Simple personal questions about jewelry preferences, culture, and memorable items.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you like wearing jewelry? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What type of jewelry do people in your culture usually wear?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Is jewelry an important part of gift-giving in your country?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you prefer traditional or modern jewelry? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Can you recall a special piece of jewelry that you received as a gift?","speakTime":60}]'
    ),
    (
        '22',
        '1',
        'Keys',
        'Simple personal questions about keys and their significance in daily life.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you usually carry keys with you? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How many keys do you have on your keychain, and what are they for?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What''s the importance of keys in your daily life?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Have you ever lost your keys? How did you feel, and what did you do?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are keys more functional or symbolic to you? Why?","speakTime":60}]'
    ),
    (
        '23',
        '1',
        'Library',
        'Simple personal questions about libraries, reading habits, and their role in modern society.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you often visit libraries? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What kind of books do you like to read?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How important do you think libraries are in today''s digital age?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you prefer reading e-books or traditional books from a library? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do libraries contribute to the community?","speakTime":60}]'
    ),
    (
        '24',
        '1',
        'Morning time',
        'Personal questions about morning routines, habits, and productivity.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you usually wake up early in the morning? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you feel if you don''t get enough sleep and wake up early?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What morning routines do you have to start your day?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think mornings are more productive than evenings? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How has your morning routine changed over the years?","speakTime":60}]'
    ),
    (
        '25',
        '1',
        'Music',
        'Personal questions about music preferences, habits, and its role in life.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy listening to music? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What type of music do you like? Can you give examples?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you listen to music?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you play any musical instruments? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How important is music in your culture?","speakTime":60}]'
    ),
    (
        '26',
        '1',
        'Names',
        'Personal questions about names, meanings, and cultural traditions.',
        '[{"audioUrl":"","prepTime":0,"question":"Can you tell me about the meaning of your name?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are names important in your culture? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you like your name? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any traditional names in your country that are not so common today?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do people choose names for their children in your culture?","speakTime":60}]'
    ),
    (
        '27',
        '1',
        'Neighbor',
        'Personal questions about neighbors and community relationships.',
        '[{"audioUrl":"","prepTime":0,"question":"Can you describe your neighbors?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How well do you know your neighbors?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think it''s important to have a good relationship with your neighbors?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What activities do you usually do with your neighbors?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How would you help a neighbor in need?","speakTime":60}]'
    ),
    (
        '28',
        '1',
        'Noise',
        'Personal questions about noise, environment, and preferences.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you live in a noisy environment?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How does noise affect your daily life?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What kind of noise do you find most annoying?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any quiet places you like to go to?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think noise levels in cities will increase in the future?","speakTime":60}]'
    ),
    (
        '29',
        '1',
        'Outer space and stars',
        'Personal questions about stargazing, astronomy, and space exploration.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you often look at the night sky?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What do you enjoy most about stargazing?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Have you ever visited an observatory or a planetarium?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you feel about space exploration?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think space travel will become common in the future? Why or why not?","speakTime":60}]'
    ),
    (
        '30',
        '1',
        'Public transportation',
        'Personal questions about commuting habits, preferences, and improvements.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you often use public transportation?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What are the advantages of using public transportation?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How can public transportation be improved in your city or country?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you prefer buses or trains for commuting? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What changes would you like to see in public transportation?","speakTime":60}]'
    ),
    (
        '31',
        '1',
        'Puzzles',
        'Personal questions about puzzle habits, types, and cognitive benefits.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy solving puzzles? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What types of puzzles do you like the most?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you spend time doing puzzles?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think solving puzzles is a good way to exercise the brain?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Have you ever solved a challenging puzzle that you are proud of?","speakTime":60}]'
    ),
    (
        '32',
        '1',
        'Singing',
        'Personal questions about singing habits, preferences, and enjoyment.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy singing? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Who is your favorite singer or band? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you often sing in public or in private? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What type of music do you like to sing along to?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think singing is a good way to relax? Why or why not?","speakTime":60}]'
    ),
    (
        '33',
        '1',
        'Small Business',
        'Personal questions about local businesses, challenges, and entrepreneurship.',
        '[{"audioUrl":"","prepTime":0,"question":"Can you tell me about a small business in your local area?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think it is challenging to start a small business nowadays?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What types of small businesses are popular in your country?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How important are small businesses to the economy?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Have you ever considered starting your own small business? Why or why not?","speakTime":60}]'
    ),
    (
        '34',
        '1',
        'Snacks',
        'Personal questions about snacks, eating habits, and cultural foods.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy eating snacks? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What is your favorite type of snack?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"When do you usually eat snacks?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any traditional snacks in your country?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you choose your snacks?","speakTime":60}]'
    ),
    (
        '35',
        '1',
        'Social media',
        'Personal questions about social media habits, impact, and future trends.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you use social media regularly? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How has social media changed the way people communicate?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What are the advantages and disadvantages of using social media?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you think social media will evolve in the future?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Can social media negatively affect relationships? Why or why not?","speakTime":60}]'
    ),
    (
        '36',
        '1',
        'Staying up late',
        'Personal questions about late-night habits, routines, and consequences.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you usually stay up late at night? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you feel the next day if you stay up late?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What activities do you do when you stay up late?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any advantages to staying up late?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How does staying up late affect your daily routine?","speakTime":60}]'
    ),
    (
        '37',
        '1',
        'Technology',
        'Personal questions about digital devices, communication, and modern life.',
        '[{"audioUrl":"","prepTime":0,"question":"How often do you use technology in your daily life?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What technological devices do you use regularly?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How has technology changed communication?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there technological advancements you find challenging to keep up with?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"In what ways has technology improved your life?","speakTime":60}]'
    ),
    (
        '38',
        '1',
        'The area you live in',
        'Personal questions about neighborhood, lifestyle, and surroundings.',
        '[{"audioUrl":"","prepTime":0,"question":"Can you describe the area you live in?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What do you like the most about your neighborhood?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any changes you would like to see in your area?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How long have you been living there?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What facilities are available in your neighborhood?","speakTime":60}]'
    ),
    (
        '39',
        '1',
        'Tidy',
        'Personal questions about tidiness, habits, and organization.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you consider yourself a tidy person? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How do you keep your living space organized?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What benefits come from staying tidy?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Is it important in your culture to have a clean home?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What challenges do people face in maintaining tidiness?","speakTime":60}]'
    ),
    (
        '40',
        '1',
        'T-shirt',
        'Personal questions about clothing preferences, fashion, and shopping habits.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you often wear T-shirts?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What kind of T-shirts do you prefer to wear?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are T-shirts popular in your country?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you have any T-shirts with special designs or logos?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"When and where do you usually buy T-shirts?","speakTime":60}]'
    ),
    (
        '41',
        '1',
        'Watch',
        'Simple personal questions about watches, checking time habits, and their importance in modern life.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you wear a watch?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you check the time during the day?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What kind of watch do you prefer: digital or analog?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think watches are still important in the age of smartphones? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Have you ever received a watch as a gift? If yes, can you tell me about it?","speakTime":60}]'
    ),
    (
        '42',
        '1',
        'Weather',
        'Basic questions about weather preferences, seasonal effects, and climate changes.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you prefer hot or cold weather? Why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What is the typical weather like in your hometown?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How does the weather affect your daily activities?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What is your favorite season, and why?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you think the weather in your country has changed in recent years? How?","speakTime":60}]'
    ),
    (
        '43',
        '1',
        'Weekend',
        'Personal questions about weekend habits, activities, and routines.',
        '[{"audioUrl":"","prepTime":0,"question":"How do you usually spend your weekends?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What activities do you enjoy doing on weekends?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Is there a particular place you like to visit on weekends?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you prefer spending time with friends or family on weekends?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any special traditions or routines you follow during the weekends?","speakTime":60}]'
    ),
    (
        '44',
        '1',
        'Work and Study',
        'Questions about job, studies, interests, and challenges in daily work or school life.',
        '[{"audioUrl":"","prepTime":0,"question":"Can you tell me about your job or your studies?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What do you enjoy most about your work or studies?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How did you decide on your current job or course of study?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Are there any challenges you face in your job or studies?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you prefer working or studying? Why?","speakTime":60}]'
    ),
    (
        '45',
        '1',
        'Writing',
        'Simple personal questions about writing habits, preferences, and communication styles.',
        '[{"audioUrl":"","prepTime":0,"question":"Do you enjoy writing? Why or why not?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What type of writing do you find most challenging?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"How often do you write in your daily life?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"What types of written communication are important in your country?","speakTime":60},{"audioUrl":"","prepTime":0,"question":"Do you prefer writing by hand or typing? Why?","speakTime":60}]'
    ),
    (
        '46',
        '2',
        'Cue Card: A Project You Worked On',
        'Part 2 cue card focusing on describing an academic or work-related project and your involvement in it.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a project you worked on in your school/college or office.\\nYou should say:\\n\\nWhat the project was\\nWho else was involved in it\\nHow long it took to be completed\\nAnd explain what you learned from the project.","speakTime":120}]'
    ),
    (
        '47',
        '2',
        'Cue Card: A Person You Admire',
        'Part 2 cue card focusing on describing a person you respect or look up to.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a person you admire.\\nYou should say:\\n\\nWho the person is\\nWhat he or she is like\\nAnd why you admire him or her","speakTime":120}]'
    ),
    (
        '48',
        '2',
        'Cue Card: A Famous Person You Like',
        'Part 2 cue card describing a well-known person you particularly like.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a famous person that you like.\\nYou should say:\\n\\nWho the person is\\nWhy he is famous\\nWhat makes you mention specifically him/her","speakTime":120}]'
    ),
    (
        '49',
        '2',
        'Cue Card: A Characteristic of Yours',
        'Part 2 cue card describing a personality trait or characteristic you possess.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a character or personality of yours.\\nYou should say:\\n\\nWhat it is\\nIs it a common characteristic\\nHow it is helpful to you and explain why it is important to you","speakTime":120}]'
    ),
    (
        '50',
        '2',
        'Cue Card: An Enjoyable Meal on a Special Occasion',
        'Part 2 cue card about a memorable meal you had on a special occasion.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a special occasion when you had a really enjoyable meal.\\nYou should say:\\n\\nWhat the occasion was\\nWho was at the meal\\nWhat you ate\\nAnd explain why the meal was so enjoyable","speakTime":120}]'
    ),
    (
        '51',
        '2',
        'Cue Card: Embarrassing Food Experience',
        'Part 2 cue card about an embarrassing moment related to food.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe an embarrassing experience you have had with food.\\nYou should say:\\n\\nWhere you were\\nWhat happened\\nHow you felt afterwards\\nAnd what other people thought about this event.","speakTime":120}]'
    ),
    (
        '52',
        '2',
        'Cue Card: A Time You Made a Mistake',
        'Part 2 cue card describing a mistake you made and how you handled it.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a time you made a mistake and how you dealt with it.\\nYou should say:\\n\\nWhat the mistake was\\nWhen, where you made it\\nAnd explain how you dealt with it","speakTime":120}]'
    ),
    (
        '53',
        '2',
        'Cue Card: A Restaurant You Enjoyed',
        'Part 2 cue card describing a restaurant you enjoyed going to.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a restaurant you enjoyed going to.\\nYou should say:\\n\\nWhere the restaurant was\\nWho you went with\\nWhat type of food you ate in this restaurant\\nAnd explain why you thought the restaurant was good","speakTime":120}]'
    ),
    (
        '54',
        '2',
        'Cue Card: A Health Problem',
        'Part 2 cue card describing a health issue experienced by you or someone close.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a health problem you or someone you know had.\\nYou should say:\\n\\nWhat it was\\nHow you had this health problem\\nWhat you or this person had to do to get better\\nAnd discuss how you/this person felt about this health problem","speakTime":120}]'
    ),
    (
        '55',
        '2',
        'Cue Card: A TV Program You Like',
        'Part 2 cue card about a TV program you enjoy watching.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a TV program you would like to watch.\\nYou should say:\\n\\nWhat program it is\\nWhat the program is about\\nHow often and when you watch it\\nAnd explain why you like watching this program","speakTime":120}]'
    ),
    (
        '56',
        '2',
        'Cue Card: Article About Healthy Lifestyle',
        'Part 2 cue card describing an article about healthy living.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe an article that you read from a magazine or from the Internet about healthy lifestyle.\\nYou should say:\\n\\nWhen you read it\\nWhere you read it\\nWhat it is about\\nAnd if you agree with the opinions in the article","speakTime":120}]'
    ),
    (
        '57',
        '2',
        'Cue Card: Unforgettable Advertisement',
        'Part 2 cue card about a memorable advertisement.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe an unforgettable advertisement that you saw.\\nYou should say:\\n\\nWhere you saw it\\nWhat kind of advertisement it was\\nWhat product/service was advertised\\nAnd say how you felt when you saw it","speakTime":120}]'
    ),
    (
        '58',
        '2',
        'Cue Card: A Surprising Meeting',
        'Part 2 cue card describing a surprising encounter with a friend.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a time you were surprised to meet a friend.\\nYou should say:\\n\\nWhen this happened\\nWho this person was\\nWhat you did together on that day\\nAnd explain why you thought it was a surprise to meet this person","speakTime":120}]'
    ),
    (
        '59',
        '2',
        'Cue Card: Educational TV Program',
        'Part 2 cue card about an educational TV program.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe an educational TV program that you have seen.\\nYou should say:\\n\\nWhat this educational TV program is about\\nHow often you watch or listen to this program\\nHow it influences people\\nAnd explain why this program is educational","speakTime":120}]'
    ),
    (
        '60',
        '2',
        'Cue Card: A Short Trip You Dislike',
        'Part 2 cue card describing a short but frequent trip you do not enjoy.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a short trip that you frequently make (or take) but dislike.\\nYou should say:\\n\\nWhere you travel from and to\\nHow often you make this trip\\nWhy you make this trip\\nAnd explain why you dislike this trip","speakTime":120}]'
    ),
    (
        '61',
        '2',
        'Cue Card: A Garden or Park You Enjoyed',
        'Part 2 cue card about a garden or park you liked visiting.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a garden or park you enjoyed visiting.\\nYou should say:\\n\\nWhere it was\\nWhat it looked like\\nWhat you did there or what people did there\\nAnd explain why you liked it","speakTime":120}]'
    ),
    (
        '62',
        '2',
        'Cue Card: Dream House/Apartment',
        'Part 2 cue card describing a house or apartment you want to live in.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a house or an apartment you would like to live in.\\nYou should say:\\n\\nWhat kind of accommodation it would be\\nWhere it would be\\nWho would live there with you\\nAnd say why you would enjoy living in this place","speakTime":120}]'
    ),
    (
        '63',
        '2',
        'Cue Card: A Place for Reading or Writing',
        'Part 2 cue card about a place outside your home where you read or write.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a place where you can read or write (not your home).\\nYou should say:\\n\\nWhere the place is\\nWhat it looks like\\nWhat you do there\\nAnd explain why you like this place","speakTime":120}]'
    ),
    (
        '64',
        '2',
        'Cue Card: A Garden/Park You Often Visit',
        'Part 2 cue card describing a park or garden you frequently go to.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a garden or park you often go to.\\nYou should say:\\n\\nWhere it is\\nHow it looks like\\nWhat people do there\\nAnd explain why you often go there","speakTime":120}]'
    ),
    (
        '65',
        '2',
        'Cue Card: A Place to Relax',
        'Part 2 cue card about a relaxing place outside your home.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a place that can be good to relax (not your home).\\nYou should say:\\n\\nWhere it is\\nHow it looks like\\nWhat people do there\\nAnd explain why you often go there","speakTime":120}]'
    ),
    (
        '66',
        '2',
        'Cue Card: A Historical Building',
        'Part 2 cue card describing a historical building in your city or country.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a historical building in your country or hometown.\\nYou should say:\\n\\nWhere it is\\nWhat it is used for\\nWhat it looks like\\nAnd explain why it is important to your hometown/country","speakTime":120}]'
    ),
    (
        '67',
        '2',
        'Cue Card: Short-term Job Abroad',
        'Part 2 cue card about a short-term job you would like to do in another country.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a short-term job you’d like to do in a foreign country.\\nYou should say:\\n\\nWhat type of work you would like to do there\\nWhat country you’d like to work in\\nWhy you would like to work in this country","speakTime":120}]'
    ),
    (
        '68',
        '2',
        'Cue Card: A Prize You Want to Win',
        'Part 2 cue card describing a prize you want to achieve.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a prize that you want to win.\\nYou should say:\\n\\nWhat the prize is\\nWhat you need to do to get it\\nHow you know about it\\nWhy you want it","speakTime":120}]'
    ),
    (
        '69',
        '2',
        'Cue Card: A Family You Like',
        'Part 2 cue card describing a family you admire (not your own).',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a family (not your own) that you like.\\nYou should say:\\n\\nWhose family this is\\nWhere they live\\nWho the family members are\\nWhy you like this family","speakTime":120}]'
    ),
    (
        '70',
        '2',
        'Cue Card: Area of Science You Find Interesting',
        'Part 2 cue card describing a field of science you are interested in.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe an area of science that interests you.\\nYou should say:\\n\\nWhat science it is\\nHow you got interested in it\\nHow you learn this science\\nWhy this science is interesting to you","speakTime":120}]'
    ),
    (
        '71',
        '2',
        'Cue Card: A Good Decision You Made Recently',
        'Part 2 cue card about a recent good decision you made.',
        '[{"id":1,"audioUrl":"","prepTime":60,"question":"Describe a good decision you made recently.\\nYou should say:\\n\\nWhat the decision was and how you made it\\nWhen you made it\\nWhy it was a good decision\\nHow you felt about it","speakTime":120}]'
    ),
    (
        '72',
        '3',
        'Discussion: Chocolate',
        'Part 3 discussion questions about chocolate and its popularity, consumption, and cultural aspects.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Why do you think chocolate is a popular gift for various occasions?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways has the popularity of chocolate changed over the years?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How do people''s preferences for types of chocolate vary across different age groups?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Do you think there are any health concerns associated with consuming too much chocolate?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How important is the packaging of chocolate when it comes to choosing a brand?","speakTime":60}]'
    ),
    (
        '73',
        '3',
        'Discussion: Family & Friends',
        'Part 3 discussion questions about family and friends, social roles, and relationships.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How has the concept of family evolved in your society over the years?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways do friends play a significant role in people''s lives?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"What qualities do you think are important in maintaining a strong family bond?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How do cultural differences influence the way people maintain friendships?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think people today prioritize friendships over family relationships?","speakTime":60}]'
    ),
    (
        '74',
        '3',
        'Discussion: Geography',
        'Part 3 discussion questions about geography and its impact on society, culture, and economy.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How has technology influenced the way people learn about geography?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways does geography impact the economy of a country?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you believe that studying geography is essential for understanding global issues?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has globalization affected people''s perceptions of geography?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In your opinion, what role does geography play in shaping cultural identities?","speakTime":60}]'
    ),
    (
        '75',
        '3',
        'Discussion: Happy',
        'Part 3 discussion questions about happiness, well-being, and cultural influences on life satisfaction.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What do you think is the key to a happy life?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How does culture influence the pursuit of happiness in different societies?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you believe that material possessions contribute to happiness?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"In what ways can individuals create their own happiness?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How has the definition of happiness changed over the past few decades in your opinion?","speakTime":60}]'
    ),
    (
        '76',
        '3',
        'Discussion: Home and Accommodation',
        'Part 3 discussion questions about living spaces, housing preferences, and modern home design.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How important is it for people to have a comfortable and well-decorated home?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In your culture, what factors do people consider when choosing a place to live?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How have housing preferences changed over the past few decades in your country?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"What role does technology play in modern home design and accommodation?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think living in a big city or a rural area has more advantages when it comes to housing?","speakTime":60}]'
    ),
    (
        '77',
        '3',
        'Discussion: Hometown',
        'Part 3 discussion questions about hometowns, local culture, tourism, and community life.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How has your hometown changed over the years?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways does your hometown attract tourists or visitors?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"What are the major industries or economic activities in your hometown?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How do people in your hometown typically spend their leisure time?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think your hometown is a good place for young people to live and work?","speakTime":60}]'
    ),
    (
        '78',
        '3',
        'Discussion: Housework and Cooking',
        'Part 3 discussion questions about housework, cooking, gender roles, and technology in daily life.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How do gender roles influence the division of housework in your culture?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What are the benefits of teaching children to do household chores?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In your opinion, what is the importance of home-cooked meals compared to eating out?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How have cooking habits changed in your country over the past few decades?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think technology has made housework and cooking easier or more complicated?","speakTime":60}]'
    ),
    (
        '79',
        '3',
        'Discussion: Jewelry',
        'Part 3 discussion questions about jewelry, cultural significance, and personal preferences.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What role does jewelry play in your culture or society?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How have preferences for jewelry changed over the years in your country?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think people should spend a lot of money on jewelry? Why or why not?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"What is the significance of giving and receiving jewelry as a gift in your culture?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How does the choice of jewelry reflect someone''s personality or status?","speakTime":60}]'
    ),
    (
        '80',
        '3',
        'Discussion: Keys',
        'Part 3 discussion questions about keys, their functions, and cultural symbolism.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What are the different reasons people might carry a lot of keys with them?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How have the uses of keys changed with advancements in technology?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In your opinion, what is the significance of having a spare set of keys?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How do people in your culture usually celebrate getting the keys to a new home?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Can you think of any symbolic meanings associated with keys in your society?","speakTime":60}]'
    ),
    (
        '81',
        '3',
        'Discussion: Library',
        'Part 3 discussion questions about libraries, reading habits, and their importance in society.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How have libraries changed over the years, and how do you think they will evolve in the future?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways can libraries benefit the community besides providing books?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you prefer reading e-books or traditional printed books? Why?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How important is it for children to visit libraries regularly?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Should governments invest more in building and maintaining libraries?","speakTime":60}]'
    ),
    (
        '82',
        '3',
        'Discussion: Morning Time',
        'Part 3 discussion questions about morning routines, productivity, and cultural practices.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How do you typically spend your mornings?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What impact can a good morning routine have on a person''s day?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think the morning hours are more productive than the rest of the day? Why or why not?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"In your culture, are there any specific morning rituals or traditions?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How does the way people spend their mornings differ in urban and rural areas?","speakTime":60}]'
    ),
    (
        '83',
        '3',
        'Discussion: Music',
        'Part 3 discussion questions about music, its role in culture, and its influence on people.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How does music influence culture and society?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"Do you think learning to play a musical instrument is important for children?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How has technology changed the way we listen to music in recent years?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Are there any traditional music styles from your country that you particularly enjoy?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think live music events are more enjoyable than listening to recorded music?","speakTime":60}]'
    ),
    (
        '84',
        '3',
        'Discussion: Names',
        'Part 3 discussion questions about names, their cultural importance, and naming trends.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What factors do parents in your culture consider when choosing names for their children?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"Do you think names have an impact on a person''s personality or behavior?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How have naming trends changed over the years in your country?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Are there any traditional or cultural naming ceremonies in your society?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"What is your opinion on people changing their names legally?","speakTime":60}]'
    ),
    (
        '85',
        '3',
        'Discussion: Neighbor',
        'Part 3 discussion questions about neighbors, community, and social interaction.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How important is it to have a good relationship with your neighbors?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways can neighbors support each other in a community?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"What are some common challenges people face in terms of neighbor relationships?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has the concept of being a good neighbor evolved with urbanization?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Are there any cultural differences in how neighbors interact in your country?","speakTime":60}]'
    ),
    (
        '86',
        '3',
        'Discussion: Noise',
        'Part 3 discussion questions about noise, pollution, and its impact on society.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How does noise pollution affect people''s well-being in urban areas?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What measures do you think governments should take to control noise pollution?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In what situations is noise acceptable, and when does it become a problem?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How do people in your culture typically react to noisy neighbors?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Can noise have a positive impact, such as in certain types of music or events?","speakTime":60}]'
    ),
    (
        '87',
        '3',
        'Discussion: Outer Space and Stars',
        'Part 3 discussion questions about space exploration, astronomy, and scientific advancements.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How do you think space exploration benefits our daily lives on Earth?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways can the study of stars and galaxies contribute to scientific advancements?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think space tourism will become a common activity in the future? Why or why not?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How might knowledge about outer space influence our environmental consciousness on Earth?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Should governments invest more in space exploration or focus on solving issues on our planet first? Why?","speakTime":60}]'
    ),
    (
        '88',
        '3',
        'Discussion: Public Transportation',
        'Part 3 discussion questions about public transportation, urban planning, and societal impact.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What are the advantages and disadvantages of using public transportation compared to private vehicles?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How can cities encourage more people to use public transportation instead of personal cars?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In what ways does efficient public transportation contribute to a city''s overall development?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Should public transportation be free of charge? Why or why not?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How can public transportation infrastructure be improved to make it more appealing to the public?","speakTime":60}]'
    ),
    (
        '89',
        '3',
        'Discussion: Puzzles',
        'Part 3 discussion questions about puzzles, cognitive skills, and educational value.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What cognitive skills do people develop by solving puzzles regularly?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"Do you think puzzles are more beneficial for children or adults? Why?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How can solving puzzles contribute to a person''s problem-solving abilities in real-life situations?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Do you believe puzzles are effective tools for stress relief? Why or why not?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In what ways can puzzles be integrated into educational curricula to enhance learning?","speakTime":60}]'
    ),
    (
        '90',
        '3',
        'Discussion: Singing',
        'Part 3 discussion questions about singing, self-expression, and cultural significance.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Why do you think singing is a popular form of self-expression?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How can singing positively impact a person''s mental well-being?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In what cultural contexts is singing particularly important or significant?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Should singing be taught as a mandatory subject in schools? Why or why not?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How has technology, such as karaoke and music streaming, influenced the way people engage with singing?","speakTime":60}]'
    ),
    (
        '91',
        '3',
        'Discussion: Small Business',
        'Part 3 discussion questions about small businesses, entrepreneurship, and economic impact.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What are the challenges that small businesses often face in comparison to larger corporations?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How can communities benefit from the presence of small businesses?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In what ways do small businesses contribute to job creation and economic growth?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Should governments provide more support and incentives for the development of small businesses? Why or why not?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"What skills do you think are crucial for individuals wanting to start and run a successful small business?","speakTime":60}]'
    ),
    (
        '92',
        '3',
        'Discussion: Snacks',
        'Part 3 discussion questions about snacks, eating habits, and cultural influence.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How have eating habits regarding snacks changed in your country over the years?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"Do you think the trend towards healthier snacks is a positive development? Why or why not?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"What role do snacks play in social gatherings and parties in your culture?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has globalization influenced the variety of snacks available in your country?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In what ways can the availability of snacks impact people''s health?","speakTime":60}]'
    ),
    (
        '93',
        '3',
        'Discussion: Social Media',
        'Part 3 discussion questions about social media, communication, and its societal effects.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How has social media influenced communication patterns in society?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What are the positive and negative effects of using social media for personal relationships?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think social media platforms have a responsibility to regulate content? Why or why not?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has the rise of social media affected traditional forms of media, such as newspapers and television?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Can excessive use of social media have an impact on mental health? In what ways?","speakTime":60}]'
    ),
    (
        '94',
        '3',
        'Discussion: Staying Up Late',
        'Part 3 discussion questions about sleep habits, productivity, and lifestyle.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What are some reasons people choose to stay up late, and how does it affect their daily lives?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How does staying up late compare to waking up early in terms of productivity and energy levels?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think the working hours of businesses should be more flexible to accommodate night owls?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"In what ways can staying up late affect one''s health, both physically and mentally?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How do cultural attitudes towards staying up late vary across different countries?","speakTime":60}]'
    ),
    (
        '95',
        '3',
        'Discussion: Technology',
        'Part 3 discussion questions about technology, innovation, and societal impact.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How has technology changed the way people work and communicate in recent years?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what areas of life do you think technology has had the most significant impact?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Are there any drawbacks to the rapid advancement of technology? Explain.","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How can governments encourage the responsible use of technology among their citizens?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think there will be a point where technology becomes too advanced for society to handle?","speakTime":60}]'
    ),
    (
        '96',
        '3',
        'Discussion: The Area You Live In',
        'Part 3 discussion questions about local environment, community, and lifestyle.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"What are the key features that make your neighborhood unique or special?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How has the development of infrastructure influenced the quality of life in your area?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"What changes would you like to see in your community to make it a better place to live?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How do people in your area typically spend their leisure time or engage in community activities?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In what ways has the environment or climate in your area impacted the lifestyle of its residents?","speakTime":60}]'
    ),
    (
        '97',
        '3',
        'Discussion: Tidy',
        'Part 3 discussion questions about cleanliness, organization, and personal habits.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How important is it for people to keep their living spaces tidy and organized?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In what ways can maintaining a tidy environment contribute to one''s mental well-being?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How do cultural differences influence perceptions of cleanliness and tidiness?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Can the design of living spaces affect how easy it is to keep them tidy?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"What are some effective strategies for encouraging children to be tidy and organized?","speakTime":60}]'
    ),
    (
        '98',
        '3',
        'Discussion: T-shirt',
        'Part 3 discussion questions about T-shirts, fashion, and cultural expression.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How do you think fashion trends influence the choice of T-shirts people wear?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In your culture, what significance do T-shirts have in terms of expressing individuality?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think people are willing to spend a lot on designer T-shirts? Why or why not?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has the design and style of T-shirts changed over the years?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In what ways can T-shirts be used to promote a message or cause?","speakTime":60}]'
    ),
    (
        '99',
        '3',
        'Discussion: Watch',
        'Part 3 discussion questions about watches, time management, and personal preferences.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"Why do you think people still wear traditional watches when they can easily check the time on their phones?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What factors do you think influence someone''s choice when buying a watch?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In your opinion, are watches more of a fashion accessory or a practical tool today?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How have watches evolved in terms of design and features over the years?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"Do you think the popularity of smartwatches will eventually replace traditional watches?","speakTime":60}]'
    ),
    (
        '100',
        '3',
        'Discussion: Weather',
        'Part 3 discussion questions about weather, climate, and impact on daily life.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How does the weather affect people''s daily activities and moods?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In your opinion, do you think extreme weather conditions are becoming more common? Why or why not?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How do people in your country typically prepare for different seasons and weather changes?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"What impact does the weather have on industries such as agriculture and tourism?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In what ways can the weather influence fashion trends and clothing choices?","speakTime":60}]'
    ),
    (
        '101',
        '3',
        'Discussion: Weekend',
        'Part 3 discussion questions about weekends, leisure activities, and work-life balance.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How do people in your culture usually spend their weekends?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"In your opinion, is it better to have a busy or a relaxing weekend? Why?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"How have your weekend activities changed over the years?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"Do you think it''s important for people to have a good work-life balance during the weekend?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How might weekends differ in terms of activities between urban and rural areas?","speakTime":60}]'
    ),
    (
        '102',
        '3',
        'Discussion: Work and Studies',
        'Part 3 discussion questions about work, study, and work-life balance.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"How do you think the role of work has changed in recent years?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"What factors do you believe contribute to a successful balance between work and personal life?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"In your opinion, how important is work-life balance for overall well-being?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How do cultural attitudes towards work and studies differ in various parts of the world?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"How can employers and educators encourage a positive work and study environment?","speakTime":60}]'
    ),
    (
        '103',
        '3',
        'Discussion: Writing',
        'Part 3 discussion questions about writing, communication, and literacy.',
        '[{"id":1,"audioUrl":"","prepTime":0,"question":"In what ways has technology influenced the way people write today?","speakTime":60},{"id":2,"audioUrl":"","prepTime":0,"question":"How important is good writing in today''s professional world?","speakTime":60},{"id":3,"audioUrl":"","prepTime":0,"question":"Do you think schools should focus more on teaching handwriting or typing skills? Why?","speakTime":60},{"id":4,"audioUrl":"","prepTime":0,"question":"How has the popularity of social media affected formal writing skills?","speakTime":60},{"id":5,"audioUrl":"","prepTime":0,"question":"In your culture, what is the significance of handwritten letters compared to electronic communication?","speakTime":60}]'
    );