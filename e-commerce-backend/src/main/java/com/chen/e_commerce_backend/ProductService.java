package com.chen.e_commerce_backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ProductService {

    private static final Logger logger =
            LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    private final Path uploadPath = Paths.get("uploads");

    private static final long MAX_IMAGE_SIZE =
            2L * 1024 * 1024;

    public ProductService(ProductRepository productRepository) {

        this.productRepository = productRepository;

        try {

            Files.createDirectories(uploadPath);

        } catch (IOException e) {

            throw new IllegalStateException(
                    "Could not create uploads folder",
                    e
            );
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public Product createProduct(ProductRequest request) {

        Product product = new Product();

        product.setName(request.getName());

        product.setDescription(request.getDescription());

        product.setCategory(request.getCategory());

        product.setPrice(request.getPrice());

        product.setQuantity(request.getQuantity());

        product.setCreatedBy(request.getCreatedBy());

        product.setSold(false);

        MultipartFile image = request.getImage();

        if (image != null && !image.isEmpty()) {

            validateImageSize(image);

            String imagePath = saveImage(image);

            product.setImageUrl(imagePath);
        }

        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {

        return productRepository.findById(id)
                .map(product -> {

                    product.setName(request.getName());

                    product.setDescription(request.getDescription());

                    product.setCategory(request.getCategory());

                    product.setPrice(request.getPrice());

                    product.setQuantity(request.getQuantity());

                    MultipartFile image = request.getImage();

                    if (image != null && !image.isEmpty()) {

                        validateImageSize(image);

                        if (product.getImageUrl() != null) {

                            deleteImageFile(product.getImageUrl());
                        }

                        String imagePath = saveImage(image);

                        product.setImageUrl(imagePath);
                    }

                    return productRepository.save(product);
                })
                .orElse(null);
    }

    private void validateImageSize(MultipartFile image) {

        if (image.getSize() > MAX_IMAGE_SIZE) {

            throw new IllegalArgumentException(
                    "Image file size must be 2MB or smaller."
            );
        }
    }

    public void deleteProduct(Long id) {

        Product product =
                productRepository.findById(id).orElse(null);

        if (product != null && product.getImageUrl() != null) {

            deleteImageFile(product.getImageUrl());
        }

        productRepository.deleteById(id);
    }

    private void deleteImageFile(String imageUrl) {

        try {

            String filename =
                    imageUrl.substring("/uploads/".length());

            Path filePath = uploadPath.resolve(filename);

            Files.deleteIfExists(filePath);

        } catch (IOException e) {

            logger.error(
                    "Could not delete image file: {}",
                    imageUrl
            );
        }
    }

    private String saveImage(MultipartFile image) {

        try {

            String originalFilename =
                    image.getOriginalFilename();

            String safeFilename =
                    System.currentTimeMillis()
                            + "-"
                            + originalFilename;

            Path filePath =
                    uploadPath.resolve(safeFilename);

            Files.copy(image.getInputStream(), filePath);

            return "/uploads/" + safeFilename;

        } catch (IOException e) {

            throw new IllegalStateException(
                    "Could not save image",
                    e
            );
        }
    }
}