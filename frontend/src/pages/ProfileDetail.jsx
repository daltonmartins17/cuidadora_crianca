import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Heart, MapPin, Star, Mail, Award } from "lucide-react";
import { profileService, reviewService, messageService } from "../api/services";
import ReviewItem from "../components/ReviewItem";
import Loading from "../components/Loading";

const ProfileDetail = ({ userId }) => {
  const params = useParams();
  const profileId =
    userId ?? (params.profileId ? parseInt(params.profileId) : null);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState({ subject: "", content: "" });
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!profileId) {
      setLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await profileService.getProfile(profileId);
        setProfile(response.data);

        const reviewsResponse = await reviewService.getProfileReviews(
          response.data.id,
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [profileId]);

  const handleSendMessage = async () => {
    try {
      await messageService.sendMessage({
        receiverId: profile.userId,
        ...message,
      });
      setShowMessageForm(false);
      setMessage({ subject: "", content: "" });
      alert("Mensagem enviada com sucesso!");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Erro ao enviar mensagem",
      );
    }
  };

  const handleSubmitReview = async () => {
    if (!currentUser) {
      alert("Precisa estar autenticado para avaliar.");
      return;
    }

    if (!reviewData.title || !reviewData.comment) {
      alert("Preencha o título e o comentário da avaliação.");
      return;
    }

    setReviewLoading(true);
    try {
      await reviewService.createReview({
        profileId: profile.id,
        rating: reviewData.rating,
        title: reviewData.title,
        comment: reviewData.comment,
      });

      const reviewsResponse = await reviewService.getProfileReviews(profile.id);
      setReviews(reviewsResponse.data);
      setReviewSuccess(true);
      setReviewData({ rating: 5, title: "", comment: "" });
      setTimeout(() => setReviewSuccess(false), 2500);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Erro ao enviar avaliação",
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!profile)
    return (
      <div className="text-center py-12 text-gray-600">
        Perfil não encontrado
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl h-48 mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-[160px_minmax(0,1fr)] gap-8 items-start mb-8 -mt-20 relative z-10">
        <div className="w-full h-40 rounded-3xl overflow-hidden border border-white shadow-xl bg-white">
          <img
            src={profile.profileImageUrl || "https://via.placeholder.com/300"}
            alt={profile.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-between gap-6 lg:gap-0">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {profile.fullName}
            </h1>
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <MapPin size={20} />
              <span>
                {profile.city}, {profile.district}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex gap-1 star-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i < Math.round(profile.averageRating)
                          ? "fill-current"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  ({profile.totalReviews} avaliações)
                </span>
              </div>
            </div>
          </div>

          <div className="text-left lg:text-right">
            <div className="text-4xl font-bold text-purple-600 mb-4">
              €{profile.pricePerHour}/h
            </div>
            {profile.isAvailable && (
              <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold mb-4">
                Disponível
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main */}
        <div className="col-span-2 space-y-8">
          {/* Bio */}
          <section className="bg-white rounded-xl p-6 card-shadow">
            <h2 className="text-2xl font-bold mb-4">Sobre</h2>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </section>

          {/* Experiência */}
          <section className="bg-white rounded-xl p-6 card-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Award size={24} className="text-purple-600" />
              <h2 className="text-2xl font-bold">Experiência</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {profile.experience}
            </p>
          </section>

          {/* Certificações */}
          {profile.certifications && (
            <section className="bg-white rounded-xl p-6 card-shadow">
              <h2 className="text-2xl font-bold mb-4">Certificações</h2>
              <p className="text-gray-700 leading-relaxed">
                {profile.certifications}
              </p>
            </section>
          )}

          {/* Reviews */}
          <section className="bg-white rounded-xl p-6 card-shadow">
            <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
            {reviews.length > 0 ? (
              <div>
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Sem avaliações ainda.</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div>
          {/* Contact Card */}
          <div className="bg-white rounded-xl p-6 card-shadow sticky top-24">
            <button
              onClick={() => setShowMessageForm(true)}
              className="btn-primary w-full mb-4"
            >
              <Mail size={20} className="mx-auto" />
              Enviar Mensagem
            </button>

            {showMessageForm && (
              <div className="space-y-3 border-t pt-4">
                <input
                  type="text"
                  placeholder="Assunto"
                  value={message.subject}
                  onChange={(e) =>
                    setMessage({ ...message, subject: e.target.value })
                  }
                  className="input-field"
                />
                <textarea
                  placeholder="Mensagem"
                  value={message.content}
                  onChange={(e) =>
                    setMessage({ ...message, content: e.target.value })
                  }
                  rows="4"
                  className="input-field"
                ></textarea>
                <button
                  onClick={handleSendMessage}
                  className="btn-primary w-full text-sm"
                >
                  Enviar
                </button>
                <button
                  onClick={() => setShowMessageForm(false)}
                  className="btn-secondary w-full text-sm"
                >
                  Cancelar
                </button>
              </div>
            )}

            {currentUser && currentUser.id !== profile.userId && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-3">
                  Avaliar esta babá
                </h3>
                {currentUser.userType === "Parent" ? (
                  <div className="space-y-3">
                    {reviewSuccess && (
                      <div className="text-sm text-green-600 font-semibold">
                        Avaliação enviada com sucesso!
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nota
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={reviewData.rating}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            rating: parseInt(e.target.value, 10),
                          }))
                        }
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Título
                      </label>
                      <input
                        type="text"
                        value={reviewData.title}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Resumo rápido da sua avaliação"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Comentário
                      </label>
                      <textarea
                        value={reviewData.comment}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            comment: e.target.value,
                          }))
                        }
                        rows="4"
                        placeholder="Conte sobre a sua experiência com esta babá"
                        className="input-field"
                      ></textarea>
                    </div>
                    <button
                      onClick={handleSubmitReview}
                      disabled={reviewLoading}
                      className="btn-primary w-full"
                    >
                      {reviewLoading ? "A enviar..." : "Enviar Avaliação"}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600">
                    Apenas pais podem avaliar babás.
                  </p>
                )}
              </div>
            )}

            {/* Specializations */}
            {profile.specializations && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold mb-3">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.specializations.split(",").map((spec, i) => (
                    <span
                      key={i}
                      className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                    >
                      {spec.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
