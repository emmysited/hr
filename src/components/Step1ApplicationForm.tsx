import React, { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';
import { ApplicationFormData, EducationLevel } from '../types';

interface Step1ApplicationFormProps {
  initialData: ApplicationFormData;
  onSubmit: (data: ApplicationFormData) => Promise<void>;
  isLoading: boolean;
  errorMessage: string | null;
  onClearError: () => void;
}

const EDUCATION_OPTIONS: { value: EducationLevel; label: string }[] = [
  { value: 'Degree', label: 'Degree' },
  { value: 'Masters', label: 'Masters' },
  { value: 'Diploma', label: 'Diploma' },
  { value: 'Certificate', label: 'Certificate' },
];

export const Step1ApplicationForm: React.FC<Step1ApplicationFormProps> = ({
  initialData,
  onSubmit,
  isLoading,
  errorMessage,
  onClearError,
}) => {
  const [formData, setFormData] = useState<ApplicationFormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ApplicationFormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.education) {
      newErrors.education = 'Education level is required';
    }

    if (formData.experienceYears === undefined || formData.experienceYears === null || isNaN(formData.experienceYears)) {
      newErrors.experienceYears = 'Years of experience is required';
    } else if (formData.experienceYears < 0) {
      newErrors.experienceYears = 'Years of experience cannot be negative';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();

    if (!validate()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div id="step1" className="w-full max-w-3xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2 tracking-tight">
        Apply for Position
      </h2>
      <p className="text-sm text-[#4b5563] mb-8 leading-relaxed">
        Please complete the initial screening form to qualify for the simulation phase.
      </p>

      {/* Global Error message */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm flex items-start justify-between">
          <span>{errorMessage}</span>
          <button
            onClick={onClearError}
            className="text-xs text-red-800 underline font-semibold ml-3 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} id="candidate-apply-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="Jane Doe"
              className={`form-input ${errors.fullName ? 'border-red-400 ring-1 ring-red-300' : ''}`}
              disabled={isLoading}
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="jane@example.com"
              className={`form-input ${errors.email ? 'border-red-400 ring-1 ring-red-300' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className={`form-input ${errors.phone ? 'border-red-400 ring-1 ring-red-300' : ''}`}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.phone}</p>
            )}
          </div>

          {/* Education Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="education">
              Education
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={(e) => handleInputChange('education', e.target.value as EducationLevel)}
              className={`form-select ${errors.education ? 'border-red-400 ring-1 ring-red-300' : ''}`}
              disabled={isLoading}
            >
              {EDUCATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.education && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.education}</p>
            )}
          </div>

          {/* Years of Experience */}
          <div className="form-group">
            <label className="form-label" htmlFor="experience">
              Years of Experience
            </label>
            <input
              type="number"
              id="experience"
              name="experienceYears"
              min="0"
              max="50"
              value={formData.experienceYears === 0 ? '0' : formData.experienceYears || ''}
              onChange={(e) =>
                handleInputChange(
                  'experienceYears',
                  e.target.value === '' ? '' : parseInt(e.target.value, 10)
                )
              }
              className={`form-input ${errors.experienceYears ? 'border-red-400 ring-1 ring-red-300' : ''}`}
              disabled={isLoading}
            />
            {errors.experienceYears && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.experienceYears}</p>
            )}
          </div>

          {/* Location */}
          <div className="form-group">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="London, UK"
              className={`form-input ${errors.location ? 'border-red-400 ring-1 ring-red-300' : ''}`}
              disabled={isLoading}
            />
            {errors.location && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.location}</p>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4">
          <button
            type="submit"
            id="submit-step1-btn"
            disabled={isLoading}
            className="btn-primary cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Profile...</span>
              </>
            ) : (
              <>
                <span>Continue to Simulation</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
