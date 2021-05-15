const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagsData = await Tag.findAll({
      include: {
        model: Product,
      },
    });
    res.status(200).json(tagsData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try{
    const tagData = await Tag.findByPk(req.params.id, {
      include: {
        model: Product,
      }
    })
    res.status(200).json(tagData);
  } catch(e){
    res.status(500).json(e);
  }
});

/*
  {
    tag_name: "some tag",
    productIds: [1, 4, 5]
  }
*/

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tagData) => {
      if (req.body.productsIds.length) {
        const productIdArr = req.body.productsIds.map((product_id) => {
          return {
            product_id,
            tag_id: tagData.id,
          };
        });
        return ProductTag.bulkCreate(productIdArr);
      }
      res.status(200).json(tagData);
    })
    .then((productTagIds) => res.status(200).json(productTagIds)) 
    .catch(err => {
      res.status(500).json(err);
    });
});



router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((tag) => {
      return ProductTag.findAll({ where: { tag_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ product_id }) => product_id);
      const newProductTags = req.body.productsIds
        .filter((product_id) => !productTagIds.includes(product_id))
        .map((product_id) => {
          return {
            product_id,
            tag_id: req.params.id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ product_id }) => !req.body.productsIds.includes(product_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
