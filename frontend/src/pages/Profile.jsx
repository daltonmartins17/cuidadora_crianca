import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProfileDetail from "./ProfileDetail";
import EditProfile from "./EditProfile";
import { profileService } from "../api/services";
import Loading from "../components/Loading";

const Profile = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  const handleProfileCreated = (profile) => {
    setCurrentProfile(profile);
    setLoadingProfile(false);
  };

  const handleProfileUpdated = async () => {
    try {
      const response = await profileService.getUserProfile(user.id);
      setCurrentProfile(response.data);
      setShowEdit(false);
    } catch (error) {
      console.error("Erro ao recarregar perfil após atualização:", error);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!profileId) {
      if (user.userType !== "BabySitter") {
        setLoadingProfile(false);
        return;
      }

      const loadProfile = async () => {
        try {
          const response = await profileService.getUserProfile(user.id);
          setCurrentProfile(response.data);
        } catch {
          setCurrentProfile(null);
        } finally {
          setLoadingProfile(false);
        }
      };

      loadProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [profileId, user, navigate]);

  if (!user) {
    return null;
  }

  if (!profileId) {
    if (loadingProfile) {
      return <Loading />;
    }

    if (user.userType !== "BabySitter") {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
          <div className="bg-white rounded-2xl card-shadow p-10 text-center max-w-xl">
            <h1 className="text-3xl font-bold mb-4">
              Página reservada para cuidadoras
            </h1>
            <p className="text-gray-600 mb-6">
              Apenas contas do tipo <strong>Cuidadora</strong> podem criar e
              editar perfis.
            </p>
            <button onClick={() => navigate("/search")} className="btn-primary">
              Ir para Pesquisar Babás
            </button>
          </div>
        </div>
      );
    }

    if (currentProfile) {
      if (showEdit) {
        return (
          <EditProfile
            profile={currentProfile}
            onProfileUpdated={handleProfileUpdated}
          />
        );
      }

      return (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex justify-end mb-6">
            <button onClick={() => setShowEdit(true)} className="btn-primary">
              Editar Perfil
            </button>
          </div>
          <ProfileDetail userId={currentProfile.id} />
        </div>
      );
    }

    return <CreateProfile onProfileCreated={handleProfileCreated} />;
  }

  return <ProfileDetail userId={parseInt(profileId)} />;
};

// Componente para criar novo perfil
const CreateProfile = ({ onProfileCreated }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    location: "",
    city: "",
    district: "",
    pricePerHour: "",
    bio: "",
    experience: "",
    certifications: "",
    isAvailable: true,
    specializations: "",
  });
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profileImageUrl || "");
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

      const response = await profileService.createProfile(formDataToSend);
      setSuccess(true);
      onProfileCreated?.(response.data);
      setTimeout(() => navigate(`/profile/${response.data.id}`), 1500);
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Erro ao criar perfil";
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
        <h1 className="text-3xl font-bold mb-8">
          Criar Meu Perfil como Cuidadora
        </h1>

        {success ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600">
              Perfil criado com sucesso!
            </h2>
            <p className="text-gray-600">Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
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

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Rua das Flores, nº 123"
                  required
                  className="input-field"
                />
              </div>

              {/* City */}
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

              {/* District */}
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

              {/* Photo Upload */}
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

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço/Hora (€)
                </label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  placeholder="15"
                  required
                  step="0.50"
                  className="input-field"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sobre Mim
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Fale sobre si, sua paixão por crianças, etc..."
                rows="4"
                required
                className="input-field"
              ></textarea>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experiência
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Descreva sua experiência em cuidados infantis..."
                rows="4"
                required
                className="input-field"
              ></textarea>
            </div>

            {/* Certifications */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Certificações
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
                placeholder="Ex: Primeiros Socorros, CPR, etc..."
                rows="3"
                className="input-field"
              ></textarea>
            </div>

            {/* Specializations */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Especialidades
              </label>
              <input
                type="text"
                name="specializations"
                value={formData.specializations}
                onChange={handleChange}
                placeholder="Ex: Crianças com necessidades especiais, Educação bilingue, etc (separadas por vírgula)"
                className="input-field"
              />
            </div>

            {/* Availability */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Estou disponível agora</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Criando perfil..." : "Criar Perfil"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
