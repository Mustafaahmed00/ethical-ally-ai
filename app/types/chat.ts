export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    isFramework?: boolean;
    isHtml?: boolean;
};

export type ChatRequest = {
    message: string;
    context?: {
        domain?: 'HEALTHCARE' | 'EMERGENCY' | 'EDUCATION' | 'GENERAL';
        framework?: 'UTILITARIAN' | 'DEONTOLOGICAL' | 'VIRTUE' | 'RIGHTS_BASED' | 'CARE_ETHICS';
    };
};

export type ChatResponse = {
    response: string;
    suggestedFrameworks?: string[];
    followUpQuestions?: string[];
}; 