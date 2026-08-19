export type EducationLevel = 'Certificate' | 'Diploma' | 'Degree' | 'Masters';

export type CareerPath =
  | 'Data Analytics'
  | 'Sales'
  | 'Customer Support'
  | 'Accounting'
  | 'Inventory & Logistics'
  | 'Human Resources'
  | 'Marketing'
  | 'Procurement'
  | 'Administration'
  | 'ICT Support'
  | 'Finance'
  | 'Project Management'
  | 'Legal & Compliance'
  | 'Social Work'
  | 'Teaching';

export const CAREER_PATH_OPTIONS: CareerPath[] = [
  'Data Analytics',
  'Sales',
  'Customer Support',
  'Accounting',
  'Inventory & Logistics',
  'Human Resources',
  'Marketing',
  'Procurement',
  'Administration',
  'ICT Support',
  'Finance',
  'Project Management',
  'Legal & Compliance',
  'Social Work',
  'Teaching',
];

export const careerPathMap: Record<CareerPath, string> = {
  'Data Analytics': 'ad0c9791-a54a-4544-ba9c-3b593112ee36',
  'Sales': '5214dec2-8541-4d89-81ac-840fde91f70f',
  'Customer Support': '0738ccf8-9531-49bd-a759-1591689ddb59',
  'Accounting': 'd1b2391d-a31b-430b-8ecc-22bdfcbbcdde',
  'Inventory & Logistics': '7a2e3de7-a6cd-429e-a9e3-8763ad0b0110',
  'Human Resources': 'b35afd61-ec30-4fc9-85a2-8478c26d0338',
  'Marketing': '43e35070-92e8-43ce-80ed-d7c7fd6d347f',
  'Procurement': '3a4c20bf-9650-4d66-88f7-8e38e4df9bf6',
  'Administration': 'b3912a35-6baa-4189-b82c-8d63f6b1956f',
  'ICT Support': '2c622fc3-41d8-4987-b1b9-e90ecd81fd72',
  'Finance': '318941c9-e289-40f4-bcb3-eabbab38f11e',
  'Project Management': '739f1c79-667f-41bc-9fe5-cf8b22e8df0e',
  'Legal & Compliance': '3e3f8b7b-e812-4423-b7c7-4aec53f197eb',
  'Social Work': '919c4280-aad5-4f6a-be6e-a681043c80f7',
  'Teaching': 'e75015f6-b5bd-4ac8-8d9b-7ef93beaa8ef',
};

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  education: EducationLevel;
  careerPath: CareerPath;
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
  time_limit_minutes?: number;
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
