import { ChatOpenAI } from "langchain/chat_models/openai";
import 'dotenv/config'
import { ChatPromptTemplate, HumanMessagePromptTemplate, PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain";

export class GrammarAnalyzer {

    private chatDetector:ChatOpenAI;
    private chatExplainer:ChatOpenAI;

    private explainPrompt:string = "As an English language expert, please help me improve the following text by correcting grammar mistakes" +
    "and explaining your changes: \"{text}\"";
    private detectGrammarPrompt:string = "Is there a grammar error in the following text: \"{text}\"? Please respond with 'y' for yes or 'n' for no."

    constructor() {
        this.chatDetector = new ChatOpenAI({
            openAIApiKey: process.env.API_KEY,
            temperature: 0.0,
            modelName: process.env.LLM_MODEL,
            maxTokens:1
        });
        this.chatExplainer = new ChatOpenAI({
          openAIApiKey: process.env.API_KEY,
          temperature: 0.5,
          modelName: process.env.LLM_MODEL,
        }) 
    }

    async isGrammarOk(text: string):Promise<boolean> {
        return this.analyzeModelResponse(this.getModelResponse(text))
    }

    async explainGrammar(text: string):Promise<string> {
        const prompt = ChatPromptTemplate.fromPromptMessages([
            HumanMessagePromptTemplate.fromTemplate(this.explainPrompt)]);
          const chain = new LLMChain({
            prompt: prompt,
            llm: this.chatExplainer,
          });
          const response = await chain.call({
            text: text,
          });
        return response.text;
    }

    private async getModelResponse(text: string):Promise<string> {
        const prompt = ChatPromptTemplate.fromPromptMessages([
            HumanMessagePromptTemplate.fromTemplate(this.detectGrammarPrompt),
          ]);
          const chain = new LLMChain({
            prompt: prompt,
            llm: this.chatDetector,
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
