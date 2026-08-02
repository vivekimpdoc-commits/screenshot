export interface ExtractedRow {
  id: string;
  phoneNumber: string;
  dateTime: string;
  link: string;
  content: string;
  sourceImage?: string; // base64 preview
  imageName?: string;
  createdAt: string;
  status?: 'success' | 'error' | 'processing';
  errorMessage?: string;
}

export interface ProcessingFile {
  id: string;
  name: string;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'analyzing' | 'completed' | 'failed';
  error?: string;
}

export interface SampleScreenshot {
  id: string;
  title: string;
  description: string;
  category: string;
  imageDataUrl: string;
  expectedData: {
    phoneNumber: string;
    dateTime: string;
    link: string;
    content: string;
  };
}
