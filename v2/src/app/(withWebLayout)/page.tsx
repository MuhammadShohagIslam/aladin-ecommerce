import { Suspense } from "react";

import { getListOfBlogs } from "@/api/blog";
import { getCategories } from "@/api/category";
import { getProductsByFilter } from "@/api/products";
import { getAllSubCategories } from "@/api/sub-categories";

import Advertise from "@/components/Oraganisms/Advertise/Advertise";
import Blogs from "@/components/Oraganisms/Blogs/Blogs";
import Categories from "@/components/Oraganisms/Categories";
import FeaturedSubCategories from "@/components/Oraganisms/Home/FeaturedSubCategories";
import FlashDeals from "@/components/Oraganisms/Home/FlashDeals";
import FollowUsSocial from "@/components/Oraganisms/Home/FollowUsSocial";
import FunFactArea from "@/components/Oraganisms/Home/FunFactArea";
import Hero from "@/components/Oraganisms/Home/Hero";
import SmallProductSlider from "@/components/Oraganisms/Home/SmallProductSlider";
import FeaturedProducts from "@/components/Oraganisms/Products/FeaturedProducts";
import NewArrivals from "@/components/Oraganisms/Products/NewArrivals";
import TopProducts from "@/components/Oraganisms/Products/TopProducts";
import Services from "@/components/Oraganisms/Services";
import CategoriesSkeleton from "@/components/Oraganisms/Skeletons/Home/CategoriesSkeleton";
import CategoryBaseProducts from "@/components/Oraganisms/Skeletons/Home/CategoryBaseProducts";
import FlashDealsSkeleton from "@/components/Oraganisms/Skeletons/Home/FlashDealsSkeleton";
import HeroSkeleton from "@/components/Oraganisms/Skeletons/Home/HeroSkeleton";
import NewArrivalsSkeleton from "@/components/Oraganisms/Skeletons/Home/NewArrivalsSkeleton";
import SubCategoriesSkeleton from "@/components/Oraganisms/Skeletons/Home/SubCategoriesSkeleton";
import TopProductsSkeleton from "@/components/Oraganisms/Skeletons/Home/TopProductsSkeleton";
import ProductsSkeleton from "@/components/Oraganisms/Skeletons/Products/Products";

const Home = async () => {
    // Initiate both requests in parallel
    const blogsData = getListOfBlogs({ limit: 3 });
    const productsData = getProductsByFilter({ limit: 0 });
    const categoriesData = getCategories({ limit: 4 });
    const subCategoriesData = getAllSubCategories({ limit: 4 });

    // Wait for the promises to resolve
    const [products, blogs, categories, subCategories] = await Promise.all([
        productsData,
        blogsData,
        categoriesData,
        subCategoriesData,
    ]);

    return (
        <>
            <Suspense fallback={<HeroSkeleton />}>
                <Hero products={products.data?.data} />
            </Suspense>

            <Services />

            <Suspense fallback={<CategoriesSkeleton />}>
                <Categories data={categories.data?.data} />
            </Suspense>

            <Suspense fallback={<FlashDealsSkeleton />}>
                <FlashDeals products={products?.data?.data} />
            </Suspense>

            <Suspense fallback={<ProductsSkeleton />}>
                <FeaturedProducts products={products?.data?.data} />
            </Suspense>

            <Advertise />

            <Suspense fallback={<TopProductsSkeleton />}>
                <TopProducts products={products?.data?.data} />
            </Suspense>

            <Suspense fallback={<NewArrivalsSkeleton />}>
                <NewArrivals products={products?.data?.data} />
            </Suspense>

            <Suspense fallback={<CategoryBaseProducts />}>
                <SmallProductSlider
                    title="Best Food"
                    products={products?.data?.data}
                    className="lg:py-8 md:py-16 py-12"
                />
            </Suspense>

            <FunFactArea />

            <Suspense fallback={<CategoryBaseProducts />}>
                <SmallProductSlider
                    title="Best Clothes"
                    products={products?.data?.data}
                    className="lg:py-28 md:py-16 py-12 "
                />
            </Suspense>

            <Suspense fallback={<SubCategoriesSkeleton />}>
                <FeaturedSubCategories />
            </Suspense>

            <Suspense fallback={<ProductsSkeleton />}>
                <Blogs blogs={blogs?.data?.data} />
            </Suspense>

            <Suspense fallback={<SubCategoriesSkeleton />}>
                <FollowUsSocial products={products?.data?.data} />
            </Suspense>
        </>
    );
};

export default Home;
