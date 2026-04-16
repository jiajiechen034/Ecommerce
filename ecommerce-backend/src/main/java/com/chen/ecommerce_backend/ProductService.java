package com.chen.ecommerce_backend;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final Path uploadPath = Paths.get("uploads");

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;

        try {
            Files.createDirectories(uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create uploads folder", e);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(String name, String description, Double price, MultipartFile image) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);

        if (image != null && !image.isEmpty()) {
            String imagePath = saveImage(image);
            product.setImageUrl(imagePath);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, String name, String description, Double price, MultipartFile image) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(name);
                    product.setDescription(description);
                    product.setPrice(price);

                    if (image != null && !image.isEmpty()) {
                        String imagePath = saveImage(image);
                        product.setImageUrl(imagePath);
                    }

                    return productRepository.save(product);
                })
                .orElse(null);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    private String saveImage(MultipartFile image) {
        try {
            String originalFilename = image.getOriginalFilename();
            String safeFilename = System.currentTimeMillis() + "-" + originalFilename;
            Path filePath = uploadPath.resolve(safeFilename);

            Files.copy(image.getInputStream(), filePath);

            return "/uploads/" + safeFilename;
        } catch (IOException e) {
            throw new RuntimeException("Could not save image", e);
        }
    }
}