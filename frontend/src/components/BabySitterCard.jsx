import React, { useState, useEffect } from "react";
import { Heart, MapPin, Star, MessageSquare } from "lucide-react";

const BabySitterCard = ({ babysitter, onContact, onFavorite }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    onFavorite?.(babysitter.id);
  };

  return (
    <div className="hover-lift bg-white rounded-xl overflow-hidden card-shadow">
      {/* Imagem do Perfil */}
      <div className="relative h-48 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
        <img
          src={babysitter.profileImageUrl || "https://via.placeholder.com/300"}
          alt={babysitter.fullName}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handleFavorite}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
        >
          <Heart
            size={20}
            className={
              isFavorited ? "fill-red-500 text-red-500" : "text-gray-300"
            }
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {babysitter.fullName}
        </h3>

        <div className="flex items-center gap-2 mb-2 text-gray-600">
          <MapPin size={16} />
          <span className="text-sm">
            {babysitter.city}, {babysitter.district}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="star-rating">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(babysitter.averageRating)
                    ? "fill-current"
                    : "text-gray-300"
                }
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({babysitter.totalReviews})
          </span>
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {babysitter.bio}
        </p>

        {/* Preço */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-purple-600">
            €{babysitter.pricePerHour}/h
          </span>
          {babysitter.isAvailable && (
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
              Disponível
            </span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => onContact(babysitter)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <MessageSquare size={16} />
          Contactar
        </button>
      </div>
    </div>
  );
};

export default BabySitterCard;
