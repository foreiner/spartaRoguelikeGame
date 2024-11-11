import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { takeinput } from "./control_inputs.js";

function rand_number() {
  return parseInt(Math.random() * 100);
}

class Player {
  #_hp;
  constructor() {
    this._hp = 100;
  }
  set hp(hp) {
    this._hp = hp > 100 ? 100 : hp;
  }
  get hp() {
    return this._hp;
  }

  attack(enemy) {
    // 플레이어의 공격
    if (rand_number() > 19) {
      enemy.hp -= 30;
      return `공격을 성공했습니다.`;
    }
    else {
      return `공격을 실패했습니다.`;
    }
  }
}

class Monster {
  constructor(stage) {
    this._hp = 100 + (stage * 20);
  }
  set hp(hp) {
    this._hp = hp;
  }
  get hp() {
    return this._hp;
  }

  attack(enemy) {
    // 몬스터의 공격
    if (rand_number() > 50) {
      enemy.hp -= 20;
      return `공격을 받았습니다.`;
    }
    else {
      return `공격을 회피했습니다.`;
    }
  }
}
function dealingDamage(attacker, defender) {

  if (rand_number() > 50) {
    enemy.hp -= 20;
    return `공격을 받았습니다.`;
  }
  else {
    return `공격을 회피했습니다.`;
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

  while (player.hp > 0) {
    console.clear();
    displayStatus(stage, player, monster);

    logs.forEach((log) => console.log(log));
    let choice
    do {
      choice = takeinput('당신의 선택은? : ', `\n1. 공격한다 2. 아무것도 하지않는다. 3. 도망간다.`);
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


    if (monster.hp <= 0) return 1;
    logs.push(chalk.green(monster.attack(player)));
    if (player.hp <= 0) return 2;

    // 플레이어의 선택에 따라 다음 행동 처리
  }
};

export async function startGame() {
  console.clear();
  const player = new Player();
  let stage = 1;

  while (stage <= 10) {
    const monster = new Monster(stage);

    switch (await battle(stage, player, monster)) {
      case 1:
        player.hp += 50;
        stage++;
        takeinput('엔터 입력시 다음으로 이동', '승리! hp + 50');
        break;
      case 2:

        takeinput('엔터 입력시 종료', '눈앞이 흐려진다.');
        return;

        break;
      case 3:
        player.hp += 20;
        stage++;

        takeinput('엔터 입력시 다음으로 이동',
          `3을 선택하셨습니다.
도망에 성공했습니다. hp + 20
같은 층의 다른 적에게 도전합니다.`);
        break;
      default:

    }

    // 스테이지 클리어 및 게임 종료 조건

  }
}