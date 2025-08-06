import { Router } from "express";  
import { upload } from "../utils.js";
import __dirname from "../utils.js";
import { ProductRepository } from "../repositories/product.repository.js";
import path from 'path';

const router = Router();
const productRepo = new ProductRepository(); 

router.post('/', upload.single('thumbnail'), async (req, res) => {
    if (!req.file) res.status(400).json({error: 'No se subio ningun archivo'});
    
    const product = req.body;
    const result = await productRepo.create({
        ...product, 
        thumbnail: path.resolve(__dirname + '/public/img', req.file.filename)
    });

    res.status(201).json({ payload: result});
});

router.get('/', async (req, res) => {
  try {
    const { limit = 6, page = 1, sort = '', ...query } = req.query;
    const sortOptions = {
      asc: { price: 1 },
      desc: { price: -1 }
    };
    const products = await productRepo.paginate(
    { ...query },
      {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sortOptions[sort] || {},
        customLabels: { docs: 'payload' }
      }
    );
    res.status(200).json({ ...products });
  } 
  catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const productFindedById = await productRepo.getById(id);
    
    if (!productFindedById) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ payload: productFindedById });
  });
  
router.put("/:id", upload.single("thumbnail"), async (req, res) => {
    const { body, params } = req;
    const { id } = params;
    const product = body;
    const productUpdated = await productRepo.update(id, {
      ...product,
      ...(req?.file?.path && { thumbnail: req.file.path }),
    }, { new: true });
  
    res.status(200).json({ message: "Producto actualizado con exito", payload: productUpdated });
  });
  
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const productDeleted = await productRepo.delete(id);

    if (!productDeleted) return res.status(404).json({ message: "Producto no encontrado" });
  
    res.status(200).json({ payload: productDeleted });
  });

router.get('/productsDetail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Error: No se proporcionó un ID de producto.");
    }
    const product = await productRepo.getById(id);
    if (!product) {
      return res.status(404).send("Producto no encontrado.");
    }
    const discount = (product.price * 0.85).toFixed(2);
    res.render('productsDetail', { product, discount });
  
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).send("Error al obtener el producto aca");
  }
});

export default router;