import type { Backbone } from './data/paper'
import { store } from './lib/store'

/** The backbone shown by Figure 3 and Table 2; switching one switches both. */
export const backbone = store<Backbone>('qwen')

/** Whether the visitor paused the hero's motion (the plan animation and the title mark). */
export const motionPaused = store<boolean>(false)
