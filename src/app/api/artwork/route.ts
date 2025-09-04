import { NextResponse } from 'next/server';

const ARTWORK_IDS = [
  129884, // La Grande Jatte
  27992, // The Bedroom
];

export async function GET() {
  try {
    const artworkData = await fetch(
      `https://api.artic.edu/api/v1/artworks/${ARTWORK_IDS.join(",")}&fields=title,artist,image_id`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );
    
    if (!artworkData.ok) {
      throw new Error(`Failed to fetch artwork: ${artworkData.status}`);
    }
    
    const data = await artworkData.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid artwork data format");
    }
    
    const artwork = data.data.map(
      (artwork: { title: string; artist: string; image_id: string }) => {
        return {
          title: artwork.title,
          artist: artwork.artist,
          url: `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`,
        };
      }
    );
    
    return NextResponse.json(artwork);
  } catch (error) {
    console.error("Error fetching artwork:", error);
    return NextResponse.json(
      { error: "Failed to fetch artwork" },
      { status: 500 }
    );
  }
}
