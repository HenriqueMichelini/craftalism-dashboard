import type {
  MarketEventRarity,
  MarketEventScope,
} from "./marketEvent.types.js";

export type MarketEventTemplateCreateRequest = {
  templateId: string;
  rarity: MarketEventRarity;
  scope: MarketEventScope;
  automaticWeight: number;
  automaticEnabled: boolean;
  blockingAllowed: boolean;
  minDurationSeconds: number;
  maxDurationSeconds: number;
  minEffectBasisPoints: number;
  maxEffectBasisPoints: number;
  cooldownSeconds: number;
  playerFacingName: string;
  playerFacingDescription: string;
  broadScopeHint: string;
  eligibleTargetMetadata: string;
};

export type MarketEventTemplateUpdateRequest = Omit<
  MarketEventTemplateCreateRequest,
  "templateId"
>;

export type MarketEventTemplate = MarketEventTemplateCreateRequest & {
  effectDirection: string;
  createdAt: string;
  updatedAt: string;
};
