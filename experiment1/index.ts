import { GrammarAnalyzer } from "./ai_tools/grammar-analyzer";
import { Collection, MongoClient } from "mongodb";
import { GrammarExample } from "./models/grammar-example"

export class Main {

  private readline
  private rl
  private detector
  private url = 'mongodb://127.0.0.1:27017';
  private dbName = 'assistant';
  private client:MongoClient;
  private collection!: Collection<GrammarExample>;

  constructor(){
    this.readline = require('readline');
    this.rl = this.readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.detector = new GrammarAnalyzer();
    this.client = new MongoClient(this.url);
    this.connectToDatabase();
  }

  run() {
    this.rl.question('Please enter some text for grammar analysis: ', async (userInput: string) => {
      if (userInput.toLowerCase() === 'exit') {
        await this.client.close();
        this.rl.close();
      } else {
        if(await this.detector.isGrammarOk(userInput)){
          console.log("It's ok.");
        } else {
          let explanation:string = await this.detector.explainGrammar(userInput);
          this,this.uploadExampleToDatabase({text:userInput, explanation:explanation} as GrammarExample)
          console.log(explanation);
        }
        this.run();
      }
    });
  }

  private async connectToDatabase(){
    try {
      await this.client.connect();
      this.collection = this.client.db(this.dbName).collection<GrammarExample>('examples');
      console.log("Connected");
    } catch (error) {
      console.error('Error:', error);
    }
  }

  private async uploadExampleToDatabase(example:GrammarExample) {
    const result = await this.collection.insertOne(example);
  }
}



const main = new Main();

main.run();