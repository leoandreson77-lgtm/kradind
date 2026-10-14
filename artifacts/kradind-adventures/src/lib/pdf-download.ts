/**
 * Direct PDF Downloader using dynamic html2pdf.js
 * Automatically loads html2pdf from CDN without SSR issues, converts the target DOM element to a high-res PDF,
 * and triggers a direct browser file download without opening the print dialog.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string = "KRADIND-Proposal.pdf"
): Promise<boolean> {
  if (typeof window === "undefined" || !element) return false;

  // Ensure html2pdf is loaded
  if (!(window as any).html2pdf) {
    await new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById("html2pdf-cdn-script");
      if (existingScript) {
        if ((window as any).html2pdf) {
          resolve();
        } else {
          existingScript.addEventListener("load", () => resolve());
          existingScript.addEventListener("error", () => reject(new Error("Failed to load html2pdf script")));
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "html2pdf-cdn-script";
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.crossOrigin = "anonymous";
      script.referrerPolicy = "no-referrer";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load html2pdf script from CDN"));
      document.head.appendChild(script);
    });
  }

  const html2pdf = (window as any).html2pdf;
  if (!html2pdf) {
    throw new Error("html2pdf library could not be initialized");
  }

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename.endsWith(".pdf") ? filename : `${filename}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  await html2pdf().set(opt).from(element).save();
  return true;
}
