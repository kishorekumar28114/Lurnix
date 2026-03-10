import jsPDF from "jspdf";

export function downloadAsTXT(text: string, filename: string = "translation.txt") {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function downloadAsPDF(text: string, filename: string = "translation.pdf") {
    // Use jsPDF for PDF generation
    const doc = new jsPDF();

    // Split the text to fit the page width (standard A4 width minus margins)
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width - margin * 2;
    const lines = doc.splitTextToSize(text, pageWidth);

    // Add text to the PDF
    doc.text(lines, margin, margin + 10);

    doc.save(filename);
}
