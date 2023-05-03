import { OpenAI } from "langchain/llms/openai";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import 'dotenv/config';

export const run = async () => {
  // We can construct an LLMChain from a PromptTemplate and an LLM.

  const key = process.env.API_KEY;
  const llm_model = process.env.LLM_MODEL;

  const model = new OpenAI({
    openAIApiKey: key,
     temperature: 0.9,modelName: llm_model});
  const template = "What is a good name for a company that makes {product}?";
  const prompt = new PromptTemplate({ template, inputVariables: ["product"] });
  const chainA = new LLMChain({ llm: model, prompt });
  const resA = await chainA.call({ product: "funny robot" });
  // The result is an object with a `text` property.
  console.log({ resA });
  // { resA: { text: '\n\nSocktastic!' } }

  // Since the LLMChain is a single-input, single-output chain, we can also call it with `run`.
  // This takes in a string and returns the `text` property.
  const resA2 = await chainA.run("ai assistant");
  console.log({ resA2 });
  // { resA2: '\n\nSocktastic!' }

  // We can also construct an LLMChain from a ChatPromptTemplate and a chat model.
  const chat = new ChatOpenAI({openAIApiKey: process.env.API_KEY,
  temperature: 0.9,modelName: llm_model});
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "You are a helpful assistant that translates {input_language} to {output_language}."
    ),
    HumanMessagePromptTemplate.fromTemplate("{text}"),
  ]);
  const chainB = new LLMChain({
    prompt: chatPrompt,
    llm: chat,
  });
  const resB = await chainB.call({
    input_language: "English",
    output_language: "Polish",
    text: "I love programming.",
  });
  console.log({ resB });

};

run();