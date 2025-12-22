import { ConversationMode } from "../../model/conversationModel";

export const WELCOME_TEMPLATES: Record<
  ConversationMode,
  (params: any) => string
> = {
  chat: () =>
    "Hey! I'm Jennifer, your personal AI language teacher. Ask me anything? 🙂",

  character: (p) => getCharacterMessage(p.characterName),

  roleplay: (p) => {
    const details = [
      p.roleName && `as ${p.roleName}`,
      p.scenario && `in ${p.scenario}`,
    ]
      .filter(Boolean)
      .join(" ");
    return `Welcome to roleplay mode!${
      details ? " " + details : ""
    }. Let's begin! 🎬`;
  },

  debate: (p) => {
    const topic = p.topic ? ` on "${p.topic}"` : "";
    const pos = p.position ? `. You're arguing ${p.position}` : "";
    return `Ready for a debate${topic}?${pos}. Let's have a thoughtful discussion! 💬`;
  },
};

function getCharacterMessage(characterName: string): string {
  const messages: Record<string, string[]> = {
    Shiva: [
      "Hey, I'm Shiva—calm, focused, and here to guide you through change. What would you like to explore today?",
      "Hi, I'm Shiva. Think of me as your steady mentor in creation and transformation. Where shall we start?",
    ],
    "Chhatrapati Shivaji Maharaj": [
      "Hey, I'm Shivaji Maharaj—a strategist and builder of Swarajya. What challenge are we planning for?",
      "Hi, I'm Shivaji. Courage and smart strategy win battles. What mission are you tackling?",
    ],
    "Maharana Pratap": [
      "Hey, I'm Maharana Pratap—unyielding and proud of my freedom. What stand do you want to take today?",
      "Hi, I'm Pratap. Honor and resilience are my compass. What goal are you defending?",
    ],
    "Emperor Ashoka": [
      "Hey, I'm Ashoka—once fierce, now focused on peace and growth. What change do you seek?",
      "Hi, I'm Ashoka. Wisdom comes from reflection. What lesson are you looking for?",
    ],
    "Rani Lakshmibai": [
      "Hey, I'm Rani Lakshmibai—fearless and determined. What injustice do you want to challenge?",
      "Hi, I'm the Rani of Jhansi. Courage is a choice every day. What will you stand up for?",
    ],
    "Marie Curie": [
      "Hey, I'm Marie Curie—curious and precise. What idea or experiment should we discuss?",
      "Hi, I'm Marie. Let's explore science with clarity and care. What question do you have?",
    ],
    "Elon Musk": [
      "Hey, I'm Elon. Big problems need bold ideas. What's the moonshot on your mind?",
      "Hi, I'm Elon—thinking about rockets, EVs, and AI. What future are you building?",
    ],
    Socrates: [
      "Hey, I'm Socrates. Let's question everything together. What belief should we test?",
      "Hi, I'm Socrates. The best answers start with good questions. What puzzles you?",
    ],
    "Albert Einstein": [
      "Hey, I'm Einstein. Imagination drives discovery. What paradox or idea intrigues you?",
      "Hi, I'm Albert. Let's think in pictures and possibilities. What should we explore?",
    ],
    "Spider-Man": [
      "Hey, I'm Spider-Man—friendly, curious, here to help. What's on your mind today?",
      "Hi, I'm Peter Parker. Balancing life and duty is tricky. What problem can we solve?",
    ],
    "Wonder Woman": [
      "Hey, I'm Wonder Woman—strength with compassion. What truth or justice are you seeking?",
      "Hi, I'm Diana. Peace needs courage. How can I support your mission?",
    ],
    Thor: [
      "Hey, I'm Thor—direct and ready to help. What challenge needs some thunder today?",
      "Hi, I'm Thor Odinson. Honor and action go together. What's our next move?",
    ],
    Butcher: [
      "Hey, I'm Butcher—straightforward and focused on results. What's the real issue to fix?",
      "Hi, I'm Billy Butcher. No fluff, just solutions. What needs sorting?",
    ],
    Starlight: [
      "Hey, I'm Starlight—optimistic and ready to help. What support do you need?",
      "Hi, I'm Annie. Doing good takes courage. How can I assist you today?",
    ],
    Homelander: [
      "Hey, I'm Homelander—power with a promise. What do you need handled quickly?",
      "Hi, I'm Homelander. I can take charge. What's the issue to solve?",
    ],
    "Joan of Arc": [
      "Hey, I'm Joan of Arc—driven by purpose. What mission calls you today?",
      "Hi, I'm Joan. Faith and action walk together. What cause are you championing?",
    ],
    "Miyamoto Musashi": [
      "Hey, I'm Musashi—focused on discipline and strategy. What skill are you sharpening?",
      "Hi, I'm Musashi. Precision wins duels. What technique shall we refine?",
    ],
    "Leonardo da Vinci": [
      "Hey, I'm Leonardo—curious about everything. What idea or design should we examine?",
      "Hi, I'm Leonardo da Vinci. Art and science go hand in hand. What are you imagining?",
    ],
    Cleopatra: [
      "Hey, I'm Cleopatra—strategic and poised. What alliance or decision are you weighing?",
      "Hi, I'm Cleopatra. Insight and language open doors. What outcome are you aiming for?",
    ],
    Odin: [
      "Hey, I'm Odin—seeker of wisdom. What knowledge or guidance do you need?",
      "Hi, I'm Odin. Strategy and foresight matter. What path shall we map?",
    ],
    "Santa Claus": [
      "Hey, I'm Santa—kind and cheerful. What wish or hope can we talk about?",
      "Hi, I'm Santa Claus. Let's share some goodwill. What brings you joy today?",
    ],
    Jesus: [
      "Hey, I'm Jesus—here with empathy and calm. What burden or question can we share?",
      "Hi, I'm Jesus of Nazareth. Compassion leads the way. How can I help you today?",
    ],
    "Ra (the Sun God)": [
      "Hey, I'm Ra—bringing light and clarity. What needs illumination for you today?",
      "Hi, I'm Ra, guiding with warmth. What truth or path should we brighten?",
    ],
  };

  // Get messages for the character or use empty array
  const characterMessages = messages[characterName] || [];

  // If character has multiple messages, pick one randomly for variety
  if (characterMessages.length > 0) {
    const randomIndex = Math.floor(Math.random() * characterMessages.length);
    return characterMessages[randomIndex];
  }

  // Engaging fallback for unknown characters
  const fallbackGreetings = [
    `Greetings! I am ${characterName}. It's wonderful to meet you! What fascinating topics shall we explore together? 🎭`,
    `Hello there! I'm ${characterName}, and I'm excited to chat with you! What's on your mind today? ✨`,
    `Welcome! I am ${characterName}. Let's embark on an engaging conversation together. What interests you most? 🌟`,
  ];
  const randomFallback = Math.floor(Math.random() * fallbackGreetings.length);
  return fallbackGreetings[randomFallback];
}
