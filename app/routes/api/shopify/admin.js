// app/routes/api/shopify/admin.js
import { json } from "@remix-run/node";
import { getAdminRestClient, getAccessTokenForShop } from "../../../shopify.server";

export const loader = async ({ request }) => {
    const shop = "checkout-extension.myshopify.com"; // Replace with the actual shop domain

    // Retrieve the access token for the specified shop
    const accessToken = await getAccessTokenForShop(shop);

    if (!accessToken) {
        return json({ error: "No access token found for the shop" }, { status: 401 });
    }

    const client = getAdminRestClient(shop, accessToken);
    try {
        const response = await client.get({ path: "/admin/api/2023-04/products.json" });
        return new Response(JSON.stringify(response.body), {
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://chcekout-extension.myshopify.com", // Replace with your Shopify domain
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return json({ error: error.message }, { status: 500 });
    }
};