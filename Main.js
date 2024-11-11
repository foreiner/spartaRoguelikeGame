import { execSync } from 'child_process';
import {server_Main} from "./gameScripts/server_sample.js";

execSync('chcp 65001');
server_Main.start(true);