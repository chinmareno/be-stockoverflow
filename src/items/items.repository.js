const prisma = require("../configs/db.config");

const findItems = async () => {
  const items = await prisma.itemList.findMany();

  return items;
};

const findItemById = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return product;
};
