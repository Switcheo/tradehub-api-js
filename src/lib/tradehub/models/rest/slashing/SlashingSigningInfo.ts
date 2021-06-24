import { Dayjs } from "dayjs";

export interface SlashingSigningInfo {
  address: string
  start_height: number
  index_offset: number
  jailed_until?: Dayjs
  tombstoned: boolean
  missed_blocks_counter: number
}
