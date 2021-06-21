import { Proposal } from "./Proposal";

interface SoftwareUpgradePlan {
  name: string
  time: string | undefined
  height: string | undefined
  info: string
}

export interface SoftwareUpgradeProposal extends Proposal {
  plan: SoftwareUpgradePlan
}
