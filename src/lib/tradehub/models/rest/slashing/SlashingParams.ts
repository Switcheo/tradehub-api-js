export interface SlashingParams {
  signed_blocks_window: number
  min_signed_per_window: number
  downtime_jail_duration: number
  slash_fraction_double_sign: number
  slash_fraction_downtime: number
}
