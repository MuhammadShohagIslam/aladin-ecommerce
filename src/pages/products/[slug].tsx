import { useState, useEffect } from "react";
import _ from "lodash";
import { toast } from "react-hot-toast";
import { useStoreContext } from "@/lib/contexts/StoreContextProvider";
import { addToWishList, getWishList, removeWishList } from "@/api/user";
import { IProduct } from "../../../types/product.type";
import { StoreActionType } from "@/lib/states/storeReducer/storeReducer.type";
import CardZoomCarousel from "@/components/Card/CardZoomCarousel";
import { useRouter } from "next/router";
import { getProduct, relatedProducts } from "@/api/products";
import ProductDetailsTab from "../../components/Product/ProductDetailsTab";
import ProductInfo from "@/components/Product/ProductInfo/ProductInfo";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import RatingModal from "@/components/Modal/RatingModal/RatingModal";
import SectionTitle from "@/components/SectionTitle/SectionTitle";
import Product from "@/components/Product/Product";

type ProductDetailsParamsType = {
    params: {
        slug: string;
    };
};

type ProductDetailsPropType = {
    product: IProduct;
    relatedProducts: IProduct[];
};

const ProductDetails = ({
    product,
    relatedProducts,
}: ProductDetailsPropType) => {
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [selectedSize, setSelectedSize] = useState<string>("");
    const [heartFillIcon, setHeartFillIcon] = useState<boolean>(false);
    const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");
    const [star, setStar] = useState<number>(0);
    const { title, images, _id, slug } = product;
    const {
        state: { user, carts },
        dispatch,
    } = useStoreContext();

    const router = useRouter();

    useEffect(() => {
        if (user && user.token) {
            getWishList(user.token, _id).then((res) => {
                if (res.data.wishList.length > 0) {
                    setHeartFillIcon(true);
                }
            });
        }
    }, [user, _id]);

    useEffect(() => {
        if(carts.length){
            for (let i = 0; i < carts.length; i++) {
                if (carts[i]._id === _id) {
                    if(carts[i].color){
                        setSelectedColor(carts[i]?.color); 
                    }
                    if(carts[i].size){
                        setSelectedSize(carts[i]?.size); 
                    }
                }
            }
        }else{
            setSelectedColor("");
            setSelectedSize("");   
        }
    }, [_id, carts])

    const isAddToCart = carts.filter((cart: any) => cart._id === _id);
    const objProduct = {
        ...product,
    };
    const handleAddCart = () => {
        if (isAddToCart?.length <= 0) {
            let carts = [];
            if(selectedColor === ""){
               return toast.error("Select The Color")
            }
            if(selectedSize === ""){
               return toast.error("Select The Size")
            }
            if (typeof window !== "undefined") {
                if (window.localStorage.getItem("carts")) {
                    // checking already carts to the window localStorage
                    let cartsFromLocalStorage: string | null =
                        window.localStorage.getItem("carts");
                    if (cartsFromLocalStorage !== null) {
                        carts = JSON.parse(cartsFromLocalStorage);
                    }
                }
            }
            // push carts into carts array
            carts.push({
                ...objProduct,
                count: 1,
                color:selectedColor,
                size:selectedSize,
            });

            // remove duplicates value
            const uniqueCarts = _.uniqWith(carts, _.isEqual);

            // set data local storage
            window.localStorage.setItem("carts", JSON.stringify(uniqueCarts));

            dispatch({
                type: StoreActionType.ADD_TO_CART,
                payload: uniqueCarts,
            });
            toast.success("Product Added To The Carts");
        } else {
            toast.error("Product Already Added To The Cart");
        }
    };
    console.log(selectedColor, selectedSize,carts)

    const handleAddToWishList = () => {
        if (user && user.token) {
            if (heartFillIcon) {
                removeWishList(user.token, _id).then((res) => {
                    setHeartFillIcon(false);
                    toast.error("Product Removed To The WishList");
                });
            } else {
                addToWishList(user.token, _id, true).then((res) => {
                    setHeartFillIcon(true);
                    toast.success("Product Added To The WishList");
                });
            }
        } else {
            router.push(`/auth/login?redirect=/products/${slug}`);
        }
    };

    const handleReviewShowModal = () => {
        if (user && user?.email) {
            setShowReviewModal((prev) => !prev);
            return;
        }
        return router.push(`/auth/login?redirect=products/${slug}`);
    };
    const handleClickRating = (newRating: number) => {
        setStar(newRating);
    };

    const handleReviewSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        try {
            event.preventDefault();
            setComment("");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <MainLayout>
            <div className="bg-white container mt-10">
                <div className="grid grid-cols-2 sm:grid-cols-1 pt-6">
                    {/* Image gallery */}
                    <div className="z-10">
                        {product &&
                        title &&
                        product.images &&
                        product.images.length ? (
                            <CardZoomCarousel images={images} title={title} />
                        ) : (
                            <h2>No Image On The Product</h2>
                        )}
                    </div>

                    {/* Product info */}
                    <div className="mx-auto max-w-7xl relative">
                        <ProductInfo
                            product={product}
                            selectedColor={selectedColor}
                            setSelectedColor={setSelectedColor}
                            selectedSize={selectedSize}
                            setSelectedSize={setSelectedSize}
                            handleAddCart={handleAddCart}
                            handleAddToWishList={handleAddToWishList}
                            heartFillIcon={heartFillIcon}
                            isAddToCart={isAddToCart}
                        />
                    </div>
                </div>

                {/* Product Details Tab */}
                <div className="mt-10">
                    <ProductDetailsTab
                        product={product}
                        handleReviewShowModal={handleReviewShowModal}
                    />
                </div>

                {/* Related Product */}
                <section className="mt-10">
                    <SectionTitle title="Related Products" />
                    <div>
                        {relatedProducts && relatedProducts.length < 1 ? (
                            <p className="text-center text-xl text-primary">
                                No Product Found By The {product.title}
                            </p>
                        ) : (
                            <div className="grid  mt-5 gap-5 grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                                {relatedProducts &&
                                    relatedProducts.length &&
                                    relatedProducts.slice(0,3).map((product: IProduct) => (
                                        <Product
                                            key={product._id}
                                            product={product}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/*Show Rating Modal */}
            {showReviewModal && (
                <RatingModal
                    productName={title}
                    handleReviewSubmit={handleReviewSubmit}
                    setShowReviewModal={setShowReviewModal}
                    showReviewModal={showReviewModal}
                    handleClickRating={handleClickRating}
                    setComment={setComment}
                    star={star}
                />
            )}
        </MainLayout>
    );
};

export async function getServerSideProps({ params }: ProductDetailsParamsType) {
    const { data } = await getProduct(params.slug);
    const { data: relatedProductsData } = await relatedProducts(data._id);
    return {
        props: {
            product: data,
            relatedProducts: relatedProductsData,
        },
    };
}

export default ProductDetails;
