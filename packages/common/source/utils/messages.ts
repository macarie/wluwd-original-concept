import { bold, green, red } from 'kleur/colors'

import { messageSymbols } from '../message-symbols.js'

const plus = green('+')
const minus = red('-')

export const messages = {
  [messageSymbols.affirmative.equalTo]: `It seems that \`input\` (${minus}) and \`expected\` (${plus}) are ${bold(
    'not'
  )} deeply equal:`,
  [messageSymbols.negative.equalTo]: `It seems that \`input\` and \`expected\` are deeply equal. Both are:`,
}
