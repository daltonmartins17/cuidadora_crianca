import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { profileService } from "../api/services";
import Loading from "../components/Loading";

const EditProfile = ({ profile, onProfileUpdated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: profile.fullName || "",
    location: profile.location || "",
    city: profile.city || "",
    district: profile.district || "",
    pricePerHour: profile.pricePerHour || "",
    bio: profile.bio || "",
    experience: profile.experience || "",
    certifications: profile.certifications || "",
    isAvailable: profile.isAvailable ?? true,
    specializations: profile.specializations || "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    profile.profileImageUrl || "",
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("FullName", formData.fullName);
      formDataToSend.append("Location", formData.location);
      formDataToSend.append("City", formData.city);
      formDataToSend.append("District", formData.district);
      formDataToSend.append("PricePerHour", formData.pricePerHour.toString());
      formDataToSend.append("Bio", formData.bio);
      formDataToSend.append("Experience", formData.experience);
      formDataToSend.append("Certifications", formData.certifications);
      formDataToSend.append(
        "IsAvailable",
        formData.isAvailable ? "true" : "false",
      );
      formDataToSend.append("Specializations", formData.specializations);
      if (profileImageFile) {
        formDataToSend.append("ProfileImage", profileImageFile);
      }

      await profileService.updateProfile(profile.id, formDataToSend);
      setSuccess(true);
      onProfileUpdated?.();
      setTimeout(() => navigate(`/profile/${profile.id}`), 1500);
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Erro ao atualizar perfil";
      alert(
        typeof serverMessage === "string"
          ? serverMessage
          : JSON.stringify(serverMessage),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl card-shadow p-8">
        <h1 className="text-3xl font-bold mb-8">Editar Meu Perfil</h1>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600">
              Perfil atualizado com sucesso!
            </h2>
            <p className="text-gray-600">Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Ex: Maria Santos"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Localização
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Lisboa, Portugal"
                  required
                  className="input-field"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Foto do Perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  className="input-field"
                />
                {previewImage && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={previewImage}
                      alt="Pré-visualização da foto"
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Lisboa"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Distrito
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="Ex: Lisboa"
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço por Hora (€)
                </label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  placeholder="Ex: 15.00"
                  step="0.01"
                  min="0"
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Biografia
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Conte um pouco sobre você..."
                rows="4"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experiência
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Descreva sua experiência..."
                rows="3"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Certificações
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="Liste suas certificações..."
                rows="3"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Especializações
              </label>
              <input
                type="text"
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                placeholder="Ex: Cuidados infantis, atividades educativas"
                className="input-field"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4 text-purple-600"
              />
              <label className="text-sm font-semibold text-gray-700">
                Disponível para trabalho
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? <Loading /> : "Atualizar Perfil"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
