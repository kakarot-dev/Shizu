/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
export default function(name: any, require): string {
    return fs.readFileSync(require.resolve(name)).toString();
}