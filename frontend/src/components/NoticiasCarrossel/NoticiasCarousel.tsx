import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Importa os estilos obrigatórios do Swiper
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export function NoticiasCarousel() {
  return (
    <div className="container my-5">
      <h2 className="text-center mb-4 titulo-carrosel" style={{ fontSize: '50px', color: '#333' }}>NOTÍCIAS</h2>
      
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="rounded-4 overflow-hidden shadow position-relative"
        style={{ borderRadius: '1rem' }}
      >
        {/* Slide 1 */}
        <SwiperSlide>
          <div className="position-relative">
            <img 
              src="https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80" 
              className="d-block w-100" 
              alt="Resgate de animais" 
              style={{ height: '450px', objectFit: 'cover' }} 
            />
            <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-dark bg-opacity-75 text-white m-3 rounded">
              <h5 className="fw-bold">Resgate de animais silvestres cresce no Brasil</h5>
              <p className="mb-0">Organizações ambientais registram aumento nas denúncias e salvamentos de fauna em áreas urbanas.</p>
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 2 */}
        <SwiperSlide>
          <div className="position-relative">
            <img 
              src="https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80" 
              className="d-block w-100" 
              alt="Proteção animal" 
              style={{ height: '450px', objectFit: 'cover' }} 
            />
            <div className="position-absolute bottom-0 start-0 end-0 p-4 bg-dark bg-opacity-75 text-white m-3 rounded">
              <h5 className="fw-bold">Novas leis de proteção à fauna entram em vigor</h5>
              <p className="mb-0">Saiba quais são as penalidades atualizadas para crimes contra animais silvestres e domésticos.</p>
            </div>
          </div>
        </SwiperSlide>

      </Swiper>
    </div>
  );
}