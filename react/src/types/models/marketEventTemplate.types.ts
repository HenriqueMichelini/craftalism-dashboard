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
  effectDirection: string;
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
  createdAt: string;
  updatedAt: string;
};
