import React, { useEffect, useState } from "react";
import { IProduct } from "./../../../../types/product.type";
import Product from "./../../Product/Product";
import SectionTitle from "./../../SectionTitle/SectionTitle";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper";

type PropsType = {
    products: IProduct[];
};
const NewArrivals = ({ products }: PropsType) => {
    const [productData, setProductData] = useState<IProduct[]>([]);

    useEffect(() => {
        setProductData(products);
    }, [products]);

    return (
        <div className="container pt-3 sm:py-8">
            <SectionTitle title="New Arrivals" />
            <div className="mt-8">
                <Swiper
                    slidesPerView={1}
                    navigation={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter:true
                    }}
                    modules={[Navigation, Autoplay]}
                    className="h-[515px] md:h-[545px] sm:h-[538px] new_arrivals_swiper"
                    breakpoints={{
                        640: {
                            slidesPerView: 1,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 15,
                        },
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                        },
                        1200: {
                            slidesPerView: 3,
                            spaceBetween: 25,
                        },
                    }}
                >
                    {productData?.map((product: IProduct) => (
                        <SwiperSlide key={product._id}>
                            <Product product={product} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default NewArrivals;
