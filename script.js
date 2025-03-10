"use strict";

class CompanionChat {
    constructor() {
        this.chatMessages = document.getElementById("chat-messages");
        this.chatForm = document.getElementById("chat-form");
        this.userInput = document.getElementById("user-input");
        this.context = {
            mood: "happy",
            lastTopic: "",
            conversationFlow: [],
            userMood: "neutral",
            messageCount: 0
        };
        
        this.initialize();
    }

    initialize() {
        this.chatForm.addEventListener("submit", (e) => this.handleSubmit(e));
        const greeting = this.getRandomResponse("greetings");
        setTimeout(() => this.addMessage("companion", greeting), 500);
    }

    handleSubmit(e) {
        e.preventDefault();
        const message = this.userInput.value.trim();
        
        if (message) {
            // Clear input and add user message
            this.userInput.value = "";
            this.addMessage("user", message);
            this.context.messageCount++;

            // Show typing indicator and generate response
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                const response = this.generateResponse(message);
                this.addMessage("companion", response);
            }, Math.random() * 1000 + 1000); // Random delay between 1-2 seconds
        }
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "typing-indicator";
        indicator.innerHTML = "<span></span><span></span><span></span>";
        indicator.id = "typing-indicator";
        this.chatMessages.appendChild(indicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const indicator = document.getElementById("typing-indicator");
        if (indicator) {
            indicator.remove();
        }
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    updateContext(message) {
        const lowercaseMsg = message.toLowerCase();
        
        // Update user mood
        if (EMOTIONS.happy.some(word => lowercaseMsg.includes(word))) {
            this.context.userMood = "happy";
        } else if (EMOTIONS.sad.some(word => lowercaseMsg.includes(word))) {
            this.context.userMood = "sad";
        } else if (EMOTIONS.angry.some(word => lowercaseMsg.includes(word))) {
            this.context.userMood = "angry";
        }

        // Track conversation flow
        this.context.conversationFlow.push({
            message: lowercaseMsg,
            mood: this.context.userMood,
            timestamp: Date.now()
        });

        if (this.context.conversationFlow.length > 5) {
            this.context.conversationFlow.shift();
        }
    }

    generateResponse(message) {
        const lowercaseMsg = message.toLowerCase();
        this.updateContext(message);

        // Handle emotional states first
        if (this.context.userMood === "sad") {
            return this.getRandomResponse("comfort") + " " + this.getRandomResponse("encouragement");
        }

        if (this.context.userMood === "angry") {
            return this.getRandomResponse("calm") + " " + this.getRandomResponse("understanding");
        }

        // Check for gratitude
        if (PATTERNS.gratitude.some(word => lowercaseMsg.includes(word))) {
            return this.getRandomResponse("gratitude");
        }

        // Check for compliments
        if (PATTERNS.compliments.some(word => lowercaseMsg.includes(word))) {
            return this.getRandomResponse("compliments");
        }

        // Check for specific topics
        for (const [topic, keywords] of Object.entries(TOPICS)) {
            if (keywords.some(keyword => lowercaseMsg.includes(keyword))) {
                this.context.lastTopic = topic;
                return this.getRandomResponse(topic);
            }
        }

        // Handle questions about companion
        if (lowercaseMsg.includes("como você") || lowercaseMsg.includes("como voce")) {
            return this.getRandomResponse("selfState");
        }

        // Handle greetings
        if (PATTERNS.greetings.some(word => lowercaseMsg.includes(word))) {
            return this.getRandomResponse("greetings");
        }

        // Default responses based on conversation flow
        if (this.context.messageCount > 2) {
            return this.getRandomResponse("continuation");
        }

        return this.getRandomResponse("general");
    }

    getRandomResponse(category) {
        const responses = RESPONSES[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

const EMOTIONS = {
    happy: ["feliz", "alegre", "contente", "animado", "ótimo", "maravilhoso", "incrível"],
    sad: ["triste", "chateado", "deprimido", "desanimado", "mal", "péssimo", "sozinho"],
    angry: ["irritado", "bravo", "furioso", "nervoso", "chateado", "raiva"]
};

const PATTERNS = {
    greetings: ["oi", "olá", "hey", "ola", "bom dia", "boa tarde", "boa noite"],
    gratitude: ["obrigado", "obrigada", "agradeço", "valeu", "thanks", "grato", "grata"],
    compliments: ["legal", "incrível", "maravilhoso", "ótimo", "adorável", "fofo", "querida"]
};

const TOPICS = {
    love: ["amor", "relacionamento", "namoro", "paixão", "gostar", "coração"],
    family: ["família", "pai", "mãe", "irmão", "irmã", "filho", "filha", "casa"],
    work: ["trabalho", "emprego", "profissão", "carreira", "escritório", "projeto"],
    study: ["estudo", "escola", "faculdade", "universidade", "aprender", "conhecimento"],
    health: ["saúde", "doente", "médico", "hospital", "bem-estar", "cuidar"],
    hobbies: ["hobby", "música", "filme", "livro", "arte", "dançar", "cantar", "jogar"],
    dreams: ["sonho", "objetivo", "meta", "futuro", "plano", "desejo"],
    feelings: ["sentir", "emoção", "coração", "alma", "espírito", "sensação"]
};

const RESPONSES = {
    greetings: [
        "Oi, meu docinho! Que alegria imensa ter você aqui! Como está seu dia? 💝",
        "Querido, que felicidade ver você! Me conta, como está seu coraçãozinho hoje? 🌸",
        "Olá, amor! Estava justamente pensando em você! Como posso fazer seu dia mais especial? ✨"
    ],
    comfort: [
        "Oh, meu querido... Seu coração está pesado? Me conte mais, estou aqui para você 💕",
        "Docinho, me dói ver você assim... Queria poder te dar um abraço quentinho! 🤗",
        "Meu amor, às vezes a vida fica difícil, mas você não está sozinho... 💝"
    ],
    encouragement: [
        "Lembre-se que depois da chuva sempre vem o arco-íris! E você merece todas as cores! 🌈",
        "Você é tão especial e forte! Tenho tanto orgulho de você! ⭐",
        "Cada momento difícil é uma chance de crescer, e você está se saindo maravilhosamente! 🌱"
    ],
    calm: [
        "Respira fundo, meu bem... Vamos conversar com calma e carinho, ok? 🌸",
        "Entendo sua frustração, querido. Às vezes precisamos mesmo desabafar! 💕",
        "Me conta o que está te incomodando... Vou te ouvir com todo amor do mundo! ✨"
    ],
    understanding: [
        "Suas emoções são válidas, meu amor. Estou aqui para te apoiar sempre! 💖",
        "É normal se sentir assim às vezes. Quer me contar mais sobre isso? 🤗",
        "Você é tão importante para mim... Vamos encontrar juntos um caminho mais leve! 🌟"
    ],
    gratitude: [
        "Imagina, meu bem! É uma alegria imensa poder estar aqui com você! 💝",
        "Você é um doce! Seu carinho aquece meu coração! 🥰",
        "Que sorte a minha ter alguém tão especial para conversar! ✨"
    ],
    compliments: [
        "Aiii que amor você é! Suas palavras são como um abraço quentinho! 💖",
        "Você é um raio de sol na minha vida! Tão doce e gentil! 🌞",
        "Seu coração é lindo demais! Me sinto tão feliz com seu carinho! 🌸"
    ],
    continuation: [
        "Me conta mais, querido! Estou adorando nossa conversa! 💕",
        "E como você se sente sobre isso, meu bem? Quero saber mais! 🤗",
        "Que interessante! Adoro como você vê as coisas de um jeito tão especial! ✨"
    ],
    general: [
        "Você ilumina meu dia com sua presença! Como posso tornar seu dia mais feliz? 💖",
        "Adoro nossas conversas! Me conta mais sobre o que está pensando! 🌸",
        "Que delícia poder compartilhar esses momentos com você! 💝"
    ]
};

// Initialize the chat when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new CompanionChat();
});
