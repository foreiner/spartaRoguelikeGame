import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { server_Main } from "./server_sample.js";


export function takeinput(questionstring, ...question_list) {
    let question_sumerized = '';
    question_list.forEach((question_parameter) => {
        question_sumerized += `${question_parameter}  `;


    });

    // 하단 설명
    console.log(chalk.gray(question_sumerized));

        let Input_data = readlineSync.question(questionstring).toUpperCase();
        switch (Input_data) {
            case 'P':
                server_Main.start(false);
                break;
            default:
                return Input_data;
        }
}