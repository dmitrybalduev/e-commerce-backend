const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try{
    const categoryData = await Category.findAll({
      include: { model: Product }
    })
    res.status(200).json(categoryData);
  } catch(e){
    res.status(500).json(e);  
  }
  
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try{
    const categoryData = await Category.findByPk(req.params.id, {
      include: {model: Product}
    })
    res.status(200).json(categoryData);
  }catch(e){
    res.status(500).json(e);
  }
});

router.post('/', (req, res) => {  
  /*
    {
      "id": 1,
      "category_name": "Shirts"
    }
  */

  Category.create(req.body)
    .then((category) =>  res.status(201).json(category))
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try{
    const categoryData = await Category.update(req.body, {
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json(categoryData);
  }
  catch(err){
    res.status(400).json(err);
  }
  


});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try{
    const categoryData = await Category.destroy({
      where: {
        id: req.params.id
      }
    })
    if (!categoryData){
      res.status(404).json({message: 'No category found with this id!'});
      return;
    }
    res.json(categoryData);
  } catch(e){
    res.status(500).json(e);
  }
  
    
  
    
    
});

module.exports = router;
