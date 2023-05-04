import { GrammarDetector } from "./ai_tools/grammar-detector";

export class Main {

  readline
  rl
  detector

  constructor(){
    this.readline = require('readline');
    this.rl = this.readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.detector = new GrammarDetector();
  }

  run() {

    this.rl.question('Please enter some text for grammar analysis: ', async (userInput: string) => {
      if (userInput.toLowerCase() === 'exit') {
        this.rl.close();
      } else {
        if(await this.detector.isGrammarOk(userInput)){
          console.log("It's ok.");
        } else {
          console.log("No, I will explain:");
        }
        this.run();
      }
  });
}
}

const main = new Main();

main.run();