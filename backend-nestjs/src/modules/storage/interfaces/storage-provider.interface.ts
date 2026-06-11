export interface IStorageProvider {
  uploadFile(
    file: Express.Multer.File,
    folder: string,
    resourceType?: 'raw' | 'auto' | 'image' | 'video',
  ): Promise<string>;

  deleteFile(fileUrl: string): Promise<void>;

  uploadBase64Image?(base64Data: string, folder?: string): Promise<string>;
}
