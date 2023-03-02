/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BiEdit } from "react-icons/bi";
import FileUpload from "@/components/FileUpload/FileUpload";
import UserDashboard from "@/layouts/DashboardLayout/UserDashboard";
import { useStoreContext } from "@/lib/contexts/StoreContextProvider";
import { currentUser } from "@/api/auth";
import toast from "react-hot-toast";
import dynamic from 'next/dynamic';
import FormGroup from "@/components/Form/FormGroup";
import ProfileEditModal from "@/components/Modal/ProfileEditModal/ProfileEditModal";

type FormValues = { 
    newPassword: string;
};

const Profile = () => {
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [loadingForUpdateProfile, setLoadingForUpdateProfile] =
        useState(false);
    const [loadingForUpdateProfileImg, setLoadingForUpdateProfileImg] =
        useState(false);
    const [values, setValues] = useState({
        username: "",
        fullName: "",
        image: {
            public_id: "",
            url: "",
        },
        email: "",
        about: "",
    });
    const { state, updateThePassword } = useStoreContext();
    const { user } = state;
   
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isDirty, isSubmitted },
    } = useForm<FormValues>({
        mode: "onChange",
    });

    useEffect(() => {
        console.log(user, "user");
        loadingCurrentUser();
    }, []);

    const loadingCurrentUser = () => {
        if(user && user!.token){
            currentUser(user.token).then((res) => {
                const data = res.data;
                console.log(data);
                setValues({
                    ...values,
                    username: data.username,
                    fullName: data.fullName,
                    image: {
                        url: data.image?.url,
                        public_id: data.image?.public_id,
                    },
                    email: data.email,
                    about: data?.about,
                });
            })
            .catch((error) => {
                console.log(error.message);
            });
        }
    };

    // show model for update profile
    const handleShowModal = () => {
        setShowModal((prev) => !prev);
    };

    // update password
    const handlePasswordSubmit: SubmitHandler<FormValues> = (data) => {
        const { newPassword } = data;
        setLoading(true);
        updateThePassword(newPassword!)!
            .then(() => {
                toast.success("Password Is Updated!");
                reset();
            })
            .catch((error) => {
                toast.error(
                    `Something wrong! for password updating like ${error.message}`
                );
                setLoading(false);
            }).finally(()=>{
                reset();
            });
    };

    const updatePasswordForm = () => (
        <form onSubmit={handleSubmit(handlePasswordSubmit)}>
            <FormGroup
                register={register}
                inputName={"newPassword"}
                labelName={"New Password"}
                isRequirePattern={true}
                requirePattern={{
                    required: "Password is required",
                    minLength: {
                        value: 6,
                        message: "Password should be 6 characters or longer",
                    },
                }}
                errorField={errors.newPassword}
                inputType={"password"}
                placeholder={"Please Enter Your New Password"}
                required="Password is required"
            />
            <button
                type="submit"
                className="btn block hover:bg-transparent hover:text-primary text-white btn-primary disabled:opacity-75 disabled:border-2 disabled:border-primary disabled:text-primary mt-2"
                disabled={isSubmitted || !isDirty}
            >
                {isSubmitted ? "Loading..." : "Submit"}
            </button>
        </form>
    );
    console.log(showModal,isDirty, "profile value")
    return (
        <UserDashboard>
            <h2>My Profile</h2>
            <div className="grid grid-cols-8">
                <div className="col-span-2">
                   {values.image?.url && (
                     <FileUpload
                     user={user}
                     values={values}
                     setValues={setValues}
                     setLoading={setLoadingForUpdateProfileImg}
                     loading={loadingForUpdateProfileImg}
                 />
                   )}
                </div>
                <div className="col-span-6 m-auto p-4">
                    <div className="relative flex justify-end items-center">
                        <span
                            className="text-green-500 text-md hover:text-black transition-all cursor-pointer"
                            id="my-profile-update-modal"
                            onClick={handleShowModal}
                        >
                            <BiEdit />
                        </span>
                        {showModal && (
                <ProfileEditModal
                closeModal={handleShowModal}
                values={values}
                loadingCurrentUser={loadingCurrentUser}
                title="Profile Information Update"
            />
            )}
                    </div>

                    <div>
                        <ul>
                            <li>
                                <p className="text-black text-md font-semibold mb-0">Full name:</p>
                                <span className="text-black mt-1 inline-block">
                                    {values?.fullName}
                                </span>
                            </li>
                            <li className="mt-2">
                                <p className="text-black mb-0 text-md font-semibold">
                                    Email address:
                                </p>
                                <span className="text-black mt-1 inline-block">
                                    {values?.email}
                                </span>
                            </li>
                            <li className="mt-2">
                                <p className="text-black mb-0 text-md font-semibold">About</p>
                                <span className="text-black mt-1 inline-block">
                                    {values?.about}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                <div className="">
                    {isSubmitted ? <h2 className="text-black text-md font-semibold text-center mt-4 mb-3">Loading</h2> : <h4 className="text-black text-md font-semibold text-center mt-4 mb-3">Update Password</h4>}
                    {updatePasswordForm()}
                </div>
            </div>
  
            
        </UserDashboard>
    );
};

export default dynamic(() => Promise.resolve(Profile), {ssr:false});
