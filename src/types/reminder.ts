export type ReminderSettings = {
  id: string;
  coupleId: string;
  enabled: boolean;
  daysBeforePlan: number;
  notifyOnPlanProposal: boolean;
  notifyOnDateProposal: boolean;
  notifyOnPartnerAccepted: boolean;
  notifyOnConfirmedPlan: boolean;
  createdAt: string;
  updatedAt: string;
};
