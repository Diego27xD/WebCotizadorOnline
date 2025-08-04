const { prisma } = require("../config/config");
const mammoth = require("mammoth");
const { format } = require("date-fns");
const { Paragraph, TextRun, patchDocument, PatchType } = require("docx");
const libre = require("libreoffice-convert");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const path = require("path");
const fs = require("fs");
libre.convertAsync = require("util").promisify(libre.convert);

// Obtener todas las cotizaciones
const getCotizaciones = async (req, res) => {
  try {
    const result = await prisma.cotizacion.findMany({
      include: {
        cliente: true,
        Servicios: true,
      },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    const clientes = await prisma.cliente.findMany();
    res.render("cotizacion", {
      listaCotizacion: result,
      listaClientes: clientes,
    });
  } catch (error) {
    console.error("Error al obtener cotizaciones:", error);
    res.status(500).send("Error interno");
  }
};

// Crear cotización con servicios y repuestos
const crearCotizaciones = async (req, res) => {
  try {
    const {
      IdCliente,
      TipoMoneda,
      FormaPago,
      validezOferta,
      servicios = [],
    } = req.body;

    console.log(servicios);

    // Calcular subtotal
    const subtotal = servicios.reduce((acc, s) => {
      const cantidad = parseInt(s.cantidad) || 0;
      const monto = parseInt(s.monto) || 0;
      return acc + cantidad * monto;
    }, 0);

    const igv = Math.round(subtotal * 0.18);
    const montoTotal = subtotal + igv;

    const nuevaCotizacion = await prisma.cotizacion.create({
      data: {
        IdCliente: parseInt(IdCliente),
        TipoMoneda,
        FormaPago,
        validezOferta: parseInt(validezOferta),
        subtotal,
        igv,
        montoTotal,
        Servicios: {
          create: servicios.map((s) => ({
            TipoServicio: s.TipoServicio,
            nombreServicio: s.nombreServicio,
            cantidad: parseInt(s.cantidad),
            monto: parseInt(s.monto),
            NroParte: s.NroParte || null,
          })),
        },
      },
    });

    res.status(201).json({ success: true, cotizacion: nuevaCotizacion });
  } catch (error) {
    console.error("Error al crear cotización:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};

// Eliminar cotización y sus servicios
const eliminarCotizaciones = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.servicios.deleteMany({
      where: { IdCotizacion: parseInt(id) },
    });

    await prisma.cotizacion.delete({
      where: { IdCotizacion: parseInt(id) },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al eliminar cotización:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};

const verDetalleCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const cotizacion = await prisma.cotizacion.findUnique({
      where: { IdCotizacion: parseInt(id) },
      include: {
        cliente: true,
        Servicios: true,
      },
    });

    console.log(cotizacion);
    if (!cotizacion) {
      return res
        .status(404)
        .json({ success: false, message: "Cotización no encontrada" });
    }

    res.json({ success: true, cotizacion });
  } catch (error) {
    console.error("Error al obtener detalle:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};

const downloadPDFCotizacion = async (req, res) => {
  try {
    const { IdCotizacion } = req.params;

    const result = await prisma.cotizacion.findFirst({
      where: { IdCotizacion: +IdCotizacion },
      include: {
        cliente: true,
        Servicios: true,
      },
    });

    const listServicios = result.Servicios.map((s, index) => ({
      ...s,
      total: s.cantidad * s.monto,
      item: index + 1,
      NroParte: s.NroParte || 0,
    }));

    const templatePath = path.join(
      __dirname,
      "../../layout/Plantilla_Cotizacion_Oficial.docx"
    );
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render({
      razon_social: result.cliente.razonSocial,
      documento: result.cliente.documento,
      pago: result.FormaPago,
      direccion: result.cliente.direccion || "Sin dirección",
      plazo: result.validezOferta,
      telefono: result.cliente.telefono || "",
      moneda: result.TipoMoneda,
      correo: result.cliente.correoElectronico || "",
      oferta: result.validezOferta,
      fecha: format(new Date(result.fechaCreacion), "dd-MM-yyyy"),
      subtotal: result.subtotal.toFixed(2),
      igv: result.igv.toFixed(2),
      total: result.montoTotal.toFixed(2),
      items: listServicios,
    });

    const docxBuffer = doc.getZip().generate({ type: "nodebuffer" });
    const docxPath = path.join(__dirname, "../../output-docx/cotizacion.docx");
    const pdfOutputDir = path.join(__dirname, "../../output-pdf");
    fs.writeFileSync(docxPath, docxBuffer);

    const pdfFileName = path.basename(docxPath, ".docx") + ".pdf";
    const pdfPath = path.join(pdfOutputDir, pdfFileName);

    const docxBufferSave = fs.readFileSync(docxPath);

    const pdfBuffer = await libre.convertAsync(
      docxBufferSave,
      ".pdf",
      undefined
    );

    fs.writeFileSync(pdfPath, pdfBuffer);

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({
        error: "Error en la conversión, el archivo PDF no fue creado" + pdfPath,
      });
    }
    let nombreFile = `cotizacion_${result.cliente.razonSocial}_${format(
      new Date(result.fechaCreacion),
      "dd-MM-yyyy"
    )}.pdf`;

    res.download(pdfPath, nombreFile, (err) => {
      fs.unlink(docxPath, () => {});
      fs.unlink(pdfPath, () => {});
      if (err) {
        console.error("Error al enviar el archivo:", err);
      }
    });
  } catch (error) {
    console.error("Error generando cotización:", error);
    res.status(500).send("Error generando cotización");
  }
};

// Actualizar cotización (opcional)
const actualizacionCotizaciones = async (req, res) => {
  try {
    const { id } = req.params;
    const { TipoMoneda, FormaPago, validezOferta, servicios = [] } = req.body;

    await prisma.cotizacion.update({
      where: { IdCotizacion: parseInt(id) },
      data: {
        TipoMoneda,
        FormaPago,
        validezOferta: parseInt(validezOferta),
        fechaActualizacion: new Date(),
      },
    });

    // Eliminar servicios anteriores
    await prisma.servicios.deleteMany({
      where: { IdCotizacion: parseInt(id) },
    });

    // Crear nuevos servicios
    await prisma.servicios.createMany({
      data: servicios.map((s) => ({
        TipoServicio: s.TipoServicio,
        nombreServicio: s.nombreServicio,
        cantidad: parseInt(s.cantidad),
        monto: parseInt(s.monto),
        NroParte: s.NroParte || null,
        IdCotizacion: parseInt(id),
        fechaCreacion: new Date(),
        fechaActualizacion: new Date(),
      })),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error al actualizar cotización:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};

module.exports = {
  getCotizaciones,
  crearCotizaciones,
  eliminarCotizaciones,
  actualizacionCotizaciones,
  verDetalleCotizacion,
  downloadPDFCotizacion,
};
