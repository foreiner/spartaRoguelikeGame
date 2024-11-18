
import writeIniFile from 'write-ini-file';
import readIniFile from 'read-ini-file';
import path from 'path';
const name_of_ini_file = 'setting.ini';

let game_setting = {
    game_difficluty: 1,
}


function saving_init(game_setting) {

    return writeIniFile.writeIniFile(name_of_ini_file, game_setting).then(() => {
        console.log('저장완료!');
    })
}


function read_init() {

    const fixture = path.join(name_of_ini_file);
    try {
        return Object.assign({}, readIniFile.readIniFileSync(fixture));
    }
    catch (error) {
        console.log('게임설정파일 없음 생성중');
        saving_init().then(() => {
            console.log('생성완료!');
        });
        read_init();
    }
}

function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) { }
}


export default {
    game_setting,
    sleep,
    saving_init,
    read_init,
};