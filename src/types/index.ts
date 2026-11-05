export type UserRole = 'student' | 'contributor' | 'moderator' | 'admin';

export type ResourceType = 'Notes' | 'PPT' | 'Tutorial Sheet' | 'PYQ';

export type ResourceStatus = 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';

export type FileFormat = 'pdf' | 'pptx' | 'docx' | 'image';

export interface SubjectModule {
  id: string;
  moduleNumber: number;
  title: string;
  topics: string[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  department: string;
  description: string;
  modules: SubjectModule[];
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  moduleNumber: number;
  resourceType: ResourceType;
  academicYear?: string; // e.g. "Fall 2024-25 FAT", "Winter 2023-24 CAT-2"
  slot?: string; // e.g. "A1 + TA1"
  uploaderName: string;
  uploaderRegNo: string;
  uploaderEmail: string;
  createdAt: string;
  fileFormat: FileFormat;
  fileSize: string; // e.g. "4.2 MB"
  fileUrl: string;
  downloadCount: number;
  status: ResourceStatus;
  isVerified: boolean;
  moderatorNotes?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface ModerationLog {
  id: string;
  resourceId: string;
  resourceTitle: string;
  action: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED';
  moderatorName: string;
  timestamp: string;
  reason?: string;
}

export interface UserReport {
  id: string;
  resourceId: string;
  resourceTitle: string;
  reason: 'INCORRECT_CONTENT' | 'DUPLICATE' | 'INAPPROPRIATE' | 'WRONG_TAGGING';
  notes: string;
  reportedBy: string;
  timestamp: string;
  resolved: boolean;
}
