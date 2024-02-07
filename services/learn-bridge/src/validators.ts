import { VPValidator } from '@learncard/types';
import { z } from 'zod';

export const IssueEndpointValidator = z.object({
    ids: z.string().array(),
    presentation: VPValidator,
});
export type IssueEndpoint = z.infer<typeof IssueEndpointValidator>;

export const CourseEntryValidator = z.object({
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    genusType: z.string().nullish(),
    id: z.string().nullish(),
    uri: z.string().nullish(),
    startDate: z.string().nullish(),
    endDate: z.string().nullish(),
    endReasonId: z.string().nullish(),
    studentId: z.string().nullish(),
    courseId: z.string().nullish(),
    termId: z.string().nullish(),
    complete: z.boolean().nullish(),
    creditScaleId: z.string().nullish(),
    creditsEarned: z.string().or(z.number()).nullish(),
    gradeId: z.string().nullish(),
    scoreScaleId: z.string().nullish(),
    score: z.string().nullish(),
});
export type CourseEntry = z.infer<typeof CourseEntryValidator>;

export const CourseValidator = z.object({
    id: z.string().nullish(),
    genusType: z.string().nullish(),
    active: z.boolean().nullish(),
    enabled: z.boolean().nullish(),
    disabled: z.boolean().nullish(),
    operational: z.boolean().nullish(),
    uri: z.string().nullish(),
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    title: z.string().nullish(),
    number: z.string().nullish(),
    prerequisitesInfo: z.string().nullish(),
    sponsorIds: z.string().array().nullish(),
    creditIds: z.string().array().nullish(),
    prerequisiteIds: z.string().array().nullish(),
    levelIds: z.string().array().nullish(),
    gradingOptionIds: z.string().array().nullish(),
    learningObjectiveIds: z.string().array().nullish(),
});
export type Course = z.infer<typeof CourseValidator>;

export const AssessmentEntryValidator = z.object({
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    genusType: z.string().nullish(),
    id: z.string().nullish(),
    uri: z.string().nullish(),
    providerId: z.string().nullish(),
    license: z.string().nullish(),
    ruleId: z.string().nullish(),
    studentId: z.string().nullish(),
    assessmentId: z.string().nullish(),
    dateCompleted: z.string().nullish(),
    programId: z.string().nullish(),
    courseId: z.string().nullish(),
    gradeId: z.string().nullish(),
    scoreScaleId: z.string().nullish(),
    score: z.number().nullish(),
    brandingIds: z.string().array().nullish(),
});
export type AssessmentEntry = z.infer<typeof AssessmentEntryValidator>;

export const CredentialEntryValidator = z.object({
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    genusType: z.string().nullish(),
    id: z.string().nullish(),
    uri: z.string().nullish(),
    startDate: z.string().nullish(),
    endDate: z.string().nullish(),
    endReasonId: z.string().nullish(),
    studentId: z.string().nullish(),
    credentialId: z.string().nullish(),
    dateAwarded: z.string().nullish(),
    programId: z.string().nullish(),
});
export type CredentialEntry = z.infer<typeof CredentialEntryValidator>;

export const CredentialValidator = z.object({
    id: z.string().nullish(),
    genusType: z.string().nullish(),
    active: z.boolean().nullish(),
    enabled: z.boolean().nullish(),
    disabled: z.boolean().nullish(),
    operational: z.boolean().nullish(),
    uri: z.string().nullish(),
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    lifetime: z.string().nullish(),
});
export type Credential = z.infer<typeof CredentialValidator>;

export const ProgramValidator = z.object({
    id: z.string().nullish(),
    genusType: z.string().nullish(),
    active: z.boolean().nullish(),
    enabled: z.boolean().nullish(),
    disabled: z.boolean().nullish(),
    operational: z.boolean().nullish(),
    uri: z.string().nullish(),
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    title: z.string().nullish(),
    number: z.string().nullish(),
    completionRequirementsInfo: z.string().nullish(),
    sponsorIds: z.string().array().nullish(),
    completionRequirementIds: z.string().array().nullish(),
    credentialIds: z.string().array().nullish(),
});
export type Program = z.infer<typeof ProgramValidator>;

export const PersonValidator = z.object({
    id: z.string().nullish(),
    genusType: z.string().nullish(),
    active: z.boolean().nullish(),
    enabled: z.boolean().nullish(),
    disabled: z.boolean().nullish(),
    operational: z.boolean().nullish(),
    uri: z.string().nullish(),
    displayName: z.string().nullish(),
    description: z.string().nullish(),
    salutation: z.string().nullish(),
    givenName: z.string().nullish(),
    preferredName: z.string().nullish(),
    surname: z.string().nullish(),
    generationQualifier: z.string().nullish(),
    birthDate: z.string().nullish(),
    deathDate: z.string().nullish(),
    institutionalIdentifier: z.string().nullish(),
    forenameAliases: z.string().array().nullish(),
    middleNames: z.string().array().nullish(),
    surnameAliases: z.string().array().nullish(),
});
export type Person = z.infer<typeof PersonValidator>;
