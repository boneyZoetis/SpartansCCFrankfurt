package com.spartans.cricket.controller;

import com.spartans.cricket.model.GalleryItem;
import com.spartans.cricket.repository.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@CrossOrigin(origins = "http://localhost:5173")
public class GalleryController {

    @Autowired
    private GalleryRepository galleryRepository;

    @GetMapping
    public List<GalleryItem> getAllGalleryItems() {
        return galleryRepository.findAll();
    }

    @PostMapping
    public GalleryItem createGalleryItem(
            @RequestParam("image") MultipartFile image,
            @RequestParam("caption") String caption,
            @RequestParam("category") String category) throws java.io.IOException {
        // Create uploads directory if not exists
        String uploadDir = "./uploads/";
        java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
        if (!java.nio.file.Files.exists(uploadPath)) {
            java.nio.file.Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String filename = java.util.UUID.randomUUID().toString() + "_" + image.getOriginalFilename();
        java.nio.file.Path filePath = uploadPath.resolve(filename);

        // Save file
        java.nio.file.Files.copy(image.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);

        // Create item with URL - save relative path
        String fileUrl = "/uploads/" + filename;
        GalleryItem item = new GalleryItem(category, fileUrl, caption);

        return galleryRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGalleryItem(@PathVariable Long id) {
        if (galleryRepository.existsById(id)) {
            galleryRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
