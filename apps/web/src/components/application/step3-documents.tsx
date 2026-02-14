'use client';

import { useQuery } from '@tanstack/react-query';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { FactoryPhotosSection } from './factory-photos-section';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { uploadFile, apiGet } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';

// Mandatory Documents — IDs must match Prisma DocumentType enum exactly
const MANDATORY_DOCUMENTS = [
  { id: 'COMPANY_REGISTRATION', name: 'Company Registration Certificate' },
  { id: 'GST_CERTIFICATE', name: 'GST Registration Certificate' },
  { id: 'PAN_CARD', name: 'Company PAN Card' },
  { id: 'PAYMENT_PROOF', name: 'Proof of Online Payment' },
  { id: 'SERVICE_SUPPORT_UNDERTAKING', name: 'Undertaking for Service Support (Annexure 4)' },
  { id: 'NON_BLACKLISTING_DECLARATION', name: 'Non-Blacklisting Declaration (Annexure 5)' },
  { id: 'TURNOVER_CERTIFICATE', name: 'Audited Financial Statements (last 3 years)' },
  { id: 'ISO_CERTIFICATION', name: 'ISO Certification (9001/14001/45001) or equivalent' },
  { id: 'PRODUCT_DATASHEET', name: 'Product Datasheets with Specifications' },
  {
    id: 'CLIENT_PERFORMANCE_CERT',
    name: 'Client Performance Certificates (Min 3 per APCD - Annexure 12)',
  },
  { id: 'TEST_CERTIFICATE', name: 'NABL/EPA Accredited Laboratories Test Reports' },
  { id: 'DESIGN_CALCULATIONS', name: 'Design Calculations' },
  { id: 'MATERIAL_CONSTRUCTION_CERT', name: 'Material of Construction Certificates (Annexure 11)' },
  { id: 'WARRANTY_DOCUMENT', name: 'Warranty Documents' },
  { id: 'BANK_SOLVENCY_CERT', name: 'Bank Solvency Certificate (Last 12 months)' },
  { id: 'INSTALLATION_EXPERIENCE', name: 'Experience in Installation of APCDs (Annexure 6a)' },
  {
    id: 'CONSENT_TO_OPERATE',
    name: 'Consent to Operate Certificate / Intimation Letter to Pollution Control Board',
  },
  { id: 'TECHNICAL_CATALOGUE', name: 'Technical Catalogues / Brochures' },
  { id: 'ORG_CHART', name: 'Organizational Chart & Staffing Details' },
  {
    id: 'STAFF_QUALIFICATION_PROOF',
    name: 'Names, Qualifications, Roles & Experience Proof (Annexure 7)',
  },
  { id: 'GST_FILING_PROOF', name: 'GST Filing Proofs (past 1 year)' },
  { id: 'NO_LEGAL_DISPUTES_AFFIDAVIT', name: 'No Ongoing Legal Disputes Affidavit (Annexure 8)' },
  { id: 'COMPLAINT_HANDLING_POLICY', name: 'Documented Complaint-Handling Policy' },
  { id: 'ESCALATION_MECHANISM', name: 'Escalation Mechanism & Evidence of Corrective Actions' },
];

// Other Required Documents (Optional)
const OPTIONAL_DOCUMENTS = [
  {
    id: 'MAKE_IN_INDIA_CERT',
    name: 'Make in India Certificate (Class-I Local Suppliers - Annexure 3)',
  },
  { id: 'PROCESS_FLOW_DIAGRAM', name: 'Process Flow Diagram' },
  { id: 'GA_DRAWING', name: 'General Arrangement (GA) Drawings' },
  { id: 'BANK_ACCOUNT_DETAILS', name: 'Bank Account Details (Annexure 10)' },
  { id: 'FIELD_VERIFICATION_FORMAT', name: 'Field Verification Format (Annexure 6b)' },
  { id: 'GLOBAL_SUPPLY_DOCS', name: 'Global Supply Documents' },
];

interface Step3Props {
  applicationId: string | null;
  onSave: (data: any) => Promise<void>;
  onNext: () => void;
}

interface UploadedFile {
  documentType: string;
  fileName: string;
  fileSize: number;
  status: 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

export function Step3Documents({ applicationId, onSave, onNext }: Step3Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFile>>({});

  // Fetch existing attachments to show what's already uploaded
  const { data: existingAttachments = [], refetch: refreshAttachments } = useQuery({
    queryKey: ['attachments', applicationId],
    queryFn: async () => {
      const response = await apiGet<any>(`/attachments/application/${applicationId}`);
      return response?.data || response || [];
    },
    enabled: !!applicationId,
  });

  const handleUpload = async (documentType: string, file: File) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: {
        documentType,
        fileName: file.name,
        fileSize: file.size,
        status: 'uploading',
        progress: 0,
      },
    }));

    try {
      await uploadFile(
        '/attachments/upload',
        file,
        (progress) => {
          setUploadedFiles((prev) => ({
            ...prev,
            [documentType]: { ...prev[documentType], progress } as UploadedFile,
          }));
        },
        {
          applicationId: applicationId!,
          documentType,
        },
      );

      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          status: 'success' as const,
        } as UploadedFile,
      }));
      refreshAttachments();
    } catch (error: any) {
      setUploadedFiles((prev) => ({
        ...prev,
        [documentType]: {
          ...prev[documentType],
          status: 'error' as const,
          error: error.response?.data?.message || 'Upload failed',
        } as UploadedFile,
      }));
    }
  };

  const removeFile = (documentType: string) => {
    setUploadedFiles((prev) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
  };

  const handleSubmit = async () => {
    await onSave({});
    onNext();
  };

  const uploadedMandatoryCount = MANDATORY_DOCUMENTS.filter(
    (d) =>
      uploadedFiles[d.id]?.status === 'success' ||
      (Array.isArray(existingAttachments) &&
        existingAttachments.some((a: any) => a.documentType === d.id)),
  ).length;

  const renderDocumentCard = (docType: { id: string; name: string; mandatory?: boolean }) => {
    const uploaded = uploadedFiles[docType.id];
    const existingFile =
      Array.isArray(existingAttachments) &&
      existingAttachments.find((a: any) => a.documentType === docType.id);

    return (
      <Card key={docType.id}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{docType.name}</span>
                {docType.mandatory ? (
                  <Badge variant="destructive" className="text-xs">
                    Required
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                )}
              </div>

              {existingFile && !uploaded && (
                <div className="flex items-center gap-2 text-green-600 mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{existingFile.fileName || 'Uploaded'}</span>
                </div>
              )}

              {uploaded ? (
                <div className="mt-2">
                  {uploaded.status === 'uploading' && (
                    <div className="flex items-center gap-2">
                      <div className="h-1 flex-1 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${uploaded.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{uploaded.progress}%</span>
                    </div>
                  )}
                  {uploaded.status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm">
                        {uploaded.fileName} ({formatFileSize(uploaded.fileSize)})
                      </span>
                      <button
                        onClick={() => removeFile(docType.id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  {uploaded.status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{uploaded.error}</span>
                      <button onClick={() => removeFile(docType.id)} className="ml-auto">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              ) : !existingFile ? (
                <DocumentDropzone onDrop={(file) => handleUpload(docType.id, file)} />
              ) : (
                <div className="mt-1">
                  <DocumentDropzone onDrop={(file) => handleUpload(docType.id, file)} />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800">Document Upload</h3>
        <p className="text-sm text-blue-700 mt-1">
          Upload all required documents and factory photographs. Maximum file size: 10MB per
          document.
        </p>
      </div>

      {/* Factory Photos Section */}
      {applicationId && (
        <FactoryPhotosSection
          applicationId={applicationId}
          existingAttachments={existingAttachments}
          onPhotoChanged={refreshAttachments}
        />
      )}

      {/* Mandatory Documents Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-1">Mandatory Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          All mandatory documents must be uploaded for application processing.
        </p>
      </div>

      {/* Mandatory Document Progress */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Mandatory Documents: {uploadedMandatoryCount} / {MANDATORY_DOCUMENTS.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {MANDATORY_DOCUMENTS.length > 0
              ? Math.round((uploadedMandatoryCount / MANDATORY_DOCUMENTS.length) * 100)
              : 0}
            % complete
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{
              width: `${MANDATORY_DOCUMENTS.length > 0 ? (uploadedMandatoryCount / MANDATORY_DOCUMENTS.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Mandatory Document List */}
      <div className="space-y-3">
        {MANDATORY_DOCUMENTS.map((docType) => renderDocumentCard({ ...docType, mandatory: true }))}
      </div>

      {/* Other Required Documents Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-1">Other Required Documents</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These documents strengthen your application. Upload if available.
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONAL_DOCUMENTS.map((docType) => renderDocumentCard({ ...docType, mandatory: false }))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onNext}>
          Skip for now
        </Button>
        <Button onClick={handleSubmit}>Save & Continue</Button>
      </div>
    </div>
  );
}

function DocumentDropzone({
  onDrop,
  accept,
}: {
  onDrop: (file: File) => void;
  accept?: Record<string, string[]>;
}) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && onDrop(files[0]),
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: accept || {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`mt-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mt-1">
        {isDragActive ? 'Drop file here' : 'Click or drag file to upload'}
      </p>
    </div>
  );
}
