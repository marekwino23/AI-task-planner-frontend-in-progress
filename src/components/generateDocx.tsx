import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel
} from "docx";

export const generateDocx = async (report: any, patient: any) => {


// const table = new Table({
//   rows: data.SNCS.map((nerve: any) =>
//     nerve.tests.map((test: any) =>
//       new TableRow({
//         children: [
//           new TableCell({
//             children: [new Paragraph(test.site || "-")],
//           }),
//           new TableCell({
//             children: [new Paragraph(String(test.CV_m_s ?? "-"))],
//           }),
//         ],
//       })
//     )
//   ).flat(),
// });

  const doc = new Document({
    sections: [
      {
        children: [

          new Paragraph({
            text: "RAPORT ENG/EMG",
            heading: HeadingLevel.HEADING_1,
          }),

          new Paragraph({
            text: " ",
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "Nazwisko: ", bold: true }),
              new TextRun(patient.surname || "-"),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({ text: "PESEL: ", bold: true }),
              new TextRun(patient.pesel || "-"),
            ],
          }),

          new Paragraph({
            text: " ",
          }),

          new Paragraph({
            text: "OPIS",
            heading: HeadingLevel.HEADING_2,
          }),

          new Paragraph(report.opis),

          new Paragraph({
            text: " ",
          }),

          new Paragraph({
            text: "WNIOSEK",
            heading: HeadingLevel.HEADING_2,
          }),

          new Paragraph(report.wniosek),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
};