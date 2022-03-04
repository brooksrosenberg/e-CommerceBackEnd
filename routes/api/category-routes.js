const router = require('express').Router();
const { Category, Product } = require('../../models');


// get all products
router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: {
        model: Product,
        attributes: ['product_name']
      },
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a single product by id
router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: {
        model: Product,
        attributes: ['category_id']
      },
    });
    if (!categoryData) {
      res.status(404).json({messsage: 'Category not found for given ID'});
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create a new category
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
  });
  
//update
router.put('/:id', async (req, res) => {
  try {const categoryData = await Category.update({
      category_name: req.body.category_name
  },
  {
    where: {
      id: req.params.id
    }
  });
  if (!categoryData) {
    res.status(404).json({messsage: 'Category not found for given ID'});
    return;
  }
  res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});

//delete
router.delete('/:id', async (req, res) => {
  try{
  const categoryData = await Category.destroy(
  {
    where: {
      id: req.params.id,
    },
  });
  if (!categoryData) {
    res.status(404).json({message: 'Category not found for given ID'});
    return;
  }
  res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});


module.exports = router;
