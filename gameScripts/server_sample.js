import chalk from 'chalk';
import figlet from 'figlet';
import fs from 'node:fs';
import path from 'node:path';
import os from 'os'
import { Buffer } from 'node:buffer';
import readlineSync from 'readline-sync';
import { game_main } from "./game_sample.js";
import { takeinput } from "./control_inputs.js";
import init_game from "./init_game.js";

export let server_Main = {
    start,
    displayLobby,
}
let flag_game_start = false;
const save_file = `C:/Users/${os.userInfo().username}/AppData/Roaming/spartaTenFloors/data`;

// 로비 화면을 출력하는 함수
function displayLobby() {
    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('Ten _ Floors', {
                font: 'Ghost',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 게임 이름
    console.log(chalk.yellowBright.bold('CLI 게임에 오신것을 환영합니다!'));

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(' 새로운 게임 시작'));
    if (flag_game_start) console.log(chalk.blue('2.') + chalk.white(' 계속하기'));
    if (flag_game_start) console.log(chalk.blue('3.') + chalk.white(' 저장하기'));
    console.log(chalk.blue(flag_game_start ? 4 : 2 + '.') + chalk.white(' 불러오기'));
    console.log(chalk.blue(flag_game_start ? 5 : 3 + '.') + chalk.white(' 업적 확인하기'));
    console.log(chalk.blue(flag_game_start ? 6 : 4 + '.') + chalk.white(' 옵션'));
    console.log(chalk.blue(flag_game_start ? 7 : 5 + '.') + chalk.white(' 종료'));

    // 하단 경계선
    console.log(line);

}

// 유저 입력을 받아 처리하는 함수
function handleUserInput_main() {
    const choice = takeinput('입력 : ', flag_game_start ? '1~7' : '1~5' + ' 사이의 숫자 입력');

    switch (choice) {
        case '1': // 새로운 게임 시작
            flag_game_start = true;
            console.log(chalk.green('게임을 시작합니다.'));
            // 여기에서 새로운 게임 시작 로직을 구현
            game_main.startGame();
            break;
        case flag_game_start ? '4' : '2': // 불러오기

            // 불러오기 로직을 구현
            if(start_load()) game_main.startGame(game_main.battle_status);
            start(false, battle_status);
            break;
        case flag_game_start ? '5' : '3': // 업적 확인하기
            console.log(chalk.yellow('구현 준비중입니다.. 게임을 시작하세요'));
            // 업적 확인하기 로직을 구현
            handleUserInput_main();
            break;
        case flag_game_start ? '6' : '4': // 옵션
            console.log(chalk.blue('설정'));
            // 옵션 메뉴 로직을 구현
            while (start_setting());
            init_game.saving_init(init_game.game_setting).then(() => {
                start(false);
            });
            break;
        case flag_game_start ? '7' : '5': // 게임 종료
            console.log(chalk.red('게임을 종료합니다.'));
            // 게임 종료 로직을 구현
            process.exit(0); // 게임 종료
            break;
        case flag_game_start ? '3' : '11': // 게임 저장
            if (flag_game_start) {
                try {
                    if (!fs.existsSync(save_file)) fs.mkdirSync(save_file, { recursive: true });
                    fs.writeFileSync(`${save_file}/${Date.now()}_${takeinput('입력 : ', ' 저장할 이름을 설정해주세요.')}.txt`, JSON.stringify(game_main.battle_status));
                    console.log(chalk.blue('게임이 저장되었습니다.'));
                }
                catch (err) {
                    console.log(chalk.red('게임이 정상적으로 저장되지 않았습니다.'));
                    console.error(err);
                }
                break;
            }
        case flag_game_start ? '2' : '10': // 계속하기
            if (flag_game_start) {
                break;
            }
        case flag_game_start ? '2' : '4':
            console.log(chalk.yellow('구현 준비중입니다.. 게임을 시작하세요'));
            // 업적 확인하기 로직을 구현
            handleUserInput_main();
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput_main(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
}

// 게임 시작 함수
function start(reset_flag, battle_status) {
    if (reset_flag) flag_game_start = false;
    init_game.game_setting = init_game.read_init();
    game_main.battle_status = battle_status ?? null;
    displayLobby();
    handleUserInput_main();
}

///설정
function displaysettingPage() {

    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('Settings', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 설명 텍스트
    console.log(chalk.green('옵션을 선택해주세요.'));
    console.log();

    // 옵션들
    console.log(chalk.blue('1.') + chalk.white(` 난이도 조절   현재 : ${init_game.game_setting.game_difficluty}`));
    console.log(chalk.blue('2.') + chalk.white(' 메뉴로 돌아가기'));

    // 하단 경계선
    console.log(line);
}
// 유저 입력을 받아 처리하는 함수
function handleUserInput_setting() {
    const choice = takeinput('입력 : ', '1~2 사이의 숫자 입력');

    switch (choice) {
        case '1': // 난이도 조절
            init_game.game_setting.game_difficluty = takeinput('입력 : ', '1~10 사이의 숫자 입력 (기본 1)');
            break;
        case '2': // 메뉴로 돌아가기
            return false;
            break;
        default:
            console.log(chalk.red('올바른 선택을 하세요.'));
            handleUserInput_setting(); // 유효하지 않은 입력일 경우 다시 입력 받음
    }
    return true;
}
// 설정 시작 함수
function start_setting() {
    displaysettingPage();
    return handleUserInput_setting();
}

///불러오기
function displayLoadPage(search_name = '') {

    console.clear();

    // 타이틀 텍스트
    console.log(
        chalk.cyan(
            figlet.textSync('LOAD', {
                font: 'Standard',
                horizontalLayout: 'default',
                verticalLayout: 'default'
            })
        )
    );

    // 상단 경계선
    const line = chalk.magentaBright('='.repeat(50));
    console.log(line);

    // 설명 텍스트
    console.log();

    try {
        if (!fs.existsSync(save_file)) fs.mkdirSync(save_file, { recursive: true });

        let dir_file_list = fs.readdirSync(save_file, { withFileTypes: false }).
            filter(file => {
                return path.extname(file).toLocaleLowerCase() === '.txt' &&
                    file.name.includes(search_name);
            });

        if (dir_file_list.length > 0) {
            let i = 0;

            dir_file_list.forEach((element) => {
                console.log(chalk.blue(`${i++}. `) + chalk.white(element.name));
            });

        }
        else {
            console.log(chalk.red('저장파일이 없습니다.'));
        }

        // 하단 경계선
        console.log(line);

        // 옵션들
        const choice = takeinput('입력 : ',
            `숫자를 입력해 선택
문자로 검색
X 를 입력해 메뉴로 돌아가기`);

        switch (choice) {
            case 'X' || 'x': // 메뉴로 돌아가기
                return false;
                break;
            default:
                if (choice.length === 0) {
                    console.log(chalk.red('올바른 선택을 하세요.'));
                }
                else if (Number.isInteger(choice)) {
                    try {
                        console.log(chalk.blue('게임을 불러옵니다.'));
                        game_main.battle_status = JSON.parse(fs.readFileSync(dir_file_list[choice].path, { encoding: 'utf-8', flag: 'string' }));
                    }
                    catch (err) {
                        console.log(chalk.red('게임이 정상적으로 저장되지 않았습니다.'));
                        console.error(err);
                    }
                    return true;
                }
                else {
                    displayLoadPage(choice);
                }
        }
    }
    catch (err) {
        console.log(chalk.red('에러가 발생했습니다. 개발자에게 신고하세요.'));
        console.error(err);
    };


}
// 불러오기 시작 함수
function start_load() {
    return displayLoadPage();
}