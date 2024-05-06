import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { MdCompareArrows } from "react-icons/md";
import { AiFillHeart } from "react-icons/ai";
import { BsFillCartPlusFill } from "react-icons/bs";
import { IoIosEye } from "react-icons/io";
import { Link } from "react-router-dom";

import CustomModal from "../../Atoms/Modal/CustomModal";
import SaveProductModal from "../../Molecules/Modal/SaveProductModal";
import CompareProductInfo from "../../Molecules/Products/CompareProductInfo";
import ProductCartPreview from "./ProductCartPreview";
import ProductView from "./ProductView";

import numberWithCommas from "../../../utils/numberWithCommas";
import ValidateImage from "../../Atoms/ValidateImage";
import useAuthData from "../../../hooks/useAuthData";
import TooltipButton from "../Button/TooltipButton/TooltipButton";

import { useAddWishlistMutation } from "../../../store/service/wishlist/wishlistApiService";
import { useGetSingleUserQuery } from "../../../store/service/user/userApiService";

const ProductCard = ({ product = {} }) => {
    const [addWishList] = useAddWishlistMutation();
    const dispatch = useDispatch();
    const { name, price, discount, slug, imageURLs, quantity } = product;

    const discountPrice = Math.ceil(price * (discount / 100));
    const netPrice = Math.ceil(price - discountPrice);

    const { user } = useAuthData();
    const { data, refetch } = useGetSingleUserQuery({
        id: user?._id,
    });

    const userWishLists = data?.data?.wishList || [];
    const wishListProduct = userWishLists.find(
        (wishList) => wishList?.productId?._id === product?._id
    );

    const [modalOpen, setModalOpen] = useState(false);
    const [productView, setProductView] = useState(false);
    const [saveProductModalOpen, setSaveProductModalOpen] = useState(false);
    const [compareModalOpen, setCompareModalOpen] = useState(false);

    const manageWishListProduct = async (id) => {
        await addWishList(id).then((res) => {
            if (res?.data?.success) {
                toast.success(res?.data?.message, {
                    duration: 5000,
                });
                refetch();
            } else {
                toast.error(res?.error?.data?.errorMessages?.[0]?.message, {
                    duration: 5000,
                });
            }
        });
    };

    const handleAddCart = () => {
        setModalOpen((prevState) => !prevState);
    };

    const makeProductTitle = (name) => {
        const removeSpace = name?.replace(/\s/g, "_");
        return removeSpace;
    };

    const title = makeProductTitle(name);
    return (
        <>
            <div className="bg-white rounded-md py-2  shadow-md cursor-pointer hover:shadow-lg transition duration-300 group relative  z-20 overflow-hidden">
                {/* product image */}
                <div className="py-4 relative">
                    <Link
                        className="w-full inline-block"
                        to={`/product/${title}`}
                    >
                        <ValidateImage
                            imageUrl={imageURLs?.[0]}
                            className="mx-auto w-full h-full cursor-pointer hover:opacity-90 p-1 rounded-lg hover:transform hover:scale-100 transition duration-300 overflow:hidden"
                            alt={name}
                        />
                    </Link>

                    <div className="absolute bottom-0 w-full  opacity-0 group-hover:opacity-100 transition-opacity duration-300  bg-black/10 z-10">
                        <div className="flex gap-2 py-1 px-0 transition-all group-hover:px-6 justify-between items-center duration-300">
                            <TooltipButton
                                id="product-view"
                                content="Product View"
                            >
                                <button
                                    onClick={() => setProductView(!productView)}
                                >
                                    <IoIosEye className={`text-2xl `} />
                                </button>
                            </TooltipButton>

                            <TooltipButton
                                id="add-to-cart"
                                content="Add to cart"
                            >
                                {quantity ? (
                                    <button onClick={() => handleAddCart()}>
                                        <BsFillCartPlusFill className="text-2xl" />
                                    </button>
                                ) : (
                                    <button>
                                        <BsFillCartPlusFill className="text-2xl" />
                                    </button>
                                )}
                            </TooltipButton>

                            <TooltipButton
                                id="add-to-wishlist"
                                content="Add to wishlist"
                                className={`${
                                    wishListProduct
                                        ? ""
                                        : "text-white bg-green-400"
                                }`}
                            >
                                <button
                                    onClick={() =>
                                        manageWishListProduct(product?._id)
                                    }
                                >
                                    <AiFillHeart className={`text-2xl `} />
                                </button>
                            </TooltipButton>
                            <TooltipButton
                                id="add-to-compare"
                                content="Add to Compare"
                                tooltipPlacement="top-end"
                            >
                                <button
                                    onClick={() => {
                                        setCompareModalOpen((prev) => !prev);
                                        dispatch(addToCompare({ ...product }));
                                    }}
                                >
                                    <MdCompareArrows className="text-2xl" />
                                </button>
                            </TooltipButton>
                        </div>
                    </div>
                </div>

                <div className="pt-3 px-4 pb-3">
                    <div className="h-[80px]">
                        <Link
                            to={`/product/${slug}`}
                            className="text-xs lg:text-[15px] text-primaryBlack font-bold hover:text-primary hover:underline"
                            title={name}
                        >
                            {name?.length > 35
                                ? name.slice(0, 35) + "..."
                                : name}
                            {/* {name} */}
                        </Link>
                        <>
                            {data?.discount ? (
                                <div className="flex items-center gap-3">
                                    {/* net price */}
                                    <p className="text-lg text-primary font-bold">
                                        {numberWithCommas(netPrice)}৳
                                    </p>
                                    {/* price */}
                                    <del className="text-sm text-textGray">
                                        {numberWithCommas(price)}৳
                                    </del>
                                </div>
                            ) : (
                                <p className="text-lg text-primary font-bold">
                                    {numberWithCommas(price)}৳
                                </p>
                            )}
                        </>
                    </div>
                </div>

                {discount > 0 && (
                    <p className="bg-primary w-fit px-2 py-0.5 text-white font-semibold text-xs rounded-r-md absolute top-3 left-0">
                        {
                            <span>
                                {numberWithCommas(discountPrice)}৳ Discount on
                                Online Order
                            </span>
                        }
                    </p>
                )}
            </div>

            {productView && (
                <CustomModal isOpen={productView}>
                    <ProductView
                        product={product}
                        setProductView={setProductView}
                    />
                </CustomModal>
            )}
            {saveProductModalOpen && (
                <CustomModal isOpen={setSaveProductModalOpen}>
                    <SaveProductModal
                        onCloseSaveProductModal={setSaveProductModalOpen}
                        savedProductInfo={{
                            data: {
                                name: product?.name,
                                id: product?._id,
                            },
                        }}
                        isProductExist={wishListProduct}
                    />
                </CustomModal>
            )}
            {modalOpen && (
                <CustomModal isOpen={modalOpen}>
                    <ProductCartPreview
                        product={product}
                        handleClose={() => setModalOpen((prev) => !prev)}
                    />
                </CustomModal>
            )}
            {compareModalOpen && (
                <CustomModal isOpen={compareModalOpen}>
                    <CompareProductInfo
                        onCloseCompareModal={() =>
                            setCompareModalOpen((prev) => !prev)
                        }
                        compareProductName={product?.name}
                    />
                </CustomModal>
            )}
        </>
    );
};

export default ProductCard;
