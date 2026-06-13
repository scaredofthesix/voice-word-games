# Customer Meeting Transcript - Team 40 x Customer

**Date:** 2026-06-13

> Sanitized English transcript published with the customer's permission. Real names are replaced with role labels (Team / Customer); no personally identifying information or confidential business information is included. Cleaned for readability without changing meaning. The recording with timestamps is shared privately with the course instructors via Moodle.

---

**Team:** Before we start, is it okay if we record this meeting? We also want to confirm you are okay with this sanitized transcript being shared with the instructors and published in the repository.

**Customer:** Sure, go ahead.

**Team:** We wrote 13 user stories across three roles: the child who plays, the parent who sets it up, and the teacher who might use it in class. The core of the product is that voice is the only controller, because kids skip pronunciation whenever there's another way to complete the action. I'll read through these stories now.

**Team:** Maybe we read them together?

**Team:** Sure, let me open it. You can see all must-have user stories right here. We have three categories of users: child learner, parent, and teacher. A teacher can use our game after class, for example.

**Customer:** Got it.

**Team:** First must-have: as a child learner, I want to open the app and start playing from a simple home screen - begin the game quickly without adult assistance.

**Customer:** Why do we need these as two separate stories?

**Team:** "Quickly without help" and "simple home screen" are related but distinct: all text must be child-friendly, and the home screen is the entry point to the whole experience - the first screen in the prototype.

**Team:** We can show our Figma prototype later to illustrate how we envision this.

**Customer:** Both seem to be about interface convenience.

**Team:** Right. Second story: as a child learner, I want to pick a game from a small selection screen so that I can play the game I find most fun. We plan to have 10 games total.

**Customer:** For MVP v1, the primary playable games are Voice Racer and Voice Bubble Popper.

**Team:** We created a prototype for MVP v0 covering both - we'll demo it shortly. The selection screen is a distinct interface in the prototype.

**Customer:** What does "distinct interface" mean here?

**Team:** It means a separate screen dedicated to game selection - I'll show it during the demo.

**Customer:** "See the target word clearly - as a child learner, with a picture if possible, so that I know what to say." Did we include pictures in the spec?

**Team:** No.

**Customer:** What's the use case then?

**Team:** No pictures required - maybe emojis. But this is not a must-have.

**Customer:** Optional then.

**Team:** Yes. Though it wouldn't be hard to add.

**Customer:** Fair enough. So: display the word in a readable font size, large enough not to obscure the gameplay. Optional supporting image or icon. Listed as an element of the main game screen - it can be a button or a game element. Next: "Pronounce the word to trigger the in-game action." As a child learner, I must correctly pronounce the target word to make the game react - for example, steer the car - so that voice is the primary means of control.

**Team:** This means something like a visual indicator or sound effect confirming the word was recognized correctly.

**Customer:** That will be clearer during the prototype demonstration.

**Team:** Yes, exactly.

**Customer:** Core gameplay loop uses Web Speech API. Open question: voice matching tolerance - too strict will frustrate young learners. Next: "Grant microphone access easily." The parent, on behalf of the child, needs clear guidance if microphone access is denied, so the game can hear the child. This covers the mic permission and mic denied states. Will this require a public server?

**Team:** No, local storage on the Innopolis VM should be sufficient.

**Customer:** "Get immediate feedback on each attempt." The child learner wants clear, immediate feedback on whether their pronunciation was correct, so they learn from each attempt and stay motivated.

**Team:** Is this about the end-of-game screen? Like after losing, they see how many points they got?

**Team:** In our demo, we show a list of words the child said correctly or incorrectly, so they can see what needs more practice.

**Customer:** So it's at the end of the game - every play is one attempt.

**Team:** Correct.

**Customer:** This might actually be a should-have. A child is more interested in progressing through the game than reviewing word-level statistics - though if implemented, it's a nice addition. Next: "See my results at the end of a round." Is this the same thing?

**Team:** No, they're different. The feedback story is about individual word pronunciation - for example, "cat: correct, rocket: incorrect." The results story is about the game score: how many points the child earned and how well they played.

**Customer:** So one is about the game and one is about the words.

**Team:** Exactly. At the end they'd see their score, their best score, and a replay button.

**Customer:** You're using "attempt" and "round" interchangeably - pick one and use it consistently throughout.

**Team:** We'll fix that. On a related point - can you clarify this scenario: if a child is trying to say "rocket" but on the first attempt says "roc, roc", the game should detect the intent and allow a retry. Maybe an AI voice says "Try again - the word sounds like this."

**Customer:** Worth thinking about. In my Doodle Jump prototype, I didn't fully trust the speech recognition engine, so the child could pronounce a word multiple times until it was recognized. It might fail on the first attempt but succeed on the second. This became a must-have: the child should not lose because the speech engine failed to recognize a word. We can't fully control recognition quality, so the game design must account for it. Let the child pronounce a word multiple times until they succeed. If a hazard in the game hits the character, that's fine - but if the hazard is far away, the child should have more time and more attempts. It's not a must-have to tell the child to pronounce the word differently, but it is a must-have to allow multiple attempts. Otherwise they'll lose quickly, get frustrated, and stop playing.

**Team:** We could handle this with a word selection algorithm - maintain a per-player statistics database and surface words the child struggles with more frequently.

**Customer:** Exactly. Every time a word needs to be shown, prioritize the one the child struggles with most. This is essentially spaced repetition without time constraints - heuristics for word selection.

**Team:** "Retry a word I got wrong." And "Hear how the word should sound." The child learner wants to hear a model pronunciation of the target word so they can imitate it correctly.

**Team:** Should this be a must-have?

**Customer:** Yes - click a word to hear its pronunciation. This is a must-have. Next: "Review my child's progress." As a parent, I want to see which words my child has practiced and how they performed so I can support their learning. This is a could-have for now - it matters if we want to evaluate the effectiveness of the approach, but let's deprioritize it. We can revisit if the project moves quickly. "Create a custom word list." As a teacher, I want to define a custom list of words for the games so that practice matches the current lesson vocabulary. This is more of a must-have, because teachers need to upload lesson-specific vocabulary for their students to practice.

**Team:** That matches exactly what we had in mind.

**Customer:** "Set difficulty level." As a parent, I want to choose a difficulty level, word length, and speed so that the challenge fits my child's age and ability. This is connected to the word list feature - choosing a list that matches the child's language level. "Play on any browser."

**Team:** That's a must-have. We also removed multiplayer - it's out of scope.

**Customer:** Overkill at this stage. Now, the MVP v0 minimum user stories: start a game from the home screen, choose which word game to play, pronounce a word to trigger the in-game action, get immediate feedback on each attempt, see results at the end of a round. You mentioned two games - can you show them?

**Team:** We have two games ready. We could also combine the feedback and results stories into one.

**Customer:** No - the terminology should be consistent, but they are distinct stories as you explained. Are both must-haves?

**Customer:** The results/feedback story is a should-have. Children are primarily interested in progressing in the game, not statistics - that's mostly for parents. But showing game points - is that a must-have?

**Team:** I think it is.

**Customer:** In Doodle Jump, the game ended and showed the final score at the top of the screen, then you could restart. Something that simple could work - no separate statistics screen needed. Showing how many words were correctly pronounced might actually motivate children, and could be combined with the score. You can think about the exact layout later. For the minimum viable product, let's remove this - it's a should-have.

**Team:** I'd still suggest combining them and including them in MVP v1.

**Customer:** Let's think about it. We should probably also add a dedicated section in the main menu where parents can view the child's progress. Let's make it a must-have, but not in MVP v1 - tracking child progress belongs in a later milestone.

**Team:** An additional section on the home screen for parents?

**Customer:** Yes. And for the word pool: don't treat word lists as independent silos. Pool all words together and track progress per individual word, not per list. If two lists share the word "apple" and the child encountered it three times across all games, the progress for "apple" is three - regardless of which list it came from.

**Team:** So what distinguishes the word groups - colors, animals, etc. - if we have four of them?

**Team:** We could show statistics per word group as a percentage of correct pronunciations for each word.

**Customer:** That works for display. But the underlying data must come from a single source of truth - track all words across all lists and all games. If "apple" appears in game one and game two, sum all encounters. Show how many times the child saw each word and how many times they pronounced it correctly. Don't track statistics independently per game when the same word groups are shared.

**Team:** As mentioned, a teacher may upload a custom word list for a lesson - a new list independent from the built-in categories like space or animals. But you shouldn't discard the progress the child accumulated from other lists. If the child already encountered some of those words, that history should carry over when the teacher assigns the new list. The teacher selects the list, the child plays with it in all games, and prior progress on overlapping words is preserved.

**Customer:** Got it. So basically the assignment's must-have. Now let's look at the prototype.

**Team:** We can start from the home screen or go straight into a game - what do you prefer?

**Customer:** Skip the main screen.

**Team:** In our demo prototype, we start directly from game selection. There are two games. The child selects one, allows microphone access, pronounces a word like "rocket" or "moon", gets audio feedback - "Great, rocket!" - and the car moves. That's the core loop. Works only in Chrome.

**Customer:** The assignment said MVP v0 and the prototype can be the same thing. The prototype represents MVP v1 and may cover more user stories than MVP v0. MVP v0 doesn't need to cover every story - it's the technical foundation. You could present your live prototype directly.

**Team:** We have MVP v0 game files in the repository - is that fine?

**Customer:** Completely fine. Let me open localhost. This is our MVP v0 - we named it "Voice Word Games," but you said you'd prefer a different name?

**Customer:** Right - call it "Voice Games." It's not limited to words; it could include phrases. "Voice Games" works for now.

**Team:** This is the home page with two games listed.

**Customer:** This flag is a developer-facing indicator to mark whether a game is playable. You play via the button.

**Team:** Got it. This screen is for selecting game theme and word list.

**Customer:** What is the "environment" option when choosing settings?

**Team:** That's visible only during gameplay - we'll implement it later. We also have a task book: "Listen and Learn Practice" with words like Banana, Lemon. And you can add a custom word list. Can I pronounce words here, or only listen?

**Customer:** Here you can only listen, then practice in the game.

**Team:** Understood. There's an option to add a custom word list. What is "Fun Clue"?

**Team:** Honestly, that's a placeholder - it hasn't been implemented yet.

**Team:** The game is playable. Apple. Peach. Orange. Grape. What does "Help" do?

**Customer:** It prompts you to pronounce that word.

**Team:** Lemon. Can I pause the game?

**Customer:** No, you can quit. In my Doodle Jump version, I could see the English word and its Russian translation. Clicking the English word played the English pronunciation; clicking the Russian translation played the Russian. We should replicate something like that - the English word and its translation, both clickable. Though: why do we need Russian pronunciation? If a very young child can't yet read in Russian, we may only need English. But if we add Russian audio, it's a nice-to-have.

**Team:** We can have both - the English word and its translation underneath, each clickable for the respective pronunciation.

**Customer:** The challenge with phrases: a five-word phrase won't fit cleanly into a game element. On pause buttons - in the second game the hazards aren't working yet, so it's not critical right now.

**Team:** But what if the child is mid-game?

**Customer:** A pause button is useful - it would also stop the microphone. We should definitely surface the translation of the English word. Clickable audio is a nice addition. One question: does the child hear the translation automatically after pronouncing the word correctly, or only on click?

**Team:** Only on click - English word plays English audio, Russian translation plays Russian audio.

**Customer:** Clear. Assuming children can read Russian may not hold for five-year-olds. It's an edge case but not much work to make the translation clickable. One concern: misclicks during gameplay could be annoying - we'll see if it surfaces in testing. The bigger problem is long phrases. If you have "I go to school," how do you fit that into a game?

**Team:** We could display dynamically changing text. A static phrase is hard to play with - the child might skip words.

**Team:** We could place each word of the phrase on a separate platform. Or show a "Help" button that pauses the game and displays the full phrase, then closes.

**Customer:** A help button is inconvenient when the game is fast - the child sees a hazard and has to stop to tap a button. The top of the screen is probably the cleanest option. Show the full sentence and highlight the current word. In a platform-jumping game specifically, you could put each word on a separate platform: "I", "go", "to school", "may" - the correct platform is safe, the wrong one breaks. This only works when multiple platforms are visible simultaneously, which isn't the case in the current prototype.

**Team:** Why can't we show more platforms? For example: "I" -> Apple, "go" -> Lemon, "to" -> Cherry, "school" -> Melon. With directional arrows, you could map each word to a direction. Anyway - do you like the design of the main menu?

**Customer:** I like it. One issue: since users know Russian and not English, all the UI text here should be in Russian.

**Team:** We can add a language toggle.

**Customer:** That would make it more flexible. The menu looks good overall - the child can scroll, game rules are visible, everything is animated and colorful, which should attract and engage children. The second game shows different themes nicely as well. I can navigate back from the game portal.

**Customer:** "Word list topic: Animals." Same layout. Let's try Bubble Popper - oh, it's too fast.

**Team:** Dog. Rabbit. Something broke - it's normally slower. The game starts at a low speed and increases linearly. Something went wrong here.

**Customer:** Does the speed cap at some point or keep increasing?

**Team:** It increases slowly but doesn't cap.

**Customer:** Even at this speed the game is unplayable because the engine isn't recognizing words reliably. Sometimes it just stops recognizing entirely. When I was quickly putting together my prototype, the engine would occasionally stop working without explanation. Did you use any of the techniques from my prototype - hints to guide recognition, canonical word forms, Levenshtein distance?

**Team:** I put this together before looking at your prototype.

**Customer:** Try some of those approaches - also ask an AI assistant how to improve recognition accuracy. More broadly, think about how we measure it. We need to define what makes the game enjoyable: if accuracy is at 50%, the game isn't engaging. Set a threshold - something like 80-90% - and work toward it. Ideally, build an evaluation set of words pronounced by children and test recognition against it. If we can't reach at least 70%, the games may simply not be viable. For data, you could pull from YouTube videos of children speaking, or record actual children if anyone has younger siblings. Or we don't worry about it for now since it's an MVP.

**Team:** Let's revisit this later - it's not an urgent task.

**Customer:** For now, make sure you yourself can play the game without it breaking within a normal session. Assume a child plays for about five minutes, and ensure nothing breaks in that window.

**Team:** We'll address accuracy and quality in a later iteration. To summarize: user stories with must-have priorities will be updated in the repository. The last two user stories - feedback and results - will be merged into one. The Figma prototype is in place, and we have an MIT license in the repository.

**Customer:** Confirmed - all looks good.

**Team:** That covers everything for today.

**Customer:** Agreed. Thank you for the meeting.

**Team:** Thank you.
