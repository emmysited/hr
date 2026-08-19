import React, { useState } from 'react';
import {
  ApplicationFormData,
  SimulationTaskData,
  ScoreSubmissionResponse,
  Step,
  careerPathMap,
  CareerPath,
} from './types';
import { applyCandidate, submitSimulation, scoreSubmission } from './api';
import { StepProgressBar } from './components/StepProgressBar';
import { Step1ApplicationForm } from './components/Step1ApplicationForm';
import { Step2SimulationTask } from './components/Step2SimulationTask';
import { Step3Confirmation } from './components/Step3Confirmation';
import { RejectionView } from './components/RejectionView';
import { Briefcase, ShieldCheck } from 'lucide-react';

const initialFormValues: ApplicationFormData = {
  fullName: '',
  email: '',
  phone: '',
  education: 'Degree',
  careerPath: 'Data Analytics',
  experienceYears: 5,
  location: '',
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<ApplicationFormData>(initialFormValues);
  const [selectedCareerPath, setSelectedCareerPath] = useState<CareerPath>('Data Analytics');

  // Qualification status
  const [isRejected, setIsRejected] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Step 2 & 3 state
  const [applicationId, setApplicationId] = useState<string>('');
  const [simulationTask, setSimulationTask] = useState<SimulationTaskData | null>(null);
  const [submissionId, setSubmissionId] = useState<string>('');
  const [scoreData, setScoreData] = useState<ScoreSubmissionResponse | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitProgressText, setSubmitProgressText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Submit Application Form
  const handleApplyCandidate = async (submittedFormData: ApplicationFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    const chosenCareerPath: CareerPath = submittedFormData.careerPath || 'Data Analytics';
    setSelectedCareerPath(chosenCareerPath);
    setFormData({ ...submittedFormData, careerPath: chosenCareerPath });

    try {
      const response = await applyCandidate({
        ...submittedFormData,
        careerPath: chosenCareerPath,
      });

      if (!response.passed_qualification_filter) {
        setIsRejected(true);
        setRejectionReason(
          response.reason ||
            response.message ||
            'Sorry, your profile did not meet the criteria for this specific role.'
        );
      } else {
        setIsRejected(false);
        const appId = response.application_id || response.id || `APP-${Date.now()}`;
        setApplicationId(appId);

        const task: SimulationTaskData = response.simulation_task || {
          task_title: `${chosenCareerPath} Simulation Assessment`,
          task_prompt:
            'Review the workplace scenario and deliver a thorough, high-impact solution meeting company standards.',
          time_limit_minutes: 20,
        };

        setSimulationTask(task);
        setCurrentStep(2);
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An error occurred while submitting your application. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Submit Simulation and Immediately Score
  const handleSubmitSimulation = async (submittedText: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSubmitProgressText('Submitting simulation response...');

    try {
      // 1. Submit Simulation
      const submitRes = await submitSimulation(applicationId, submittedText);
      const subId = submitRes.submission_id || submitRes.id || `SUB-${Date.now()}`;
      setSubmissionId(subId);

      // 2. Score Submission
      setSubmitProgressText('Evaluating submission and generating rubric scores...');
      const scoringRes = await scoreSubmission(subId);

      setScoreData(scoringRes);
      setCurrentStep(3);

      try {
        localStorage.removeItem(`cleaning_data_${applicationId}`);
        localStorage.removeItem(`text_response_${applicationId}`);
      } catch {
        // ignore
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An error occurred while evaluating your simulation. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setSubmitProgressText('');
    }
  };

  // Reset Application
  const handleReset = () => {
    setCurrentStep(1);
    setIsRejected(false);
    setRejectionReason('');
    setApplicationId('');
    setSimulationTask(null);
    setSubmissionId('');
    setScoreData(null);
    setErrorMessage(null);
    setSelectedCareerPath('Data Analytics');
    setFormData(initialFormValues);
  };

  // Edit details after rejection
  const handleEditApplication = () => {
    setIsRejected(false);
    setCurrentStep(1);
  };

  const activePath = selectedCareerPath || formData.careerPath || 'Data Analytics';
  const currentJobRoleId = careerPathMap[activePath] || careerPathMap['Data Analytics'];

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] flex flex-col md:flex-row font-sans text-[#111827]">
      {/* Sidebar (Artistic Flair theme) */}
      <aside
        id="app-sidebar"
        className="w-full md:w-80 bg-[#1B3A6B] text-white p-6 sm:p-10 flex flex-col justify-between shrink-0 shadow-lg"
      >
        <div>
          {/* Brand Header */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-3 text-blue-200">
              <Briefcase className="w-5 h-5" />
              <span className="text-xs uppercase tracking-widest font-semibold">Evaluation Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
              Vanguard<br className="hidden md:block" /> Systems
            </h1>
          </div>

          {/* Progress Tracker */}
          <div className="mb-8 md:mb-12">
            <div className="text-xs uppercase tracking-wider text-blue-200 font-semibold mb-4 opacity-75">
              Assessment Flow
            </div>
            <StepProgressBar currentStep={currentStep} variant="sidebar" />
          </div>
        </div>

        {/* Sidebar Footer Metadata */}
        <div className="pt-6 border-t border-white/15 text-xs text-white/70 space-y-1">
          <p className="font-semibold text-white/90">{activePath} Track</p>
          <p className="font-mono text-[11px] text-white/50">ID: {currentJobRoleId}</p>
          <div className="flex items-center gap-1 text-[11px] text-emerald-300 pt-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Active Assessment Session</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white p-6 sm:p-10 md:p-14 lg:p-16 relative flex flex-col justify-center overflow-y-auto">
        {/* Loading Overlay */}
        {isLoading && (
          <div
            id="loading"
            className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center z-50 transition-all"
          >
            <div className="spinner-flair mb-3"></div>
            <p className="text-sm font-semibold text-[#1B3A6B]">
              {submitProgressText || 'Processing request...'}
            </p>
          </div>
        )}

        {/* View Switcher */}
        <div className="w-full flex justify-center">
          {isRejected ? (
            <RejectionView
              formData={formData}
              rejectionReason={rejectionReason}
              onEditApplication={handleEditApplication}
              onReset={handleReset}
            />
          ) : (
            <>
              {currentStep === 1 && (
                <Step1ApplicationForm
                  initialData={formData}
                  onSubmit={handleApplyCandidate}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                  onClearError={() => setErrorMessage(null)}
                />
              )}

              {currentStep === 2 && simulationTask && (
                <Step2SimulationTask
                  careerPath={activePath}
                  applicationId={applicationId}
                  candidateName={formData.fullName || 'Candidate'}
                  simulationTask={simulationTask}
                  onSubmitSimulation={handleSubmitSimulation}
                  isSubmitting={isLoading}
                  submitProgressText={submitProgressText}
                  errorMessage={errorMessage}
                  onClearError={() => setErrorMessage(null)}
                />
              )}

              {currentStep === 3 && scoreData && (
                <Step3Confirmation
                  scoreData={scoreData}
                  formData={formData}
                  applicationId={applicationId}
                  submissionId={submissionId}
                  onReset={handleReset}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
