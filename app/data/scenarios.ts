export type Scenario = {
    id: string;
    title: string;
    description: string;
    domain: 'HEALTHCARE' | 'EMERGENCY' | 'EDUCATION' | 'GENERAL';
    prompts: string[];
};

export const scenarios: Scenario[] = [
    // Healthcare Scenarios
    {
        id: 'healthcare-1',
        title: 'Resource Allocation During Crisis',
        description: 'You need to decide how to allocate limited medical resources during an emergency situation.',
        domain: 'HEALTHCARE',
        prompts: [
            'How should I decide which patients receive limited ventilators during a respiratory pandemic?',
            'What factors should I consider when allocating scarce medications?',
            'How do I balance treating the most severely ill versus those with the best chance of recovery?'
        ]
    },
    {
        id: 'healthcare-2',
        title: 'Patient Autonomy vs. Professional Judgment',
        description: 'You face a situation where a patient\'s wishes conflict with what you believe is best medical practice.',
        domain: 'HEALTHCARE',
        prompts: [
            'My patient is refusing a treatment I believe is necessary. How should I proceed?',
            'How should I respond when a family member wants to withhold information from a patient?',
            'What should I do when a patient wants to try an alternative treatment I believe is ineffective?'
        ]
    },

    // Emergency Services Scenarios
    {
        id: 'emergency-1',
        title: 'Triage During Disaster',
        description: 'You need to make quick decisions about who to help first during a major emergency.',
        domain: 'EMERGENCY',
        prompts: [
            'How should I prioritize victims during a mass casualty incident?',
            'What ethical framework should guide my decisions when resources are extremely limited?',
            'How do I balance helping the most people versus helping those most in need?'
        ]
    },
    {
        id: 'emergency-2',
        title: 'Risk Assessment in Emergency Response',
        description: 'You need to determine how much risk to personnel is acceptable in rescue operations.',
        domain: 'EMERGENCY',
        prompts: [
            'When is it appropriate to put rescuers at risk to save victims?',
            'How should I weigh the safety of my team against the needs of people in danger?',
            'What factors should guide my decision about entering an unstable situation?'
        ]
    },

    // Education Scenarios
    {
        id: 'education-1',
        title: 'Academic Integrity Issues',
        description: 'You\'re dealing with potential academic dishonesty and need to determine a fair response.',
        domain: 'EDUCATION',
        prompts: [
            'How should I handle suspected plagiarism in a student\'s work?',
            'What\'s a proportionate response to different levels of academic misconduct?',
            'How can I balance educational opportunities with maintaining academic standards?'
        ]
    },
    {
        id: 'education-2',
        title: 'Balancing Diverse Student Needs',
        description: 'You need to make decisions that affect students with different needs and backgrounds.',
        domain: 'EDUCATION',
        prompts: [
            'How should I allocate limited resources between students with different needs?',
            'What\'s the fairest approach when accommodating students with special requirements?',
            'How do I balance maintaining academic standards with being inclusive?'
        ]
    },

    // General Scenarios
    {
        id: 'general-1',
        title: 'Whistleblowing Dilemma',
        description: 'You\'ve discovered wrongdoing in your organization and need to decide whether and how to report it.',
        domain: 'GENERAL',
        prompts: [
            'Should I report misconduct I\'ve witnessed at work?',
            'How should I balance loyalty to my organization with ethical concerns?',
            'What factors should I consider before becoming a whistleblower?'
        ]
    },
    {
        id: 'general-2',
        title: 'Privacy vs. Security Trade-offs',
        description: 'You need to make decisions that involve balancing privacy rights with safety concerns.',
        domain: 'GENERAL',
        prompts: [
            'When is it appropriate to compromise privacy for security purposes?',
            'How much surveillance is justified for public safety?',
            'What ethical principles should guide decisions about data collection and use?'
        ]
    }
]; 