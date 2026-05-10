import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, MapPin, Euro } from "lucide-react";
import { profileService } from "../api/services";
import BabySitterCard from "../components/BabySitterCard";
import Loading from "../components/Loading";

const Search = () => {
  const navigate = useNavigate();
  const [babySitters, setBabySitters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    maxPrice: "",
  });

  const handleSearch = async (e = null) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await profileService.searchBabySitters({
        city: filters.city || undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      });
      setBabySitters(response.data);
    } catch (error) {
      console.error("Erro ao pesquisar:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="gradient-primary text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">
            Procure Babás Profissionais
          </h1>
          <p className="text-purple-100">
            Encontre cuidadores confiáveis perto de si
          </p>
        </div>
      </div>

      {/* Search Form */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-xl card-shadow p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cidade
              </label>
              <div className="relative">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Ex: Lisboa"
                  value={filters.city}
                  onChange={(e) =>
                    setFilters({ ...filters, city: e.target.value })
                  }
                  className="input-field input-field-icon"
                />
              </div>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preço Máximo/h
              </label>
              <div className="relative">
                <Euro className="input-icon" size={18} />
                <input
                  type="number"
                  placeholder="Ex: 20"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value })
                  }
                  className="input-field input-field-icon"
                  step="0.50"
                />
              </div>
            </div>

            {/* Button */}
            <div className="flex items-end">
              <button
                type="submit"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <SearchIcon size={18} />
                Pesquisar
              </button>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setFilters({ city: "", maxPrice: "" });
                  setBabySitters([]);
                }}
                className="btn-secondary w-full"
              >
                Limpar
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        {loading ? (
          <Loading />
        ) : babySitters.length > 0 ? (
          <div>
            <p className="text-gray-600 mb-6">
              Encontrados <strong>{babySitters.length}</strong> babás
              disponíveis
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {babySitters.map((babysitter) => (
                <div
                  key={babysitter.id}
                  onClick={() => navigate(`/profile/${babysitter.id}`)}
                >
                  <BabySitterCard
                    babysitter={babysitter}
                    onContact={() => navigate(`/profile/${babysitter.id}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhuma babá encontrada com os filtros selecionados.
            </p>
            <button onClick={() => handleSearch()} className="btn-primary mt-4">
              Ver Todas as Babás
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
