const { jsPDF } = require('jspdf')
const autoTable = require('jspdf-autotable').default

function generateReport(title, headers, data){

    let pdfBuffer

    // Configurações padrão
        const defaultOptions = {
            orientation: 'portrait',
            margin: 10,
            headStyles: {
                fillColor: [61, 101, 155],  // Azul corporativo
                textColor: [255, 255, 255], // Texto branco
                fontStyle: 'bold',
                fontSize: 12
            },
            bodyStyles: {
                textColor: [0, 0, 0],       // Texto preto
                fontSize: 10
            },
            alternateRowStyles: {
                fillColor: [240, 240, 240]  // Cinza claro para linhas alternadas
            }
        };

        const mergedOptions = {...defaultOptions}

        const doc = new jsPDF({
            orientation: defaultOptions.orientation,
            unit: 'mm'
        })

        //Adding a title
        doc.setFontSize(18)
        doc.setTextColor(40, 40, 40)
        doc.text(title, defaultOptions.margin, defaultOptions.margin + 10)

        //Correct way to generate the table is using autoTable
        autoTable(doc, {
            startY: defaultOptions.margin + 20,
            head: [headers],
            body: data,
            margin: { 
                top: mergedOptions.margin + 20,
                left: mergedOptions.margin,
                right: mergedOptions.margin
            },
            headStyles: mergedOptions.headStyles,
            bodyStyles: mergedOptions.bodyStyles,
            alternateRowStyles: mergedOptions.alternateRowStyles,
            didDrawPage: (data) => {
                // Rodapé com número da página
                const str = `Página ${data.pageNumber}`;
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text(
                    str,
                    doc.internal.pageSize.width - mergedOptions.margin - doc.getTextWidth(str),
                    doc.internal.pageSize.height - mergedOptions.margin + 5
                );

                pdfBuffer = Buffer.from(doc.output('arraybuffer'));
                
            }
            
        })

                return pdfBuffer

}

module.exports = generateReport