import React, { useState } from 'react';

const PhotoUpload = ({ onPhotoUpload }) => {
  const [photoPreview, setPhotoPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        onPhotoUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      {photoPreview ? (
        <img src={photoPreview} alt="Preview" className="photo-preview" />
      ) : (
        <div className="placeholder-text">Фото</div>
      )}
      <label className="photo-label" htmlFor="photoUpload">
        Загрузить
      </label>
      <input
        type="file"
        id="photoUpload"
        accept="image/*"
        onChange={handlePhotoChange}
      />
    </div>
  );
};

export default PhotoUpload;