/**
 * This is taken from (https://github.com/lakenen/flip-text) so Please leave a star in the repo
 */

import char from './chars';

// new Object.keys(chars).forEach(function (key) {
//     var value = chars[key]
//     if(!chars[value]) {
//       chars[value] = key
//     }
//   })
export default function (str: string): string {
    let result = ''
        , c = str.length
        , ch = ''
    for (; c >= 0; --c) {
        ch = str.charAt(c)
        result += char[ch] || char[ch.toLowerCase()] || ch
    }
    return result
}