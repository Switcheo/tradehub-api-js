import { Proposal } from "./Proposal";

interface SoftwareUpgradePlan {
  name: string
  time?: string
  height?: string
  info: string
}

export interface SoftwareUpgradeProposal extends Proposal {
  plan: SoftwareUpgradePlan
}
