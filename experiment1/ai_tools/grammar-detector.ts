import { ChatOpenAI } from "langchain/chat_models/openai";
import 'dotenv/config'
import { ChatPromptTemplate, HumanMessagePromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain";

export class GrammarDetector {

    chat:ChatOpenAI;

    constructor() {
        this.chat = new ChatOpenAI({
            openAIApiKey: process.env.API_KEY,
            temperature: 0.0,
            modelName: process.env.LLM_MODEL,
            maxTokens:1
        });
    }

    async isGrammarOk(text: string):Promise<boolean> {
        return this.analyzeModelResponse(this.getModelResponse(text))
    }

    private async getModelResponse(text: string):Promise<string> {
        const prompt = ChatPromptTemplate.fromPromptMessages([
            HumanMessagePromptTemplate.fromTemplate("Is there a grammar error in the following text: \"{text}\"? Please respond with 'y' for yes or 'n' for no."),
          ]);
          const chain = new LLMChain({
            prompt: prompt,
            llm: this.chat,
          });
          const response = await chain.call({
            text: text,
          });
        return response.text;
    }

    private async analyzeModelResponse(response: Promise<string>):Promise<boolean> {
        const resp = (await response).toLowerCase();
        return resp === "n";
    }
}
