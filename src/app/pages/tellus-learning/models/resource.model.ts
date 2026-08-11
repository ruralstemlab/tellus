import {
  ResourceType,
  ExperienceTechRequirement,
} from './experience.enums';

export interface Resource {
  id: string;

  title: string;
  description?: string;

  type: ResourceType;

  url?: string;
  thumbnailUrl?: string;

  mimeType?: string;
  fileSize?: number;

  techRequirement?: ExperienceTechRequirement;

  metadata?: Record<string, unknown>;

  createdBy: string;

  createdAt: unknown;
  updatedAt: unknown;
}