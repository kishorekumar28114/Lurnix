import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export interface VideoResult {
  title: string;
  link: string;
  snippet: string;
}

/**
 * Searches YouTube for educational videos by extracting public search results.
 */
async function searchYouTubeDirect(query: string): Promise<VideoResult[]> {
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
      query
    )}`;

    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[YouTube Search] HTTP ${res.status}`);
      return [];
    }

    const html = await res.text();

    // Match ytInitialData JSON object
    const match =
      html.match(/var ytInitialData\s*=\s*({[\s\S]*?});<\/script>/) ||
      html.match(/ytInitialData\s*=\s*({[\s\S]+?});/);

    if (!match) {
      return [];
    }

    const data = JSON.parse(match[1]);
    const contents =
      data?.contents?.twoColumnSearchResultsRenderer?.primaryContents
        ?.sectionListRenderer?.contents;

    const itemSection = contents?.find((c: any) => c.itemSectionRenderer)
      ?.itemSectionRenderer?.contents;

    const videos: VideoResult[] = [];

    if (Array.isArray(itemSection)) {
      for (const item of itemSection) {
        const v = item.videoRenderer;
        if (v && v.videoId) {
          const title =
            v.title?.runs?.map((r: any) => r.text).join("") ||
            v.title?.simpleText ||
            "Educational Video";
          const snippet =
            v.detailedMetadataSnippets?.[0]?.snippetText?.runs
              ?.map((r: any) => r.text)
              .join("") ||
            v.descriptionSnippet?.runs?.map((r: any) => r.text).join("") ||
            "";

          videos.push({
            title,
            link: `https://www.youtube.com/watch?v=${v.videoId}`,
            snippet,
          });

          if (videos.length >= 5) break;
        }
      }
    }

    return videos;
  } catch (err) {
    console.warn("[YouTube Search direct extraction error]:", err);
    return [];
  }
}

/**
 * Searches using Serper API if SERPER_API_KEY is configured.
 */
async function searchSerper(query: string): Promise<VideoResult[] | null> {
  const serperKey = process.env.SERPER_API_KEY?.trim();
  if (!serperKey) return null;

  try {
    const res = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": serperKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: "site:youtube.com " + query,
      }),
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data?.organic)) {
      return data.organic.slice(0, 5).map((item: any) => ({
        title: item.title || "Video",
        link: item.link || "",
        snippet: item.snippet || "",
      }));
    }
  } catch {
    return null;
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q") || "";
    const trimmed = q.trim();

    if (!trimmed) {
      return NextResponse.json({ results: [] });
    }

    // Attempt Serper if configured
    let results = await searchSerper(trimmed);

    // Fall back to direct YouTube extraction
    if (!results || results.length === 0) {
      results = await searchYouTubeDirect(trimmed);
    }

    return NextResponse.json({ results: results || [] });
  } catch (error: any) {
    console.error("[Resource Search API Error]:", error);
    return NextResponse.json(
      { error: "Failed to search educational resources", results: [] },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Ignore JSON parse errors for empty POST
    }

    const query = typeof body.query === "string" ? body.query : "";
    const trimmed = query.trim();

    if (!trimmed) {
      return NextResponse.json({ results: [] });
    }

    let results = await searchSerper(trimmed);
    if (!results || results.length === 0) {
      results = await searchYouTubeDirect(trimmed);
    }

    return NextResponse.json({ results: results || [] });
  } catch (error: any) {
    console.error("[Resource Search API Error]:", error);
    return NextResponse.json(
      { error: "Failed to search educational resources", results: [] },
      { status: 500 }
    );
  }
}
