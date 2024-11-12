import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { takeinput } from "./control_inputs.js";
import init_game from "./init_game.js";

let battle_status;

export let game_main = {
  battle_status,
  startGame,
}

function rand_number() {
  return parseInt(Math.random() * 100);
}
function Battle_statusTOJson(battlestatus){
  return JSON.stringify( {
    player : battlestatus.player,
    monster : battlestatus.monster,
    difficulty : battlestatus.difficulty,
    floor : battlestatus.floor,
  });
}
function JsonTOBattle_status(saved_data, battlestatus = battle_status){
  return JSON.parse( {
    player : battlestatus.player,
    monster : battlestatus.monster,
    difficulty : battlestatus.difficulty,
    floor : battlestatus.floor,
  });
}


class Battle_status{
   #_player = new Actor_constructor();
   #_monster;
   #_difficulty = 1;
   #_floor = 1;
   constructor(player, monster, difficulty, floor){
    this.#_player = player;
    this.#_monster = monster;
    this.#_difficulty = difficulty;
    this.#_floor = floor;
   }
   get player(){
    return this.#_player;
   }
   set player(player){
    this.#_player = player;
   }
   get monster(){
    return this.#_monster;
   }
   set monster(monster){
    this.#_monster = monster;
   }
   get difficulty(){
    return this.#_difficulty;
   }
   set difficulty(difficulty){
    this.#_difficulty = difficulty;
   }
   get floor(){
    return this.#_floor;
   }
   set floor(floor){
    this.#_floor = floor;
   }
}

class Actor_constructor {
  #_hp;
  constructor() {
    this.#_hp = 100;
  }
  set hp(hp) {
    this.#_hp = hp;
  }
  get hp() {
    return this.#_hp;
  }

  attack(defender) {
    // 공격
    if (rand_number() > 19) {
      defender.hp -= 30;
      return `공격을 성공했습니다.`;
    }
    else {
      return `공격을 실패했습니다.`;
    }
  }
}

function displayStatus(stage, player, monster) {
  console.log(chalk.magentaBright(`\n=== Current Status ===`));
  console.log(
    chalk.cyanBright(`| Stage: ${stage} `) +
    chalk.blueBright(
      `| 플레이어 정보 ${player.hp} `,
    ) +
    chalk.redBright(
      `| 몬스터 정보 ${monster.hp}|`,
    ),
  );
  console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
  let logs = [];

  while (true) {
    if (monster.hp <= 0) return 1;
    if (player.hp <= 0) return 2;
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));
    let choice
    do {
      choice = takeinput_battle('당신의 선택은? : ', `\n1. 공격한다 2. 아무것도 하지않는다. 3. 도망간다.`);
      switch (choice) {
        case '1':
          logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
          logs.push(chalk.green(player.attack(monster)));
          break;
        case '2':
          logs.push(chalk.white(
            `${choice}를 선택하셨습니다.
왜 그런 선택을 하시는거죠?`));
          break;
        case '3':
          if (rand_number() > 80) {
            return 3;
          }
          logs.push(chalk.red(
            `${choice}를 선택하셨습니다.
도망에 실패했습니다.
불긴한 느낌이 들기 시작합니다.`));
          break;
        default:
          logs.push(chalk.red(`${choice}는 선택지에 존재하지 않습니다.`));
          continue;
      }
    }
    while (choice == 'P')


    logs.push(chalk.red(monster.attack(player)));

    // 플레이어의 선택에 따라 다음 행동 처리
  }
};


function takeinput_battle(questionstring, question_list) {
  return takeinput(questionstring, question_list, battle_status);
}

async function startGame(saved_battle_status) {
  console.clear();
  battle_status = saved_battle_status ?? new Battle_status(new Actor_constructor(), new Actor_constructor(), init_game.game_setting.difficulty, 1);

  while (battle_status.floor <= 10) {
    battle_status.monster = new Actor_constructor();

    switch (await battle(battle_status.floor, battle_status.player, battle_status.monster)) {
      case 1:
        battle_status.player.hp += 50;
        battle_status.floor++;
        takeinput_battle('엔터 입력시 다음으로 이동', '승리! hp + 50');
        break;
      case 2:

        takeinput_battle('엔터 입력시 종료', '눈앞이 흐려진다.');
        return;

        break;
      case 3:
        battle_status.player.hp += 20;
        battle_status._floor++;

        takeinput_battle('엔터 입력시 다음으로 이동',
          `3을 선택하셨습니다.
도망에 성공했습니다. hp + 20
같은 층의 다른 적에게 도전합니다.`);
        break;
      default:

    }

    // 스테이지 클리어 및 게임 종료 조건

  }
}