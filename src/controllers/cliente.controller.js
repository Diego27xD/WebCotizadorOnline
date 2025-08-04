const { prisma } = require("../config/config");

const crearCliente = async (req, res) => {
  try {
    console.log(req.body);
    const {
      IdTipoDocumento,
      razonSocial,
      documento,
      direccion,
      telefono,
      correoElectronico,
      IdCliente,
    } = req.body;
    // Verificar documento duplicado
    const existe = await prisma.cliente.findFirst({
      where: {
        documento,
        ...(IdCliente ? { NOT: { IdCliente: parseInt(IdCliente) } } : {}),
      },
    });

    if (existe) {
      return res.status(400).json({ error: "Documento duplicado" });
    }

    await prisma.cliente.create({
      data: {
        IdTipoDocumento: parseInt(IdTipoDocumento),
        razonSocial,
        documento,
        direccion,
        telefono,
        correoElectronico,
      },
    });

    res.status(201).json({ message: "Cliente creado" });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const actualizarCliente = async (req, res) => {
  try {
    const {
      IdCliente,
      IdTipoDocumento,
      razonSocial,
      documento,
      direccion,
      telefono,
      correoElectronico,
    } = req.body;

    // Verificar documento duplicado
    const existe = await prisma.cliente.findFirst({
      where: {
        documento,
        ...(IdCliente ? { NOT: { IdCliente: parseInt(IdCliente) } } : {}),
      },
    });

    if (existe) {
      return res.status(400).json({ error: "Documento duplicado" });
    }

    await prisma.cliente.update({
      where: { IdCliente: parseInt(IdCliente) },
      data: {
        IdTipoDocumento: parseInt(IdTipoDocumento),
        razonSocial,
        documento,
        direccion,
        telefono,
        correoElectronico,
        fechaActualizacion: new Date(),
      },
    });

    res.status(200).json({ message: "Cliente actualizado" });
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

const listarClientes = async (req, res) => {
  try {
    const result = await prisma.cliente.findMany({
      include: { TipoDocumento: true },
      orderBy: {
        fechaCreacion: "desc",
      },
    });

    res.render("cliente", { listaClientes: result });
  } catch (error) {
    console.error("Error al listar clientes:", error);
    res.status(500).send("Error interno");
  }
};

const eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.cliente.delete({
      where: { IdCliente: parseInt(id) },
    });

    res.status(200).json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

module.exports = {
  actualizarCliente,
  listarClientes,
  eliminarCliente,
  crearCliente,
};
