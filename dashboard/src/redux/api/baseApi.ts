import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3010/api/v1" }),
    endpoints: () => ({}),
    tagTypes: [
        "Users",
        "Category",
        "Brand",
        "Size",
        "Color",
        "SubCategory",
        "Product",
        "Coupon"
    ],
});
