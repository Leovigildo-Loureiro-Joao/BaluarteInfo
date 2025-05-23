
import { useEffect, useState } from "react";
import InfiniteCarousel from "../../Carrosel/InfiniteCarrosel"
import { activi, artigo, quemsomos, salvacao } from "../../../assets/Assets";


const Carrosel = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const extendedImages = [...images, ...images];
    useEffect(() => {
        if (currentIndex >= images.length) {
          setTimeout(() => setCurrentIndex(0), 100);
        }
      }, [currentIndex]);
    return (
        <div className="flex overflow-hidden">
            <div 
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                {extendedImages.map((img, idx) => (
                    <img key={idx} src={img} className="w-full flex-shrink-0" />
                ))}
                </div>
        </div>
    );
}

export const Galeria=()=>{

    const images = [
        activi,
        quemsomos,
        artigo,
        salvacao,
        quemsomos,
      ];
      


    return  <div>
                <div>
                    <div className="h2-title sec py-5">
                        <h1>Galeria de fotos</h1>
                    </div>
                </div>
                <section className="flex flex-col justify-center items-center">
                    <InfiniteCarousel images={images }/>
                </section>
            </div>
}