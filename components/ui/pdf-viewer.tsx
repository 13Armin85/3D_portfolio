"use client";

import { useI18n } from "../locale-provider";
import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Minus, Plus, ScanLine } from "lucide-react";
import { MAX_PDF_ZOOM, MIN_PDF_ZOOM, usePdfZoom } from "./use-pdf-zoom";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Bundle the matching worker locally so résumé viewing needs no CDN connection.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

function ResumeDocument({ file }: { file: string }) {
  const { t } = useI18n();
  const [pages, setPages] = useState<{ width: number; height: number }[]>([]);
  const { viewport, width, zoom, zoomTo } = usePdfZoom();
  const pageWidth = width * zoom;
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    // Some PDFs contain empty Link tags with no text or destination. Preserve
    // actual annotations while keeping these inert tags out of link navigation.
    const normalizeStructure = () => {
      element
        .querySelectorAll('canvas span[role="link"]:empty')
        .forEach((tag) => tag.removeAttribute("role"));
    };
    const observer = new MutationObserver(normalizeStructure);
    observer.observe(element, { childList: true, subtree: true });
    normalizeStructure();
    return () => observer.disconnect();
  }, [viewport]);
  const fallback = (
    <p className="pdf-message" role="alert">
      {t("The preview could not load.")}{" "}
      <a href={file} target="_blank" rel="noopener noreferrer">
        {t("Open the original PDF")}{" "}
      </a>{" "}
      {t("or use the download button below.")}{" "}
    </p>
  );

  return (
    <div
      className="pdf-viewer"
      onKeyDown={(event) => {
        if (!["+", "=", "-", "0"].includes(event.key)) return;
        event.preventDefault();
        event.stopPropagation();
        zoomTo(
          event.key === "0" ? 1 : zoom + (event.key === "-" ? -0.25 : 0.25),
        );
      }}
    >
      <div
        className="pdf-toolbar"
        role="group"
        aria-label={t("Résumé zoom controls")}
      >
        <button
          type="button"
          onClick={() => zoomTo(zoom - 0.25)}
          disabled={zoom <= MIN_PDF_ZOOM}
          aria-label={t("Zoom out résumé")}
        >
          <Minus size={17} />
        </button>
        <output aria-label={t("Résumé zoom level")}>
          {Math.round(zoom * 100)}%
        </output>
        <button
          type="button"
          onClick={() => zoomTo(zoom + 0.25)}
          disabled={zoom >= MAX_PDF_ZOOM}
          aria-label={t("Zoom in résumé")}
        >
          <Plus size={17} />
        </button>
        <button
          type="button"
          onClick={() => zoomTo(1)}
          aria-label={t("Fit résumé to width")}
        >
          <ScanLine size={17} />
          <span>{t("Fit")}</span>
        </button>
        <span className="pdf-page-count">
          {pages.length
            ? `${pages.length} ${pages.length === 1 ? t("page") : t("pages")}`
            : "PDF"}
        </span>
      </div>
      <p className="pdf-hint">
        {t(
          "Pinch or Ctrl/⌘ + scroll to zoom. Scroll to explore; select text or tap links.",
        )}{" "}
      </p>
      <div
        className="pdf-viewport"
        ref={viewport}
        role="region"
        aria-label={t("Interactive résumé document")}
        tabIndex={0}
      >
        {width > 0 && (
          <Document
            file={file}
            suspense={false}
            externalLinkTarget="_blank"
            externalLinkRel="noopener noreferrer"
            onLoadSuccess={async (pdf) => {
              const sizes = await Promise.all(
                Array.from({ length: pdf.numPages }, async (_, index) => {
                  const page = await pdf.getPage(index + 1);
                  const size = page.getViewport({ scale: 1 });
                  return { width: size.width, height: size.height };
                }),
              );
              setPages(sizes);
            }}
            loading={
              <p className="pdf-message" role="status">
                {t("Loading résumé…")}{" "}
              </p>
            }
            error={fallback}
            className="pdf-document"
          >
            {width > 0 &&
              pages.map((page, index) => (
                <div
                  className="pdf-page"
                  key={index}
                  style={{
                    width: pageWidth,
                    height: (pageWidth * page.height) / page.width,
                  }}
                >
                  <div
                    style={{
                      width,
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                    }}
                  >
                    <Page
                      pageNumber={index + 1}
                      width={width}
                      // Render once at higher resolution, then scale all layers
                      // together so pinch/wheel gestures never clear the canvas.
                      devicePixelRatio={Math.min(3, 1800 / width)}
                      renderAnnotationLayer
                      renderTextLayer
                      onRenderAnnotationLayerSuccess={() => {
                        viewport.current
                          ?.querySelectorAll<HTMLAnchorElement>(
                            ".annotationLayer a[href]",
                          )
                          .forEach((link) => {
                            if (
                              !link.getAttribute("aria-label") &&
                              !link.textContent?.trim()
                            ) {
                              const href = link.getAttribute("href") ?? "";
                              link.setAttribute(
                                "aria-label",
                                href.startsWith("mailto:")
                                  ? `${t("Email")} ${href.slice(7)}`
                                  : `${t("Open")} ${href}`,
                              );
                            }
                          });
                      }}
                      loading={
                        <p className="pdf-message" role="status">
                          {t("Rendering page")} {index + 1}…
                        </p>
                      }
                      error={fallback}
                    />
                  </div>
                </div>
              ))}
          </Document>
        )}
      </div>
    </div>
  );
}

export default function PdfViewer({ file }: { file: string }) {
  return <ResumeDocument key={file} file={file} />;
}
