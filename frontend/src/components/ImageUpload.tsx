import React, { useState, useRef } from 'react';
import { Upload, X, Star, GripVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

interface ImageUploadProps {
  productId: number;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
  maxImages?: number;
}

export function ImageUpload({ productId, images, onImagesChange, maxImages = 10 }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid image file.`,
          variant: "destructive",
        });
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 5MB.`,
          variant: "destructive",
        });
      }
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    if (images.length + validFiles.length > maxImages) {
      toast({
        title: "Too many images",
        description: `You can only upload up to ${maxImages} images.`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = validFiles.map(async (file, index) => {
        const isPrimary = images.length === 0 && index === 0; // First image is primary if no images exist
        const altText = file.name.replace(/\.[^/.]+$/, ""); // Remove file extension
        
        return await api.uploadProductImage(productId, file, altText, isPrimary);
      });

      const uploadedImages = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedImages];
      onImagesChange(newImages);

      toast({
        title: "Images uploaded successfully",
        description: `${validFiles.length} image(s) have been uploaded.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    try {
      await api.deleteProductImage(productId, imageId);
      const newImages = images.filter(img => img.id !== imageId);
      onImagesChange(newImages);
      
      toast({
        title: "Image deleted",
        description: "The image has been removed.",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      await api.setPrimaryImage(productId, imageId);
      const newImages = images.map(img => ({
        ...img,
        is_primary: img.id === imageId
      }));
      onImagesChange(newImages);
      
      toast({
        title: "Primary image updated",
        description: "The primary image has been changed.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update primary image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Upload Product Images</h3>
            <p className="text-muted-foreground mb-4">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports JPG, PNG, WebP up to 5MB each. Maximum {maxImages} images.
            </p>
            <Button 
              onClick={openFileDialog}
              disabled={isUploading || images.length >= maxImages}
              variant="outline"
            >
              {isUploading ? 'Uploading...' : 'Select Images'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              aria-label="Select product images"
            />
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Product Images ({images.length}/{maxImages})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images
              .sort((a, b) => a.order - b.order)
              .map((image) => (
                <Card key={image.id} className="relative group">
                  <CardContent className="p-2">
                    <div className="aspect-square relative overflow-hidden rounded-md">
                      <img
                        src={image.image}
                        alt={image.alt_text}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSetPrimary(image.id)}
                          disabled={image.is_primary}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Primary badge */}
                      {image.is_primary && (
                        <Badge className="absolute top-2 left-2" variant="default">
                          <Star className="h-3 w-3 mr-1" />
                          Primary
                        </Badge>
                      )}

                      {/* Order indicator */}
                      <Badge className="absolute top-2 right-2" variant="secondary">
                        <GripVertical className="h-3 w-3 mr-1" />
                        {image.order}
                      </Badge>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {image.alt_text}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
