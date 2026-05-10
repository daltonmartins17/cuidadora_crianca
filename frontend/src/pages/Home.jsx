import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Shield, Award, ArrowRight } from "lucide-react";

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="gradient-primary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Cuide das Suas Crianças com Confiança
              </h1>
              <p className="text-xl text-purple-100 mb-8">
                Encontre babás profissionais e confiáveis perto de si,
                verificadas e avaliadas pela comunidade.
              </p>
              <div className="flex gap-4">
                {user ? (
                  <>
                    <button
                      onClick={() => navigate("/search")}
                      className="btn-primary flex items-center gap-2"
                    >
                      Procurar Babás
                      <ArrowRight size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/register")}
                      className="btn-primary text-lg px-8 py-3 shadow-xl"
                    >
                      Começar Agora
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      className="px-8 py-3 rounded-lg border-2 border-white bg-white/25 text-white font-semibold hover:bg-white hover:text-purple-600 transition-all duration-300 shadow-xl"
                    >
                      Entrar
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center">
              <div className="text-7xl">👨‍👩‍👧‍👦</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Por que nos escolher?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Verificado",
                desc: "Todos os cuidadores são verificados",
              },
              {
                icon: Award,
                title: "Avaliados",
                desc: "Avaliações reais de pais confiantes",
              },
              {
                icon: Users,
                title: "Comunidade",
                desc: "Uma comunidade de cuidadores profissionais",
              },
              {
                icon: Heart,
                title: "Confiável",
                desc: "Segurança e qualidade garantidas",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-xl p-6 text-center hover-lift"
              >
                <feature.icon
                  size={40}
                  className="mx-auto text-purple-600 mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold mb-2">2,500+</div>
            <p className="text-purple-100">Cuidadores Profissionais</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">15,000+</div>
            <p className="text-purple-100">Famílias Satisfeitas</p>
          </div>
          <div>
            <div className="text-5xl font-bold mb-2">4.8★</div>
            <p className="text-purple-100">Avaliação Média</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Junte-se a milhares de pais que confiam em cuidadores
              profissionais da nossa plataforma.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="btn-primary text-lg px-8 py-4"
            >
              Criar Conta Grátis
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
