import { Document, Packer, Paragraph, TextRun } from 'docx';
import { saveAs } from 'file-saver';

export const createAndDownloadDocx = async (text: string, originalFileName: string) => {
  const paragraphs = text.split('\n').map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line)],
      })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  
  const docxFileName = `${originalFileName.split('.').slice(0, -1).join('.')}.docx`;

  saveAs(blob, docxFileName);
};
