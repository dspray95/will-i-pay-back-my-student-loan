import { useCallback, useEffect, useState } from "react";
import { toPng } from "html-to-image";

import railwayRegularUrl from "../../../assets/fonts/Railway.woff2";
import railwaySemiboldUrl from "../../../assets/fonts/Railway-Semibold.woff2";

async function fetchFontAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buf)));
  return `data:font/woff2;base64,${base64}`;
}

async function buildFontEmbedCSS(): Promise<string> {
  const [regular, semibold] = await Promise.all([
    fetchFontAsBase64(railwayRegularUrl),
    fetchFontAsBase64(railwaySemiboldUrl),
  ]);

  return `
    @font-face {
      font-family: "Railway";
      src: url("${regular}") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    @font-face {
      font-family: "Railway";
      src: url("${semibold}") format("woff2");
      font-weight: 600;
      font-style: normal;
    }
  `;
}

export const useShareImage = (
  elementRef: React.RefObject<HTMLDivElement | null>,
) => {
  const [isSharing, setIsSharing] = useState(false);
  const [fontCSS, setFontCSS] = useState<string | null>(null);

  useEffect(() => {
    buildFontEmbedCSS().then(setFontCSS);
  }, []);

  const shareImage = useCallback(async () => {
    if (!elementRef.current || isSharing || !fontCSS) return;

    setIsSharing(true);
    const el = elementRef.current;
    try {
      // Temporarily make visible for capture
      el.style.opacity = "1";
      el.style.zIndex = "-1";

      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        fontEmbedCSS: fontCSS,
      });

      // Hide again
      el.style.opacity = "0";

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "student-loan-results.png", {
        type: "image/png",
      });

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Student Loan Repayment Results",
        });
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "student-loan-results.png";
        link.click();
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // User cancelled the share dialog
        return;
      }
      console.error("Failed to share image:", err);
    } finally {
      el.style.opacity = "0";
      setIsSharing(false);
    }
  }, [elementRef, isSharing, fontCSS]);

  return { shareImage, isSharing };
};
