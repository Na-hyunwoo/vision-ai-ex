import { ImageAnnotatorClient } from '@google-cloud/vision';

const client = new ImageAnnotatorClient({
  keyFilename: 'google-cloud-key.json',
});

export default async function handler(req: any, res: any) {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl parameter is required' });
  }

  try {
    const [result] = await client.textDetection(imageUrl);
    const detections = result.textAnnotations;
    return res.status(200).json(detections);
  } catch (error) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({ error: 'Error analyzing image' });
  }
}
