const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
     include: [{
        model: Category,
        attributes: ['id', 'category_name']
      },
    {
      model: Tag,
      attributes: ['id', 'tag_name']
    }]
  });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try{
    const productData = await Product.findByPk(req.params.id, {
        include: [{
          model: Category,
          attributes: ['category_name']
        },
        {
          model: Tag, 
          attributes: ['tag_name']
        }]
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with this ID'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

  // find a single product by its `id`
  // be sure to include its associated Category and Tag data


// create new product
router.post('/', async (req, res) => {
  try {const productData = await Product.create({
      product: req.body
    },
    {
      where: {
        product_name: req.body.product_name,
        price: req.body.price,
        stock: req.body.stock,
        tagIds: req.body.tagIds
      }
    }
    );
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  
  
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  });

  // router.put('/:id', (req, res) => {
  //   // update product data
  //   Product.update(req.body, {
  //     where: {
  //       id: req.params.id,
  //     },
  //   })
  //   .then((product) => {
  //     if (req.body.tagIds && req.body.tagIds.length) {
  //       const productTags = ProductTag.findAll({ where: { product_id: req.params.id } 
  //       });
  //       const productTagIds = productTags.map(({ tag_id }) => tag_id);
  //       // create filtered list of new tag_ids
  //       const newProductTags = req.body.tagIds
  //         .filter((tag_id) => !productTagIds.includes(tag_id))
  //         .map((tag_id) => {
  //           return {
  //             product_id: req.params.id,
  //             tag_id,
  //           };
  //         });
  //         // figure out which ones to remove
  //         const productTagsToRemove = productTags
  //           .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
  //           .map(({ id }) => id);
  
  //         // run both actions
  //           return Promise.all([
  //             ProductTag.destroy({ where: { id: productTagsToRemove } }),
  //             ProductTag.bulkCreate(newProductTags),
  //           ]);
  //         }
  
  //         return res.json(product);
  //     }) 
  //     .catch((err) => {
  //       // console.log(err);
  //       res.status(400).json(err);
  //     });
  // });
  
  
// update product
router.put('/:id', async (req, res) => {
  try{ const productData = await Product.update(
    req.body
  ,
  {
    where: {
      id: req.params.id,
    },
  })
  //   if (!productData) {
  //     res.status(404).json({messsage: 'Product not found for given ID'});
  //     return;
  //   }
  //   res.status(200).json(productData);
  // } catch (err) {
  //   res.status(500).json(err);
  // }
  // })
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = ProductTag.findAll({ where: { product_id: req.params.id } 
        });
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
        // create filtered list of new tag_ids
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => {
            return {
              product_id: req.params.id,
              tag_id,
            };
          });
          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
  
          // run both actions
            return Promise.all([
              ProductTag.destroy({ where: { id: productTagsToRemove } }),
              ProductTag.bulkCreate(newProductTags),
            ]);
          }
  
          return res.json(product);
      }) 
      if (!categoryData) {
        res.status(404).json({messsage: 'Category not found for given ID'});
        return;
      }
      res.status(200).json(categoryData);
    } catch (err) {
      res.status(500).json(err);
    }
    });
  

router.delete('/:id', async (req, res) => {
  try{
    const productData = await Product.destroy(
    {
      where: {
        id: req.params.id,
      },
    });
    if (!productData) {
      res.status(404).json({message: 'Product not found for given ID'});
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
  // delete one product by its `id` value
});

module.exports = router;
