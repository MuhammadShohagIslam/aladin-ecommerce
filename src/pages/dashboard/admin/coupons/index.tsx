import { creatingCoupon, getListOfCoupons, removingCoupon } from "@/api/coupon";
import CouponForm from "@/components/Form/CouponForm/CouponForm";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { useStoreContext } from "@/lib/contexts/StoreContextProvider";
import { UserType } from "@/lib/states/storeReducer/storeReducer.type";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { AiOutlineClear } from "react-icons/ai";
import { ICoupon } from "types/coupon.types";

type CouponValuesType = {
    couponName: string;
    discount: string;
};
const initialCouponValues = {
    couponName: "",
    discount: "",
};
const CreateCoupon = () => {
    const [couponValues, setCouponValues] =
        useState<CouponValuesType>(initialCouponValues);
    const [expireDate, setExpireDate] = useState(new Date());
    const [coupons, setCoupons] = useState<ICoupon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { state } = useStoreContext();
    const { user } = state;

    useEffect(() => {
        if (user) {
            loadingListOfCoupons(user);
        }
    }, [user]);

    // loading list of coupons
    const loadingListOfCoupons = (user: UserType) => {
        if (user && user.token) {
            getListOfCoupons(user.token)
                .then((res) => {
                    setCoupons(res.data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCouponValues({
            ...couponValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleCouponSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        if (!couponValues.couponName || couponValues.couponName.trim() === "") {
            toast.error("Invalid Coupon. Provide Valid Coupon!");
            setLoading(false);
            return;
        }
        if (user && user.token) {
            setLoading(true);
            creatingCoupon(
                user.token,
                couponValues.couponName,
                couponValues.discount,
                expireDate
            )
                .then((res) => {
                    setCoupons(res.data);
                    setLoading(false);
                    toast.success(`${res.data.name} coupon is created!`);
                    loadingListOfCoupons(user);
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.status === 400) {
                        toast.error(
                            `${error.response.data}, Duplicate Coupon Name!`
                        );
                    }
                    setLoading(false);
                });
        }
    };

    const removeCoupon = (couponId: string) => {
        if (user && user.token) {
            removingCoupon(user.token, couponId)
                .then((res) => {
                    toast.error(`${res.data.name} coupon is deleted!`);
                    setLoading(false);
                    loadingListOfCoupons(user);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                });
        }
    };

    return (
        <DashboardLayout>
            <div>
                <div className="bg-secondary p-6 rounded-lg w-3/4">
                    <h2 className="text-center font-semibold text-primary text-2xl">
                        Create Coupon
                    </h2>

                    {/* Coupon Form */}
                    <div>
                        <CouponForm
                            couponValues={couponValues}
                            expireDate={expireDate}
                            setExpireDate={setExpireDate}
                            loading={loading}
                            handleCouponChange={handleCouponChange}
                            handleCouponSubmit={handleCouponSubmit}
                        />
                    </div>

                    {/* List Of Coupons */}
                    <div className="mt-8">
                        <hr />
                        <h5 className="mb-5 text-center font-semibold text-primary text-2xl">
                            List of {coupons.length}{" "}
                            {coupons.length > 1 ? "Coupons" : "Coupon"}
                        </h5>
                        <div>
                            <table className="table w-full align-middle">
                                <thead className="table-secondary text-center">
                                    <tr>
                                        <th scope="col">Coupon-Name</th>
                                        <th scope="col">Expire Date</th>
                                        <th scope="col">Discount</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="text-black">
                                    {coupons && coupons.length > 0 ? (
                                        coupons.map((coupon: ICoupon) => (
                                            <tr key={coupon._id}>
                                                <td className="text-center">
                                                    {coupon.name}
                                                </td>
                                                <td className="text-center">
                                                    {new Date(
                                                        coupon.expiry
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="text-center">
                                                    {coupon.discount}
                                                </td>
                                                <td className="text-center">
                                                    {" "}
                                                    <span>
                                                        <AiOutlineClear
                                                            className="text-rose-300 cursor-pointer hover:text-rose-600 inline-block"
                                                            onClick={() =>
                                                                removeCoupon(
                                                                    coupon._id
                                                                )
                                                            }
                                                        />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                className="text-center"
                                                colSpan={4}
                                            >
                                                <h5>No Coupon</h5>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateCoupon;
