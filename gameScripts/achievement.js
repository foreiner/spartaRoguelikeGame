import chalk from 'chalk';
import fs from 'node:fs';
import init_game from "./init_game.js";
const name_of_achievement_file = 'achievement.txt';



let achievement_list = [
     {
          name: '업적',
          achieved: true,

          achiev_check(...achiev_data) {//뭐가되었든 성공
               return true;

          }
     },
     {
          name: `1층에 도달`,
          achieved: false,
///층
///1층 도달 확인
          achiev_check(...achiev_data) {
               if (achiev_data[0] >= 1) {
                    return true;
               }
          }
     },
     {
          name: `10층에 도달`,
          achieved: false,
///층
///10층 도달 확인
          achiev_check(...achiev_data) {
               if (achiev_data[0] >= 10) {
                    return true;
               }
          }
     },
];

let achievement_achieved = function (index, achievement_list, ...achiev_data) {
     if (isNaN(index)) {
          for (let i = 0; i < achievement_list.length; i++) {
               if (achievement_list[i].name == index) {
                    index = i;
                    break;
               }
          }
     }
     if (achievement_list[index].achieved) return true;
     if (achievement_list[index].achiev_check(...achiev_data)) {
          achievement_list[index].achieved = true
          save_achievement_list(achievement_list);
          return true;
     }
     return false;
}

let save_achievement_list = function (achievement_list) {

     try {
          let tmp_achievement_list = ``;
          achievement_list.forEach((element, index) => {
               tmp_achievement_list += element.achieved ? `${index}, ` : ``;
          });

          fs.writeFile(name_of_achievement_file, tmp_achievement_list, (err) => {
               if (err) throw err;
          });
     }
     catch (err) {
          console.log(chalk.red('업적을 저장하는데 실패했습니다.'));
          console.error(err);
          init_game.sleep(1000);
     }
}
let load_achievement_list = function (achievement_list) {
     try {
          if (!fs.existsSync(name_of_achievement_file)) return;
          const tmp_achievement_list = fs.readFileSync(name_of_achievement_file, "utf-8");
          tmp_achievement_list.split(`, `).forEach(element => {
               if (element != '') achievement_list[element].achieved = true;
          })
     }
     catch (err) {
          console.log(chalk.red('업적을 불러오는데 실패했습니다.'));
          console.error(err);
          init_game.sleep(1000);
     }
}


export default {
     achievement_list,
     achievement_achieved,
     save_achievement_list,
     load_achievement_list,
}