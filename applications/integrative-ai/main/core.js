require('dotenv').config();

/**
 * An LLM-powered integrative AI module that uses AI API endpoint from `Groq`
 * 
 * To use this module, you must get your API key by signing in to their website: https://groq.com
 */

class Integrative_AI {
    constructor() {
        this.apiKey = process.env.INTEGRATIVE_AI_API_KEY;
        this.endpoint = "https://api.groq.com/openai/v1/chat/completions";
        this.plain_text_task = null;
        this.rules = ["Rules:"];
        this.history_context = [];
        this.history_context_length = 5;
        this.save_history = false;
        this.model = "llama-3.1-8b-instant"
    }

    /**
     * @method configure
     * @param {Object} config 
     * @param {Number} config.history_context_length - the length of context history for the AI to remember past prompt and response. Default is 5.
     * @param {Boolean} config.save_history - If set to true, prompt and response will be saved as past context
     * @param {String} config.apikey - set your API key from `Groq` or any provider. If not set, will load the default API key set in .env
     * @param {String} config.api_url - set your API URL endpoint.
     * @param {String} config.model - set model type available on Groq. Default is `llama-3.1-8b-instant`
     */
    configure(config) {
        this.endpoint = config.api_url || this.endpoint;
        this.history_context_length = config.history_context_length || 5;
        this.save_history = config.save_history || false;
        this.apiKey = config.apikey || process.env.INTEGRATIVE_AI_API_KEY;
        this.model = config.model || "llama-3.1-8b-instant";
    }


    /**
     * @method setRules() - This allows you to customized rules for your AI - how it introduced itself, character, behavior, etc.
     * @param {Array<String>} rules an array of rules set for your AI 
     *
     * 
     * @example
     * setRule([
     *      "You are <chatbot-name>",
     *      "You are excellent in <what field>",
     *      "Do not <your rules>"
     *      // add more rules
     * ])
     */
    setRules(rules =[]) {
        if (rules.length <= 0) throw new Error("No rules provided");

        for (let i = 0; i < rules.length; i++) {
            this.rules.push(rules[i])
        }

    }

    /**
     * @method setTask() - This allows you to instruct your AI what it will do after receiving prompt or a data in plain text
     * @param {String} task - plain text instruction 
     */
    setTask(task) {
        this.plain_text_task = task || null;
    }

    /**
     * @method send() - This allows you to feed data to AI for processing and receive a response.
     * @param {String} message - data to be sent as payload. This can be a normal prompt or a data to analyze
     * @param {String} injectors - data that can be use as additional context or knowledge
     * @returns {Object} {
                status: response.status,
                success: data.success,
                response: data.response,
                raw: data
            }
     */

    async send(message, injectors) {
        if (!this.apiKey) {
            console.log('\n[ERROR]------- No API key is set');
            return {
                error: 'API key not configure. Please check your .env'
            }
        }

        if (this.history_context.length > this.history_context_length) {
            this.history_context.shift(); // removed the very first element
        }

        try {
            
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: "system",
                            content: `
                                SYSTEM_RULES:
                                ${this.rules.join('; \n')}

                                TASK:
                                ${this.plain_text_task || "No specific task"}

                                MEMORY:
                                ${this.history_context.join('; \n') || "No previous context"}

                                ${this.save_history
                                    ? "You may use memory context."
                                    : "Ignore memory context."
                                }

                                INJECTORS:
                                ${injectors || "No injected context"}
                            `
                        },
                        {
                            role: "user",
                            content: message || "Hello 👋"
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (response.status === 429) {
                return {
                    success: false,
                    error: "Rate limit exceeded"
                };
            }

            if (!response.ok) {
                console.log("Failed to send prompt\n",response);
                return {
                    success: false,
                    error: "Something went wrong",
                    status: response.status
                }
            }

            if (this.save_history) {
                const context = {
                    prompt:message,
                    response: data.choices?.[0]?.message?.content || null,
                    timestamp: new Date()
                }

                const parseString = Object.entries(context).map(([key, value]) => `${key}:${value}`).join(', ')
                this.history_context.push(parseString);

            }

            return {
                status: response.status,
                success: response.ok,
                response: data.choices?.[0]?.message?.content || null,
                raw: data,
                error: data.error?.message || null
            };

        }
        catch (err) {
            return {
                status: 500,
                success: false,
                response: null,
                raw: null,
                error: err.message
            };
        }
    }
}

module.exports = {
    Integrative_AI
}
