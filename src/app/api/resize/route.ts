import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import crypto from 'crypto';
import { ResizeResultDto } from '@/types';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const width = parseInt(url.searchParams.get('width') || '', 10);
    const height = parseInt(url.searchParams.get('height') || '', 10);

    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
      return NextResponse.json(
        { error: 'Width and height are required and must be positive integers.' },
        { status: 400 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as Blob;

    if (!file) {
      return NextResponse.json({ error: 'File not provided' }, { status: 400 });
    }

    const uuid = crypto.randomUUID();
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type.split('/')[1];
    const resizeKey = `resize/images/${width}x${height}/${uuid}.${fileType}`;
    const originalKey = `original/images/${uuid}.${fileType}`;

    const resizedBuffer = await sharp(buffer).resize(width, height).toBuffer();

    const originalParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: originalKey,
      Body: buffer,
      ContentType: file.type,
    };

    const resizedParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: resizeKey,
      Body: resizedBuffer,
      ContentType: file.type,
    };

    await s3.send(new PutObjectCommand(originalParams));
    await s3.send(new PutObjectCommand(resizedParams));

    const response: ResizeResultDto = {
      message: 'File uploaded successfully',
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${resizeKey}`,
      key: resizeKey,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    const response: ResizeResultDto = {
      message: 'Error on File upload',
      url: '',
      key: '',
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET() {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Prefix: 'resize/',
    };

    const command = new ListObjectsV2Command(params);
    const response = await s3.send(command);

    const imageList = response.Contents?.map((item) => ({
      key: item.Key,
      url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    }));

    return NextResponse.json({ images: imageList || [] });
  } catch (error) {
    console.error('Error retrieving images:', error);
    return NextResponse.json({ error: 'Failed to retrieve images' }, { status: 500 });
  }
}
