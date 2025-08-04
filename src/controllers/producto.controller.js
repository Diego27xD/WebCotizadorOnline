const { prisma } = require("../config/config");
const {
  productSchema,
  updateProductSchema,
  categorySchema,
} = require("../schemas/product.schema");

const getProducts = async (req, res) => {
  try {
    const result = await prisma.product.findMany({
      where: {
        estado: true,
      },
      include: {
        categoria: true,
      },
      orderBy: {
        fechaCreacion: "asc",
      },
    });
    res.status(200).json({
      header: {
        ok: true,
        message: "Operation was successful",
        status: 200,
      },
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { nombre, precio, stock, imagen, IdCategoria } = req.body;

    const { error, value } = productSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        header: {
          ok: false,
          message: error.details[0]?.message,
          status: 400,
        },
      });
    }

    const product = await prisma.product.findFirst({
      where: {
        nombre: nombre,
      },
    });
    if (product) {
      return res.status(409).json({
        header: {
          ok: false,
          message: "El producto ya ha sido creado!",
          status: 409,
        },
      });
    }

    if (IdCategoria) {
      const category = await prisma.category.findFirst({
        where: { IdCategoria: +IdCategoria },
      });

      if (!category) {
        return res.status(409).json({
          header: {
            ok: false,
            message: "La categoría indicada no existe!",
            status: 409,
          },
        });
      }
    }

    const result = await prisma.product.create({
      data: {
        imagen,
        precio,
        IdCategoria,
        nombre,
        stock,
      },
      select: {
        IdProducto: true,
        nombre: true,
      },
    });

    res.status(201).json({
      header: {
        ok: true,
        message: "Operation was successfully",
        status: 201,
      },
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { IdProducto } = req.params;

    const isValidProcess = await prisma.product.findFirst({
      where: { IdProducto: +IdProducto },
    });

    if (!isValidProcess) {
      return res.status(404).json({
        header: {
          ok: false,
          message: "Producto no encontrado",
          status: 404,
        },
      });
    }

    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        header: {
          ok: false,
          message: error.details[0]?.message,
          status: 400,
        },
      });
    }
    if (req.body.IdCategoria) {
      const category = await prisma.category.findFirst({
        where: { IdCategoria: +req.body.IdCategoria },
      });

      if (!category) {
        return res.status(409).json({
          header: {
            ok: false,
            message: "La categoría indicada no existe!",
            status: 409,
          },
        });
      }
    }

    const result = await prisma.product.update({
      where: { IdProducto: Number(IdProducto) },
      data: {
        ...req.body,
      },
    });

    res.status(201).json({
      header: {
        ok: true,
        message: "The record was successfully updated",
        status: 201,
      },
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const findProductoById = async (req, res) => {
  try {
    const { IdProducto } = req.params;
    const isValidProcess = await prisma.product.findFirst({
      where: { IdProducto: +IdProducto },
      include: { categoria: true },
    });

    if (!isValidProcess) {
      return res.status(404).json({
        header: {
          ok: false,
          message: "Producto no encontrado",
          status: 404,
        },
      });
    }

    res.status(200).json({
      header: {
        ok: true,
        message: "Operation was successfully",
        status: 200,
      },
      data: isValidProcess,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { IdProducto } = req.params;
    const isValidProcess = await prisma.product.findFirst({
      where: { IdProducto: +IdProducto },
    });

    if (!isValidProcess) {
      return res.status(404).json({
        header: {
          ok: false,
          message: "Producto no encontrado",
          status: 404,
        },
      });
    }

    await prisma.product.delete({
      where: { IdProducto: Number(IdProducto) },
    });

    res.status(201).json({
      header: {
        ok: true,
        message: "The record was successfully deleted",
        status: 201,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const crearCategory = async (req, res) => {
  try {
    const { nombre, imagen } = req.body;
    const { error, value } = categorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        header: {
          ok: false,
          message: error.details[0]?.message,
          status: 400,
        },
      });
    }

    const category = await prisma.category.findFirst({
      where: { nombre: nombre },
    });

    if (category) {
      return res.status(409).json({
        header: {
          ok: false,
          message: "La categoría ya ha sido creada!",
          status: 409,
        },
      });
    }

    const result = await prisma.category.create({
      data: {
        imagen,
        nombre,
      },
    });
    res.status(201).json({
      header: {
        ok: true,
        message: "Operation was successfully",
        status: 201,
      },
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const listarCategorias = async (req, res) => {
  try {
    const result = await prisma.category.findMany({
      include: { productos: true },
    });
    res.status(200).json({
      header: {
        ok: true,
        message: "Operation was successful",
        status: 200,
      },
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};

const findCategoryById = async (req, res) => {
  try {
    let { IdCategoria } = req.query;

    if (!IdCategoria) {
      return res.status(400).json({
        header: {
          ok: false,
          message: "Necesitas pasar el IdCategoria",
          status: 400,
        },
      });
    }

    const result = await prisma.category.findFirst({
      where: {
        IdCategoria: +IdCategoria,
      },
      include: {
        productos: true,
      },
    });

    if (!result) {
      return res.status(404).json({
        header: {
          ok: false,
          message: "Categoría no encontrada",
          status: 404,
        },
      });
    }

    res.status(200).json({
      header: {
        ok: true,
        message: "Operation was successfully",
        status: 200,
      },
      data: result,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      header: {
        ok: false,
        message: "The operation had an error",
        status: 500,
      },
    });
  }
};
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductoById,
  crearCategory,
  listarCategorias,
  findCategoryById,
};
