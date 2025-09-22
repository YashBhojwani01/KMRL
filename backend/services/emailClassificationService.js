const { GoogleGenerativeAI } = require('@google/generative-ai');

class EmailClassificationService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    async classifyEmail(emailData) {
        try {
            const prompt = this.createClassificationPrompt(emailData);
            
            const response = await this.model.generateContent(prompt);
            const classificationText = response.response.text().trim();
            
            return this.parseClassification(classificationText);

        } catch (error) {
            console.error('Error during email classification:', error);
            return {
                category: 'OTHER',
                department: 'Administration',
                priority: 'MEDIUM',
                reason: `⚠️ Sorry, I couldn't process that request. Error: ${error.message}`
            };
        }
    }

    createClassificationPrompt(emailData) {
        const { subject, body, attachments } = emailData;
        
        // Extract attachment information
        let attachmentInfo = 'No attachments';
        if (attachments && attachments.length > 0) {
            attachmentInfo = attachments.map(att => 
                `Filename: ${att.filename}, Type: ${att.mimeType}, Size: ${att.size} bytes`
            ).join('; ');
        }

        return `
        Classify the following email for KMRL (Government Document Management System) based on the provided information:

        - Subject: ${subject || 'No Subject'}  
        - Body: ${body || 'No Body'}  
        - Attachments: ${attachmentInfo}  

        ---

        🔹 Classification Dimensions:

        1. *Document Category (choose one):*
            - CRITICAL_SAFETY - Safety Protocol documents, Incident Reports, Emergency procedures  
            - BUDGET_FINANCE - Budget approvals, Financial reports, Expense documentation, Infrastructure upgrades  
            - HR_TRAINING - Employee training records, Staff verification, HR documentation  
            - OPERATIONS - Daily operational reports, System updates, Process documentation  
            - COMPLIANCE_AUDIT - Audit reports, Compliance documentation, Quality assessments  
            - COMMUNICATION - General communications, Meeting notes, Internal announcements  
            - OTHER - Documents that don't fit the above categories  

        2. *Department (choose one):*
            - Operations  
            - Maintenance  
            - Safety  
            - Engineering  
            - Administration  
            - Finance  
            - Human Resources  
            - IT  
            - Customer Service  
            - Security  

        3. *Priority Level (choose one):*
            - URGENT - Requires immediate attention (safety issues, critical deadlines)  
            - HIGH - Important but not critical (budget deadlines, monthly reports)  
            - MEDIUM - Standard priority (training sessions, routine updates)  
            - LOW - Information only (general communications, announcements)  

        ---

        🔹 Department-Specific Examples & Keywords:

        - *Operations*: Daily operational reports, workflows, system performance, schedules, process updates.  
        - *Maintenance*: Equipment repairs, service schedules, downtime reports, spare parts requests.  
        - *Safety*: Incident reports, safety protocols, hazard assessments, emergency procedures.  
        - *Engineering*: Technical drawings, infrastructure designs, system upgrades, performance analysis.  
        - *Administration*: Office circulars, notices, staffing approvals, administrative policies.  
        - *Finance*: Budget approvals, expense reports, funding requests, invoices, procurement.  
        - *Human Resources*: Employee onboarding, staff verification, payroll, training programs.  
        - *IT*: System issues, access control, software upgrades, cybersecurity alerts.  
        - *Customer Service*: Passenger complaints, feedback, support tickets, service reports.  
        - *Security*: Security audits, incident alerts, access logs, patrol reports.  

        ---

        🔹 Instructions for Classification:
        1. Analyze Subject and Body for keywords  
        2. Consider attachments and their types  
        3. Assign the most appropriate *Document Category*  
        4. Map to the correct *Department* based on context  
        5. Assign *Priority Level* depending on urgency indicators  
        6. Give a short *Reason* explaining the classification  

        ---

        🔹 Output Format (strict):
        CATEGORY: [One of the 7 document categories]  
        DEPARTMENT: [One department from the list]  
        PRIORITY: [URGENT/HIGH/MEDIUM/LOW]  
        REASON: [One sentence explanation]  

        Example:
        CATEGORY: CRITICAL_SAFETY  
        DEPARTMENT: Safety  
        PRIORITY: URGENT  
        REASON: Email contains an emergency incident report about a fire hazard.  
        `;
    }

    parseClassification(classificationText) {
        try {
            const lines = classificationText.split('\n');
            let category = 'OTHER';
            let department = 'Administration';
            let priority = 'MEDIUM';
            let reason = 'Unable to parse classification';

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (trimmedLine.startsWith('CATEGORY:')) {
                    category = trimmedLine.replace('CATEGORY:', '').trim();
                } else if (trimmedLine.startsWith('DEPARTMENT:')) {
                    department = trimmedLine.replace('DEPARTMENT:', '').trim();
                } else if (trimmedLine.startsWith('PRIORITY:')) {
                    priority = trimmedLine.replace('PRIORITY:', '').trim();
                } else if (trimmedLine.startsWith('REASON:')) {
                    reason = trimmedLine.replace('REASON:', '').trim();
                }
            }

            return {
                category,
                department,
                priority,
                reason
            };
        } catch (error) {
            console.error('Error parsing classification:', error);
            return {
                category: 'OTHER',
                department: 'Administration',
                priority: 'MEDIUM',
                reason: 'Error parsing classification response'
            };
        }
    }

    async classifyBatchEmails(emails) {
        const results = [];
        
        for (let i = 0; i < emails.length; i++) {
            const email = emails[i];
            console.log(`Classifying email ${i + 1}/${emails.length}: ${email.subject}`);
            
            try {
                const classification = await this.classifyEmail(email);
                results.push({
                    ...email,
                    classification
                });
            } catch (error) {
                console.error(`Error classifying email ${email.id}:`, error);
                results.push({
                    ...email,
                    classification: {
                        category: 'OTHER',
                        department: 'Administration',
                        priority: 'MEDIUM',
                        reason: 'Classification failed'
                    }
                });
            }
        }

        return results;
    }

    generateClassificationReport(classifiedEmails) {
        const total = classifiedEmails.length;
        
        const categoryCounts = {};
        const departmentCounts = {};
        const priorityCounts = {};

        classifiedEmails.forEach(email => {
            const { category, department, priority } = email.classification;
            
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            departmentCounts[department] = (departmentCounts[department] || 0) + 1;
            priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
        });

        return {
            total,
            categories: categoryCounts,
            departments: departmentCounts,
            priorities: priorityCounts,
            urgentHigh: classifiedEmails.filter(email => 
                ['URGENT', 'HIGH'].includes(email.classification.priority)
            ).length
        };
    }
}

module.exports = EmailClassificationService;
