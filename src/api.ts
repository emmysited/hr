import {
  ApplicationFormData,
  ApplyCandidateResponse,
  SubmitSimulationResponse,
  ScoreSubmissionResponse,
} from './types';

const API_KEY = 'sb_publishable_i7Ov85kRjy2p5S1W-D4-Fw__qAfzjUt';
const BASE_URL = 'https://anaqgtmlvwpdmworjdtg.supabase.co/functions/v1';
const DEFAULT_JOB_ROLE_ID = 'ad0c9791-a54a-4544-ba9c-3b593112ee36';

const commonHeaders = {
  'Content-Type': 'application/json',
  apikey: API_KEY,
};

export async function applyCandidate(data: ApplicationFormData): Promise<ApplyCandidateResponse> {
  const payload = {
    full_name: data.fullName.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    education: data.education,
    experience_years: Number(data.experienceYears),
    location: data.location.trim(),
    job_role_id: DEFAULT_JOB_ROLE_ID,
  };

  const response = await fetch(`${BASE_URL}/apply-candidate`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMessage = 'Failed to submit candidate application';
    try {
      const errJson = JSON.parse(errorText);
      parsedMessage = errJson.message || errJson.error || parsedMessage;
    } catch {
      if (errorText) parsedMessage = `${parsedMessage}: ${errorText}`;
    }
    throw new Error(parsedMessage);
  }

  const result = await response.json();
  return result as ApplyCandidateResponse;
}

export async function submitSimulation(
  applicationId: string,
  submittedText: string
): Promise<SubmitSimulationResponse> {
  const payload = {
    application_id: applicationId,
    submitted_text: submittedText,
  };

  const response = await fetch(`${BASE_URL}/submit-simulation`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMessage = 'Failed to submit simulation response';
    try {
      const errJson = JSON.parse(errorText);
      parsedMessage = errJson.message || errJson.error || parsedMessage;
    } catch {
      if (errorText) parsedMessage = `${parsedMessage}: ${errorText}`;
    }
    throw new Error(parsedMessage);
  }

  const result = await response.json();
  return result as SubmitSimulationResponse;
}

export async function scoreSubmission(submissionId: string): Promise<ScoreSubmissionResponse> {
  const payload = {
    submission_id: submissionId,
  };

  const response = await fetch(`${BASE_URL}/score-submission`, {
    method: 'POST',
    headers: commonHeaders,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let parsedMessage = 'Failed to evaluate and score submission';
    try {
      const errJson = JSON.parse(errorText);
      parsedMessage = errJson.message || errJson.error || parsedMessage;
    } catch {
      if (errorText) parsedMessage = `${parsedMessage}: ${errorText}`;
    }
    throw new Error(parsedMessage);
  }

  const result = await response.json();
  return result as ScoreSubmissionResponse;
}
