import type { Backbone } from './data/paper'
import { store } from './lib/store'

/** The backbone shown by Figure 3 and Table 2; switching one switches both. */
export const backbone = store<Backbone>('qwen')
