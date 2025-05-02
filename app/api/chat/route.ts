import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatRequest, ChatResponse } from '../../types/chat';

// Enhanced ethical frameworks with more detailed descriptions
const ethicalFrameworks = {
    UTILITARIAN: "Focuses on outcomes and consequences, aiming to maximize overall happiness or well-being. This approach asks 'What action will produce the most good and least harm for everyone affected?'",

    DEONTOLOGICAL: "Centers on duties, rights, and universal principles regardless of outcomes. This approach considers whether an action follows moral rules that could be universally applied, honoring duties and respecting rights.",

    VIRTUE: "Emphasizes developing virtuous character traits and acting as a person of good character would. This approach asks 'What would a person of integrity, compassion, and wisdom do in this situation?'",

    RIGHTS_BASED: "Prioritizes protecting fundamental human rights that shouldn't be violated even for good outcomes. This framework respects autonomy and dignity, ensuring individuals aren't treated merely as means to ends.",

    CARE_ETHICS: "Highlights the importance of response to others' needs, emphasizing relationships, empathy and context. This approach focuses on maintaining connections and responding with compassion to vulnerability."
};

// Get relevant frameworks based on domain and message content
function getRelevantFrameworks(message: string, domain: string): string[] {
    try {
        const keywords = {
            "outcome": ["UTILITARIAN"],
            "consequences": ["UTILITARIAN"],
            "result": ["UTILITARIAN"],
            "greatest good": ["UTILITARIAN"],

            "duty": ["DEONTOLOGICAL"],
            "obligation": ["DEONTOLOGICAL"],
            "rule": ["DEONTOLOGICAL"],
            "principle": ["DEONTOLOGICAL"],

            "character": ["VIRTUE"],
            "virtue": ["VIRTUE"],
            "integrity": ["VIRTUE"],
            "excellence": ["VIRTUE"],

            "rights": ["RIGHTS_BASED"],
            "autonomy": ["RIGHTS_BASED"],
            "dignity": ["RIGHTS_BASED"],
            "freedoms": ["RIGHTS_BASED"],

            "care": ["CARE_ETHICS"],
            "relationship": ["CARE_ETHICS"],
            "compassion": ["CARE_ETHICS"],
            "empathy": ["CARE_ETHICS"],
        };

        const relevantFrameworks = new Set<string>();

        // Add domain-specific default frameworks
        if (domain.toUpperCase() === "HEALTHCARE") {
            relevantFrameworks.add("RIGHTS_BASED");
            relevantFrameworks.add("CARE_ETHICS");
            relevantFrameworks.add("UTILITARIAN");
        } else if (domain.toUpperCase() === "EMERGENCY") {
            relevantFrameworks.add("UTILITARIAN");
            relevantFrameworks.add("DEONTOLOGICAL");
            relevantFrameworks.add("VIRTUE");
        } else if (domain.toUpperCase() === "EDUCATION") {
            relevantFrameworks.add("VIRTUE");
            relevantFrameworks.add("CARE_ETHICS");
            relevantFrameworks.add("RIGHTS_BASED");
        } else {
            // For general, include a mix
            relevantFrameworks.add("UTILITARIAN");
            relevantFrameworks.add("DEONTOLOGICAL");
        }

        // Check for keywords in message - lowercase for case insensitivity
        const lowerMessage = message.toLowerCase();
        for (const [keyword, frameworks] of Object.entries(keywords)) {
            if (lowerMessage.includes(keyword.toLowerCase())) {
                frameworks.forEach(f => relevantFrameworks.add(f));
            }
        }

        // Limit to 3 frameworks for focus
        let frameworkArray = Array.from(relevantFrameworks);
        if (frameworkArray.length > 3) {
            frameworkArray = frameworkArray.slice(0, 3);
        }

        // Format frameworks for display
        return frameworkArray.map(key => {
            const frameworkName = key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ');
            return `${frameworkName}: ${ethicalFrameworks[key as keyof typeof ethicalFrameworks]}`;
        });
    } catch (error) {
        console.error("Error in getRelevantFrameworks:", error);
        // Return some fallback frameworks if there's an error
        return [
            "Utilitarian: Focuses on outcomes and consequences, aiming to maximize overall happiness or well-being.",
            "Deontological: Centers on duties, rights, and universal principles regardless of outcomes."
        ];
    }
}

// Function to generate personalized follow-up questions based on the content
function getPersonalizedFollowUpQuestions(message: string, domain: string): string[] {
    const defaultQuestions = [
        "Which ethical principle resonates most strongly with your personal values?",
        "How might your decision impact the different stakeholders involved?",
        "What personal experiences influence how you're approaching this situation?"
    ];

    const domainSpecificQuestions: Record<string, string[]> = {
        'HEALTHCARE': [
            "How do you balance patient autonomy with your professional judgment?",
            "What precedent might your decision set for future medical scenarios?",
            "How would you explain your ethical reasoning to patients and their families?"
        ],
        'EMERGENCY': [
            "How does time pressure affect your ability to make ethical decisions?",
            "What resources or support would help you navigate similar situations better?",
            "How do you manage your own emotional response while making difficult choices?"
        ],
        'EDUCATION': [
            "How might your decision impact the learning environment for all students?",
            "What educational values are most important to uphold in this situation?",
            "How would you balance fairness with individual student needs?"
        ],
        'GENERAL': [
            "What competing values make this situation particularly challenging?",
            "How might different cultural perspectives view this ethical dilemma?",
            "What information would help you better understand the ethical dimensions here?"
        ]
    };

    // Get domain-specific questions
    const specificQuestions = domainSpecificQuestions[domain.toUpperCase()] || domainSpecificQuestions['GENERAL'];

    // Combine default and specific questions, taking 2 from each
    const combinedQuestions = [...defaultQuestions.slice(0, 2), ...specificQuestions.slice(0, 3)];

    return combinedQuestions;
}

// Add mock responses for fallback
const mockResponses: Record<string, string> = {
    'HEALTHCARE': `When allocating scarce medical resources, your situation involves multiple ethical perspectives:

From a Utilitarian view, maximizing overall benefit might lead you to prioritize patients with better survival odds and longer life expectancy. This approach focuses on saving the most lives or life-years possible.

From a Rights-Based perspective, each patient has equal value and dignity, suggesting allocation methods like first-come-first-served or random selection to respect everyone's equal right to care.

From a Care Ethics standpoint, your concern for relationships and emotional impact matters. Consider how decisions affect families, communities, and healthcare workers' moral distress.

Your professional values and institutional context will influence which principles feel most compelling in this difficult situation.`,

    'EMERGENCY': `Emergency decision-making creates unique ethical tensions:

From a Duty-Based perspective, you have professional obligations to help all victims, regardless of survival odds. This framework emphasizes following consistent moral rules even under extreme pressure.

From a Utilitarian approach, maximizing good outcomes might mean prioritizing those with better survival chances when resources are limited. This can be emotionally difficult but aims to save more lives overall.

From a Virtue Ethics standpoint, consider what qualities define an excellent emergency responder - courage balanced with prudence, fairness with efficiency. These character traits guide difficult triage decisions.

Emergency ethics acknowledges that perfect solutions rarely exist, but thoughtful application of frameworks can help you navigate these challenging moments.`,

    'EDUCATION': `Your educational dilemma can be viewed through several ethical lenses:

From a Virtue Ethics perspective, what would a person of excellent character (fairness, wisdom, discernment) do? Focus on actions that develop these qualities in yourself and your students.

From a Care Ethics viewpoint, maintaining supportive relationships is central. Consider how your decision affects the student's growth, class culture, and trust within your educational community.

From a Justice standpoint, similar situations deserve similar treatment, but context matters. Consider whether all students have equitable access to resources that prevent integrity issues.

The educational purpose - learning versus punishment - should guide your approach to balancing accountability with support.`,

    'GENERAL': `Your ethical dilemma can be examined through multiple ethical frameworks:

From a Utilitarian perspective, which option produces the greatest good for the greatest number? Consider both immediate and long-term consequences for all stakeholders.

From a Deontological (duty-based) view, certain moral principles should be followed regardless of outcomes. What universal rules apply, and would you want everyone to act similarly?

From a Virtue Ethics approach, what traits would a person of good character demonstrate? Which action best displays virtues like honesty, fairness, and courage?

The most thoughtful ethical decisions often combine insights from multiple frameworks while acknowledging that no single approach captures all important moral considerations.`
};

// Function handling Gemini API error
function handleApiError(message: string, domain: string, frameworks: string[]) {
    console.warn('Providing fallback response for domain:', domain);

    // Get domain-specific mock response if available
    const upperDomain = domain.toUpperCase();
    const mockResponse = mockResponses[upperDomain] || mockResponses['GENERAL'];

    return NextResponse.json({
        response: mockResponse,
        suggestedFrameworks: frameworks,
        followUpQuestions: getPersonalizedFollowUpQuestions(message, domain),
    });
}

export async function POST(req: Request) {
    console.log("Chat API route handler called");

    try {
        // Parse the request body as ChatRequest
        const body = await req.json() as ChatRequest;
        console.log("Request body parsed:", JSON.stringify(body));

        const { message, context } = body;
        const domain = context?.domain || 'GENERAL';
        console.log("Processing message for domain:", domain);

        // Get relevant ethical frameworks
        const frameworks = getRelevantFrameworks(message, domain);
        console.log("Selected frameworks:", frameworks);

        // Using the provided API key
        const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyB_YraYyicYtAOC7besjfIABiK95UNzAks';
        console.log('Using Gemini API');

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using the latest flash model

            const prompt = `You are Ethical Ally, an AI companion that helps users navigate ethical dilemmas.
            Your role is to guide users through different ethical frameworks and perspectives without telling them what to do.
            
            IMPORTANT: Provide a personalized, detailed comparative analysis of how different ethical frameworks would approach this situation. 
            Make your response feel tailored to the user's specific situation, not generic.
            
            Current context:
            - Domain: ${domain}
            - Relevant ethical frameworks: ${frameworks.join(', ')}
            
            User's message: ${message}
            
            In your response:
            1. Address the user directly and personally - acknowledge their specific situation
            2. Clearly compare how 2-3 different ethical frameworks would approach THEIR SPECIFIC situation
            3. For each framework, explain:
               - The core principles and values it emphasizes
               - How those principles apply to this specific situation
               - What considerations or questions it would prioritize
            4. Highlight tensions or contradictions between different frameworks
            5. Provide specific factors they should consider in their decision-making
            6. Maintain an empathetic, thoughtful tone that respects the complexity
            7. Acknowledge the emotional aspects of the decision
            8. Do NOT tell the user what decision to make
            
            Format your response with clear structure showing the different perspectives. 
            Use second-person pronouns (you, your) to make it feel directly relevant to them.`;

            const result = await model.generateContent(prompt);
            const response = result.response;
            const responseText = response.text();
            console.log("Received Gemini response");

            // Get personalized follow-up questions
            const followUpQuestions = getPersonalizedFollowUpQuestions(message, domain);

            const responseObj: ChatResponse = {
                response: responseText,
                suggestedFrameworks: frameworks,
                followUpQuestions,
            };

            console.log("Returning API response");
            return NextResponse.json(responseObj);
        } catch (error) {
            console.warn('Gemini API error:', error);
            return handleApiError(message, domain, frameworks);
        }
    } catch (error) {
        console.error('Detailed error in chat API:', error);
        return new NextResponse(JSON.stringify({
            error: 'An error occurred while processing your request',
            details: error instanceof Error ? error.message : 'Unknown error',
            response: "I apologize, but I've encountered a technical problem. Please try again or refresh the page.",
            suggestedFrameworks: [
                "Utilitarian: Focuses on outcomes and consequences, aiming to maximize overall happiness or well-being.",
                "Deontological: Centers on duties, rights, and universal principles regardless of outcomes."
            ]
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 