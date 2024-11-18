import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { server_Main } from "./server_sample.js";


export function takeinput(questionstring, question_list, battle_status) {
    // 하단 설명
    console.log(chalk.gray(question_list));
    let Input_data
        Input_data = readlineSync.question(questionstring).toUpperCase();
        switch (Input_data) {
            case 'P':
                server_Main.start(true, battle_status);
            default:
                return Input_data;
        }
    
}