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

    @CrossOrigin(origins = "*") // Allow all origins for image serving
    @GetMapping("/{id}/image")
    public org.springframework.http.ResponseEntity<byte[]> getGalleryImage(@PathVariable Long id) {
        GalleryItem item = galleryRepository.findById(id).orElse(null);
        if (item != null && item.getImageData() != null) {
            return org.springframework.http.ResponseEntity.ok()
                    .contentType(org.springframework.http.MediaType.parseMediaType(
                            item.getImageContentType() != null ? item.getImageContentType() : "image/jpeg"))
                    .body(item.getImageData());
        }
        return org.springframework.http.ResponseEntity.notFound().build();
    }

    @PostMapping
    public GalleryItem createGalleryItem(
            @RequestParam("image") MultipartFile image,
            @RequestParam(value = "caption", required = false) String caption,
            @RequestParam("category") String category,
            @RequestParam(value = "subCategory", required = false) String subCategory) throws java.io.IOException {

        GalleryItem item = new GalleryItem();
        item.setCaption(caption != null ? caption : "");
        item.setCategory(category);
        item.setSubCategory(subCategory != null ? subCategory : "General");

        if (image != null && !image.isEmpty()) {
            item.setImageData(image.getBytes());
            item.setImageContentType(image.getContentType());
        }

        GalleryItem savedItem = galleryRepository.save(item);
        if (savedItem.getImageData() != null) {
            savedItem.setImageUrl("/api/gallery/" + savedItem.getId() + "/image");
            return galleryRepository.save(savedItem);
        }

        return savedItem;
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
