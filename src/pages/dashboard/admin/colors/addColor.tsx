import { createColor } from "@/api/color";
import FormGroup from "@/components/Form/FormGroup";
import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import { useStoreContext } from "@/lib/contexts/StoreContextProvider";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IFormInputs {
    color: string;
}
const AddColor = () => {
    const [loading, setLoading] = useState(false);
    const { state } = useStoreContext();
    const { user } = state;
    const router = useRouter();
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm<IFormInputs>();

    const handleColorSubmit: SubmitHandler<IFormInputs> = async (data) => {
        setLoading(true);
        createColor(user!.token, data.color)
            .then((res) => {
                setLoading(false);
                toast.success(`${res.data.name} Color Created!`);
                reset();
                router.push("/dashboard/admin/colors");
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    toast.error("Color Creating Failed!");
                    setLoading(false);
                }
                setLoading(false);
            });
    };
    return (
        <DashboardLayout>
            <div>
                <div className="bg-secondary p-6 rounded-lg w-3/4">
                    <h2 className="text-center font-semibold text-primary text-2xl">
                        Add New Color
                    </h2>
                    <form onSubmit={handleSubmit(handleColorSubmit)}>
                        <FormGroup
                            register={register}
                            inputName={"color"}
                            labelName={"Color"}
                            errorField={errors.color}
                            inputType={"text"}
                            placeholder={"Enter Your Color"}
                            required="Color Field Is Required!"
                        />

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn block hover:bg-transparent hover:text-primary text-white btn-primary disabled:opacity-75 disabled:border-2 disabled:border-primary disabled:text-primary mt-2"
                        >
                            {loading ? "Loading" : "Submit"}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AddColor;
