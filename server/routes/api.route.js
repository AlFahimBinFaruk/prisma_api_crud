const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//Get all products
router.get("/", async (req, res, next) => {
  const product = await prisma.product.findMany({
    //also give the category that the product is belogs to
    include: { category: true },
  });
  res.json(product);
});

//Get all categories
router.get("/categories", async (req, res, next) => {
  const categories = await prisma.category.findMany({
    //also give the product that have this category
    include: { product: true },
  });
  res.json(categories);
});

//get single product
router.get("/details/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
      include: { category: true },
    });

    return res.json(product);
  } catch (error) {
    next(error);
  }
});

//Create new product
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    // First Way
    const product = await prisma.product.create({
      data: {
        name: data.name,
        price: Number(data.price),
        qty: Number(data.qty),
        categoryId: Number(data.categoryId),
      },
    });
    //Second Way
    // const product=await prisma.product.create({
    //   data:req.body,
    // });
    res.json(product);
  } catch (error) {
    next(error);
  }
});

//update product
router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;
    //Update the types
    if (data.price) {
      data.price = Number(data.price);
    }
    if (data.qty) {
      data.qty = Number(data.qty);
    }
    if (data.categoryId) {
      data.categoryId = Number(data.categoryId);
    }
    const updatedProduct = await prisma.product.update({
      where: {
        id: id,
      },
      data: data,
      include: {
        category: true,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});
//delete product
router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const deletedProduct = await prisma.product.delete({
      where: {
        id: id,
      },
      include: { category: true },
    });

    return res.json(deletedProduct);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
