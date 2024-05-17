"use client";

import { useState } from "react";
import ShoppingCarts from "../../Molecules/Cart/ShoppingCarts/ShoppingCarts";
import CartModal from "../../Modal/FixedModal/CartModal";
import CompareItemModal from "../../Modal/FixedModal/CompareItemModal";
import CompareModal from "../../Modal/FixedModal/CompareModal";
import SpeedDial from "../../Molecules/SpeedDial/SpeedDial";

const ScrollSpeedDial = () => {
    const [isCartDetailsModalOpen, setIsCartDetailsModalOpen] = useState(false);
    const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

    return (
        <>
            <SpeedDial />

            {/* fixed compare modal */}
            <div className="right-2 fixed flex bottom-[39%] mr-2 z-50">
                <CompareModal setIsCompareModalOpen={setIsCompareModalOpen} />
            </div>
            {/* fixed cart modal */}
            <div className="right-2 fixed flex bottom-[28%] mr-2 z-50">
                <CartModal
                    setIsCompareModalOpen={setIsCompareModalOpen}
                    setIsCartDetailsModalOpen={setIsCartDetailsModalOpen}
                />
            </div>
            {/* cart  modal component */}
            {isCartDetailsModalOpen && (
                <div className="right-0 fixed z-50 top-0 ">
                    <ShoppingCarts
                        openShoppingCart={isCartDetailsModalOpen}
                        setOpenShoppingCart={setIsCartDetailsModalOpen}
                    />
                </div>
            )}
            {/* compare  modal component */}
            {isCompareModalOpen && (
                <div className="right-0 fixed z-50 bottom-[39%] m-8 mr-0">
                    <CompareItemModal
                        onClose={() => setIsCompareModalOpen(false)}
                        setIsCompareModalOpen={setIsCompareModalOpen}
                    />
                </div>
            )}
        </>
    );
};

export default ScrollSpeedDial;