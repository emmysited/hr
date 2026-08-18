export type EducationLevel = 'Certificate' | 'Diploma' | 'Degree' | 'Masters';

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  education: EducationLevel;
  experienceYears: number;
  location: string;
}

export interface SimulationTaskData {
  id?: string;
  task_title?: string;
  title?: string;
  task_prompt?: string;
  prompt?: string;
  instructions?: string;
  time_limit_minutes: number;
  guidelines?: string[];
  role_title?: string;
  scenario?: string;
}

export interface ApplyCandidateResponse {
  passed_qualification_filter: boolean;
  message?: string;
  application_id?: string;
  id?: string;
  simulation_task?: SimulationTaskData;
  reason?: string;
}

export interface SubmitSimulationResponse {
  submission_id?: string;
  id?: string;
  message?: string;
  success?: boolean;
}

export interface ScoreBreakdownItem {
  criteria: string;
  points: number;
  max?: number;
  max_points?: number;
  justification?: string;
  feedback?: string;
}

export interface ScoreSubmissionResponse {
  score_total?: number;
  total_score?: number;
  score?: number;
  score_breakdown?: ScoreBreakdownItem[];
  breakdown?: ScoreBreakdownItem[];
  overall_feedback?: string;
  feedback?: string;
  summary?: string;
}

export type Step = 1 | 2 | 3;
