/**
 * Usecase Document Generator
 * 
 * Generate DOCX files for usecases using docx library
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, WidthType, BorderStyle, AlignmentType, ImageRun } from 'docx';
import { Usecase } from '../data/usecases';

/**
 * Generate SVG diagram for a usecase and convert to image data URL
 */
async function generateUsecaseDiagramImage(usecase: Usecase): Promise<string> {
  // Extract system actions from steps
  const systemActions = usecase.steps
    .filter(step => step.toLowerCase().includes('hệ thống'))
    .slice(0, 3);

  // Create SVG string
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
      <!-- System boundary -->
      <rect x="200" y="50" width="350" height="300" fill="none" stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
      <text x="375" y="40" text-anchor="middle" font-size="12" font-weight="bold" fill="#333">Hệ thống</text>

      <!-- Actor (stick figure) -->
      <g transform="translate(80, 180)">
        <!-- Head -->
        <circle cx="0" cy="0" r="15" fill="none" stroke="#333" stroke-width="2"/>
        <!-- Body -->
        <line x1="0" y1="15" x2="0" y2="50" stroke="#333" stroke-width="2"/>
        <!-- Arms -->
        <line x1="-20" y1="30" x2="20" y2="30" stroke="#333" stroke-width="2"/>
        <!-- Legs -->
        <line x1="0" y1="50" x2="-15" y2="80" stroke="#333" stroke-width="2"/>
        <line x1="0" y1="50" x2="15" y2="80" stroke="#333" stroke-width="2"/>
        <!-- Label -->
        <text x="0" y="100" text-anchor="middle" font-size="11" font-weight="500" fill="#333">${usecase.actor}</text>
      </g>

      <!-- Main Use Case (ellipse) -->
      <ellipse cx="375" cy="200" rx="100" ry="40" fill="none" stroke="#6366f1" stroke-width="2"/>
      <text x="375" y="200" text-anchor="middle" font-size="11" font-weight="500" fill="#333" dominant-baseline="middle">
        ${usecase.title.length > 25 ? usecase.title.substring(0, 25) : usecase.title}
      </text>

      <!-- Connection line from actor to use case -->
      <line x1="110" y1="200" x2="275" y2="200" stroke="#333" stroke-width="2"/>

      <!-- Extended/Related Use Cases -->
      ${systemActions[0] ? `
        <ellipse cx="375" cy="100" rx="80" ry="30" fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="375" y="103" text-anchor="middle" font-size="10" fill="#666">
          ${systemActions[0].substring(0, 30)}...
        </text>
        <line x1="375" y1="160" x2="375" y2="130" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrowhead)"/>
        <text x="385" y="145" font-size="9" font-style="italic" fill="#666">«include»</text>
      ` : ''}

      ${systemActions[1] ? `
        <ellipse cx="375" cy="300" rx="80" ry="30" fill="none" stroke="#666" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="375" y="303" text-anchor="middle" font-size="10" fill="#666">
          ${systemActions[1].substring(0, 30)}...
        </text>
        <line x1="375" y1="240" x2="375" y2="270" stroke="#666" stroke-width="1" stroke-dasharray="3,3" marker-end="url(#arrowhead)"/>
        <text x="385" y="255" font-size="9" font-style="italic" fill="#666">«include»</text>
      ` : ''}

      <!-- Arrow marker definition -->
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#666"/>
        </marker>
      </defs>
    </svg>
  `;

  // Convert SVG to data URL
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      
      // Convert canvas to base64
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve('');
    };

    img.src = url;
  });
}

/**
 * Generate DOCX file for all usecases
 */
export async function generateAllUsecasesDocx(usecases: Usecase[]): Promise<void> {
  // Create document sections
  const sections: any[] = [];

  // Title page
  sections.push(
    new Paragraph({
      text: 'TÀI LIỆU USECASE',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: `Tổng số: ${usecases.length} usecases`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    new Paragraph({
      text: `Ngày tạo: ${new Date().toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
    })
  );

  // Table of Contents
  sections.push(
    new Paragraph({
      text: 'MỤC LỤC',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 300 },
    })
  );

  usecases.forEach((uc, idx) => {
    sections.push(
      new Paragraph({
        spacing: { after: 100 },
        children: [
          new TextRun({
            text: `${idx + 1}. `,
            bold: true,
          }),
          new TextRun({
            text: `${uc.id}`,
            bold: true,
            color: '2563eb',
          }),
          new TextRun({
            text: ` - ${uc.title}  `,
          }),
          new TextRun({
            text: `[${uc.priority.toUpperCase()}]`,
            color: uc.priority === 'high' ? 'ef4444' : uc.priority === 'medium' ? 'f59e0b' : '3b82f6',
            bold: true,
          }),
          new TextRun({
            text: ` [${uc.status.toUpperCase()}]`,
            color: uc.status === 'completed' ? '10b981' : uc.status === 'in-progress' ? 'f59e0b' : '6b7280',
            bold: true,
          }),
        ],
      })
    );
  });

  // Generate diagram images for all usecases first
  const diagramImages = await Promise.all(
    usecases.map(uc => generateUsecaseDiagramImage(uc))
  );

  // Usecases content
  for (let idx = 0; idx < usecases.length; idx++) {
    const uc = usecases[idx];

    // Page break before each usecase (except first)
    sections.push(
      new Paragraph({
        text: '',
        pageBreakBefore: idx > 0,
        spacing: { before: idx === 0 ? 600 : 0 },
      })
    );

    // Usecase title
    sections.push(
      new Paragraph({
        text: `${idx + 1}. ${uc.id}: ${uc.title}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 300 },
      })
    );

    // Main Usecase Description Table
    const mainTableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Use Case ID', bold: true })],
            width: { size: 25, type: WidthType.PERCENTAGE },
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: [new Paragraph(uc.id)],
            width: { size: 75, type: WidthType.PERCENTAGE },
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Tên Use Case', bold: true })],
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: [new Paragraph(uc.title)],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Tác nhân', bold: true })],
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: [new Paragraph(uc.actor)],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Mô tả chức năng', bold: true })],
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: [new Paragraph(uc.description)],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Điều kiện tiên quyết', bold: true })],
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: uc.preconditions.map(
              (cond) =>
                new Paragraph({
                  text: `- ${cond}`,
                  spacing: { after: 100 },
                })
            ),
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Yêu cầu', bold: true })],
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: uc.requirements && uc.requirements.length > 0
              ? uc.requirements.map(
                  (req) =>
                    new Paragraph({
                      text: `- ${req}`,
                      spacing: { after: 100 },
                    })
                )
              : [new Paragraph('—')],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: 'Kịch bản chính', bold: true })],
            shading: { fill: 'E8F4F8' },
          }),
          new TableCell({
            children: uc.steps.map(
              (step, stepIdx) =>
                new Paragraph({
                  text: `${stepIdx + 1}. ${step}`,
                  spacing: { after: 100 },
                })
            ),
          }),
        ],
      }),
    ];

    // Add Alternative Flows if exists
    if (uc.alternativeFlows && uc.alternativeFlows.length > 0) {
      mainTableRows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: 'Kịch bản phụ', bold: true })],
              shading: { fill: 'E8F4F8' },
            }),
            new TableCell({
              children: uc.alternativeFlows.map(
                (flow) =>
                  new Paragraph({
                    text: `- ${flow}`,
                    spacing: { after: 100 },
                  })
              ),
            }),
          ],
        })
      );
    }

    sections.push(
      new Table({
        rows: mainTableRows,
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
          left: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
          right: { style: BorderStyle.SINGLE, size: 6, color: '000000' },
          insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
          insideVertical: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC' },
        },
      }),
      new Paragraph({ text: '', spacing: { after: 400 } })
    );

    // Usecase Diagram (as image)
    sections.push(
      new Paragraph({
        text: 'Sơ đồ Use Case',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 200 },
      })
    );

    // Add diagram image if available
    const diagramDataUrl = diagramImages[idx];
    if (diagramDataUrl) {
      try {
        // Remove data URL prefix to get base64 data
        const base64Data = diagramDataUrl.split(',')[1];
        
        sections.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: Uint8Array.from(atob(base64Data), c => c.charCodeAt(0)),
                transformation: {
                  width: 450,
                  height: 300,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          })
        );
      } catch (error) {
        // Fallback to text if image generation fails
        sections.push(
          new Paragraph({
            text: `Actor: ${uc.actor} → Use Case: ${uc.title}`,
            spacing: { after: 400 },
          })
        );
      }
    }

    // Related APIs
    if (uc.relatedAPIs && uc.relatedAPIs.length > 0) {
      sections.push(
        new Paragraph({
          text: 'API liên quan',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 },
        })
      );
      uc.relatedAPIs.forEach(api => {
        sections.push(
          new Paragraph({
            text: `• ${api}`,
            spacing: { after: 100 },
          })
        );
      });
    }
  }

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections,
      },
    ],
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Usecases_Document_${new Date().getTime()}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}