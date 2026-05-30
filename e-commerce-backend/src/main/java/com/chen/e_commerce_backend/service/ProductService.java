package com.chen.e_commerce_backend.service;

import com.chen.e_commerce_backend.dto.request.ProductRequest;
import com.chen.e_commerce_backend.model.Product;
import com.chen.e_commerce_backend.repository.ProductRepository;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    private final Cloudinary cloudinary;

    private static final long MAX_IMAGE_SIZE =
            2L * 1024 * 1024;

    public ProductService(
            ProductRepository productRepository,
            Cloudinary cloudinary
    ) {

        this.productRepository = productRepository;
        this.cloudinary = cloudinary;
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

            String imageUrl = uploadImage(image);

            product.setImageUrl(imageUrl);
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

                        String imageUrl = uploadImage(image);

                        product.setImageUrl(imageUrl);
                    }

                    return productRepository.save(product);
                })
                .orElse(null);
    }

    public void deleteProduct(Long id) {

        productRepository.deleteById(id);
    }

    private void validateImageSize(MultipartFile image) {

        if (image.getSize() > MAX_IMAGE_SIZE) {

            throw new IllegalArgumentException(
                    "Image file size must be 2MB or smaller."
            );
        }
    }

    private String uploadImage(MultipartFile image) {

        try {

            Map uploadResult =
                    cloudinary.uploader().upload(
                            image.getBytes(),
                            ObjectUtils.asMap(
                                    "folder",
                                    "ecommerce-products"
                            )
                    );

            return uploadResult
                    .get("secure_url")
                    .toString();

        } catch (IOException e) {

            throw new IllegalStateException(
                    "Could not upload image",
                    e
            );
        }
    }
}