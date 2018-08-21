import fs from 'fs';
import path from 'path';
import util from 'util';
import axios from 'axios';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

async function main() {
    try {
        // Prefer manually reading `package.json` as importing it causes the
        // transpiled output hierarchy to have an extra unwanted level
        const packageJsonPath = path.resolve(__dirname, '../package.json');
        const packageJsonData = await readFile(packageJsonPath, 'utf8');
        const { version } = JSON.parse(packageJsonData);
        // tslint:disable-next-line:max-line-length
        const response = await axios.get(`https://raw.githubusercontent.com/miqid/atom-language-rust/v${version}/grammars/rust.json`);
        const outputPath = path.resolve(__dirname, '../language-grammar.json');
        await writeFile(outputPath, JSON.stringify(response.data));
    } catch (e) {
        // tslint:disable-next-line:no-console
        console.error(e);
        process.exit(1);
    }
}

main();
