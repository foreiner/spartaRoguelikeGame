import chalk from 'chalk';
import readlineSync from 'readline-sync';
import { takeinput } from "./control_inputs.js";
import init_game from "./init_game.js";
import achievement from './achievement.js';

let battle_status;


function rand_number() {
  return parseInt(Math.random() * 100);
}


class Actor_constructor {
  #_hp = 150;
  #_max_hp = 150;
  constructor(max_hp) {
    this.#_max_hp = this.#_hp = max_hp ?? this.#_max_hp;
  }

  Actor_constructorTOJson = function (Actor) {
    let json_object = JSON.stringify({
      hp: Actor.hp,
    });
    return json_object;
  }

  set hp(hp) {
    this.#_hp = hp > this.#_max_hp ? this.#_max_hp : hp;
  }
  get hp() {
    return this.#_hp;
  }

  set max_hp(max_hp) {
    this.#_max_hp = max_hp;
  }
  get max_hp() {
    return this.#_max_hp;
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
class Battle_status {
  #_player = new Actor_constructor();
  #_monster;
  #_difficulty = 1;
  #_floor = 0;
  constructor(player, monster, difficulty, floor) {
    this.#_player = player ?? this.#_player;
    this.#_monster = monster ?? this.#_monster;
    this.#_difficulty = difficulty ?? this.#_difficulty;
    this.#_floor = floor ?? this.#_floor;
  }
  get player() {
    return this.#_player;
  }
  set player(player) {
    this.#_player = player;
  }
  get monster() {
    return this.#_monster;
  }
  set monster(monster) {
    this.#_monster = monster;
  }
  get difficulty() {
    return this.#_difficulty;
  }
  set difficulty(difficulty) {
    this.#_difficulty = difficulty;
  }
  get floor() {
    return this.#_floor;
  }
  set floor(floor) {
    this.#_floor = floor;
  }

  Battle_statusTOJson = function (battlestatus) {
    if (battlestatus == null) battlestatus = new Battle_status();
    let json_object =
      JSON.stringify({
        player: battlestatus.player.Actor_constructorTOJson(battlestatus.player),
        monster: battlestatus.monster == null ? '' : battlestatus.monster.Actor_constructorTOJson(battlestatus.monster),
        difficulty: battlestatus.difficulty,
        floor: battlestatus.floor,
      });

    return json_object;
  };
}
function JsonTOBattle_status(saved_data, battlestatus) {
  let tmp_saved_data = JSON.parse(saved_data);
  let tmp_player = JSON.parse(tmp_saved_data.player);
  let tmp_monster;
  if (tmp_saved_data.monster) {
    tmp_monster = JSON.parse(tmp_saved_data.monster);
  }

  return battlestatus = new Battle_status(
    new Actor_constructor(tmp_player.hp),
    new Actor_constructor(tmp_monster == null ? 0 : tmp_monster.hp),
    tmp_saved_data.difficulty,
    tmp_saved_data.floor);
};


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
  let choice;

  while (true) {
    console.clear();
    displayStatus(stage, player, monster);
    logs.forEach((log) => console.log(log));

    if (player.hp <= 0 && monster.hp <= 0) return 1;
    else if (monster.hp <= 0) return 2;
    else if (player.hp <= 0) return 4;

    // 플레이어의 선택에 따라 다음 행동 처리
    disition:
    while (true) {
      if (choice == 'P') {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));
      }
      choice = takeinput_battle('당신의 선택은? : ', `\n1. 공격한다 2. 아무것도 하지않는다. 3. 도망간다.`);
      switch (choice.toLocaleLowerCase()) {
        case '1':
          logs.push(chalk.green(`${choice}를 선택하셨습니다.`));
          logs.push(chalk.green(player.attack(monster)));
          break disition;
        case '2':
          logs.push(chalk.white(
            `${choice}를 선택하셨습니다.
왜 그런 선택을 하시는거죠?`));
          break disition;
        case '3':
          if (rand_number() > 80) {
            return 3;
          }
          logs.push(chalk.red(
            `${choice}를 선택하셨습니다.
도망에 실패했습니다.
불긴한 느낌이 들기 시작합니다.`));
          break disition;
        case 'p':
          continue disition;
        default:
          console.log(chalk.red(`${choice}는 선택지에 존재하지 않습니다.`));
          continue disition;
      }
    }
    logs.push(chalk.red(monster.attack(player)));

  }
};

function takeinput_battle(questionstring, question_list) {
  return takeinput(questionstring, question_list, battle_status);
}

async function startGame(saved_battle_status, difficulty = 1) {
  console.clear();
  achievement.load_achievement_list(achievement.achievement_list);

  battle_status = JsonTOBattle_status(saved_battle_status, battle_status);
  battle_status = battle_status.floor === 0 ?
    new Battle_status(new Actor_constructor(), new Actor_constructor(100 + 10 * (1 + (difficulty * 0.1))), difficulty, 1) :
    JsonTOBattle_status(saved_battle_status, battle_status);

  while (battle_status.floor <= 10) {
    achievement.achievement_achieved(1, achievement.achievement_list, battle_status.floor);
    achievement.achievement_achieved(2, achievement.achievement_list, battle_status.floor);

    battle_status.monster = battle_status.monster == null || battle_status.monster.hp <= 0 ? new Actor_constructor(100 + 10 * (battle_status.floor + (battle_status.difficulty * 0.1))) : battle_status.monster;


    switch (await battle(battle_status.floor, battle_status.player, battle_status.monster)) {
      case 1:
        console.log(chalk.white('죽음은 당신의 마지막 공격을 막지 못했습니다.'));
        console.log(chalk.white('!상격!'));
        console.log(chalk.red('생사의 갈림길에서 돌아왔습니다. hp 회복'));
        battle_status.player.hp += 50;
      case 2:
        battle_status.player.max_hp += 70;
        battle_status.player.hp += 120;
        battle_status.floor++;
        takeinput_battle('엔터 입력시 다음으로 이동', '승리! hp + 50');
        break;
      case 3:
        battle_status.player.hp += 20;
        battle_status._floor++;

        takeinput_battle('엔터 입력시 다음으로 이동',
          `3을 선택하셨습니다.
도망에 성공했습니다. hp + 20
같은 층의 다른 적에게 도전합니다.`);
        break;
      case 4:

        takeinput_battle('엔터 입력시 종료', '눈앞이 흐려진다.');
        return;

        break;
      default:

    }

    // 스테이지 클리어 및 게임 종료 조건

  }
}

export let game_main = {
  Battle_status,
  battle_status,
  startGame,
}