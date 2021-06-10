import { SimpleMap } from "@lib/tradehub/utils";

export interface BlockEventAttr {
  key: string
  value: string
}

export interface BlockEvent {
  type: string
  attributes: SimpleMap
}

export interface BlockEvents {
  begin_block_events: BlockEvent[]
  end_block_events: BlockEvent[]
}
