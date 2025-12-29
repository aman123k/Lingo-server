import { ConversationMode } from "../../model/conversationModel";

export const WELCOME_TEMPLATES: Record<
  ConversationMode,
  (params: any) => string
> = {
  chat: () =>
    "Hi! I’m Jennifer, your personal AI language coach. 😊 Ask me anything—learning starts with curiosity!",

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

  debate: (p) => getDebateWelcomeMessage(p.topic),
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

function getDebateWelcomeMessage(topic: string) {
  const intros: Record<string, string[]> = {
    "Tourism Impact": [
      "🌍 Tourism supports economic growth and cultural exchange, but it can also harm the environment and local communities. Where do you stand?",
      "Tourism brings both opportunity and strain. Do its benefits outweigh the long-term costs?",
    ],

    "Animal Entertainment": [
      "🐘 Animal entertainment raises ethical concerns about confinement, stress, and exploitation. What is your viewpoint?",
      "Is human entertainment ever justified when it affects animal welfare?",
    ],

    "Eating Meat": [
      "🍖 Eating meat involves nutrition, tradition, ethics, and environmental impact. Which side do you support?",
      "Is eating meat a necessity, a cultural choice, or an ethical issue?",
    ],

    "Free Public Transport": [
      "🚌 Free public transport can improve accessibility and reduce pollution, but can it be sustained financially?",
      "Should public transport be a basic right, or does free access create economic challenges?",
    ],

    "Universal Basic Income": [
      "💰 Universal Basic Income promises financial security, but could it disrupt economic balance?",
      "Is UBI a solution to inequality or a policy with unintended consequences?",
    ],

    "Compulsory Retirement Age": [
      "⏳ A fixed retirement age creates opportunities for younger workers, but may undervalue experience. What’s your take?",
      "Should retirement be mandatory, or should experience and ability decide?",
    ],

    "Space Exploration": [
      "🚀 Space exploration drives innovation and inspiration, but demands massive investment. Is it worth the cost?",
      "Should humanity prioritize space exploration over solving problems on Earth?",
    ],

    "Alternative to Fossil Fuels": [
      "🔋 Renewable energy reduces emissions and promotes sustainability, but is it ready to fully replace fossil fuels?",
      "Are alternatives to fossil fuels the ultimate solution, or do they come with new challenges?",
    ],

    "Free University": [
      "🎓 Free university education increases access to learning, but requires strong public funding. Is it practical?",
      "Should higher education be free for everyone, or should students share the cost?",
    ],

    "One-Child Policy": [
      "👶 The one-child policy controlled population growth but caused social and ethical challenges. Was it justified?",
      "Can population control policies ever be effective without harming individual rights?",
    ],

    "Remote Work": [
      "🏠 Remote work offers flexibility and work-life balance, but may reduce collaboration and social connection. What do you think?",
      "Is remote work the future of productivity or a barrier to teamwork?",
    ],

    "Nuclear Energy Source": [
      "⚛️ Nuclear energy provides low-carbon power, but raises safety and waste concerns. Is it worth the risk?",
      "Should nuclear energy be embraced as a climate solution or avoided due to its dangers?",
    ],

    "Violent Video Games and Real-Life Violence": [
      "🎮 Do violent video games influence real-life behavior, or are they simply harmless entertainment?",
      "Is there a meaningful link between virtual violence and real-world aggression?",
    ],

    "Banning Sugary Drinks": [
      "🥤 Banning sugary drinks aims to improve public health, but does it restrict personal freedom?",
      "Should governments regulate sugary drinks for health reasons, or let individuals decide?",
    ],

    "Global Responsibility": [
      "🌐 Global challenges require shared responsibility, but who should take the lead?",
      "Is global responsibility a collective duty or an unrealistic expectation?",
    ],

    "Promoting Nationalism": [
      "🏳️ Nationalism can strengthen unity, but it can also encourage division. Where should the balance lie?",
      "Does promoting nationalism build identity or fuel exclusion and conflict?",
    ],

    "Climate Change": [
      "🌡️ Climate change threatens ecosystems, economies, and human life. How urgent should our response be?",
      "Who bears the greatest responsibility for addressing climate change?",
    ],

    "Drinking Age": [
      "🍺 Legal drinking age laws aim to protect public safety, but do they limit personal freedom?",
      "Should drinking age be based on maturity, culture, or strict regulation?",
    ],

    "Right to Vote": [
      "🗳️ The right to vote is central to democracy, but should it ever have limits?",
      "Is voting an unconditional right, or should responsibility and awareness play a role?",
    ],
  };

  const messages = intros[topic];

  if (messages?.length) {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Intelligent fallback
  return (
    "💬 Let’s begin the discussion.\n" +
    "Share your viewpoint, and I’ll respond with thoughtful questions and counterarguments.\n\n" +
    "Whenever you’re ready, state your position."
  );
}
