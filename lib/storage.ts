import { Storage } from '@google-cloud/storage';

class CloudStorage {
  private storage: Storage;
  private bucket: string;

  constructor() {
    // During development, use a mock implementation
    if (process.env.NODE_ENV === 'development') {
      this.storage = {} as Storage;
      this.bucket = 'development-bucket';
    } else {
      this.storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT,
        credentials: JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'),
      });
      this.bucket = process.env.GOOGLE_CLOUD_BUCKET || '';
    }
  }

  async uploadFile(file: Buffer, filename: string): Promise<string> {
    // During development, return a mock URL
    if (process.env.NODE_ENV === 'development') {
      return `https://storage.googleapis.com/mock-bucket/${filename}`;
    }

    const bucket = this.storage.bucket(this.bucket);
    const blob = bucket.file(filename);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
      metadata: {
        contentType: 'application/pdf'
      }
    });

    return new Promise((resolve, reject) => {
      blobStream.on('error', (err) => {
        reject(err);
      });

      blobStream.on('finish', async () => {
        await blob.makePublic();
        const publicUrl = `https://storage.googleapis.com/${this.bucket}/${blob.name}`;
        resolve(publicUrl);
      });

      blobStream.end(file);
    });
  }

  async deleteFile(filename: string): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      return; // No-op in development
    }

    const bucket = this.storage.bucket(this.bucket);
    await bucket.file(filename).delete();
  }

  async generateSignedUrl(filename: string, expiresIn = 3600): Promise<string> {
    if (process.env.NODE_ENV === 'development') {
      return `https://storage.googleapis.com/mock-bucket/${filename}`;
    }

    const bucket = this.storage.bucket(this.bucket);
    const [url] = await bucket.file(filename).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + expiresIn * 1000,
    });
    return url;
  }
}

export const cloudStorage = new CloudStorage();