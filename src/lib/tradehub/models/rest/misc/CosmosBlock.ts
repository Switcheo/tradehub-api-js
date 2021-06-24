export interface CosmosBlock {
    block_id: CosmosBlockId
    block: CosmosBlockData
}

interface CosmosBlockId {
    hash: string
    parts: CosmosBlockPart
}

interface CosmosBlockPart {
    total: string
    hash: string
}

interface CosmosBlockData {
    header: CosmosBlockHeader
    data: CosmosBlockDataContent
    evidence: CosmosBlockEvidence
    last_commit: CosmosBlockCommit
}

interface CosmosBlockDataContent {
    txs: string[]
}

interface CosmosBlockHeader {
    version: CosmosBlockVersion
    chain_id: string
    height: string
    time: string
    last_block_id: CosmosBlockId
    last_commit_hash: string,
    data_hash: string,
    validators_hash: string,
    next_validators_hash: string,
    consensus_hash: string,
    app_hash: string,
    last_results_hash: string,
    evidence_hash: string,
    proposer_address: string
}

interface CosmosBlockVersion {
    block: string
    app: string
}

interface CosmosBlockData {
    txs: null | unknown
}

interface CosmosBlockEvidence {
    evidence: null | unknown
}

interface CosmosBlockCommit {
    height: string
    round: string
    block_id: CosmosBlockId
    signatures: Array<CosmosBlockSignature>
}

interface CosmosBlockSignature {
    block_id_flag: number
    validator_address: string
    timestamp: string
    signature: string
}
