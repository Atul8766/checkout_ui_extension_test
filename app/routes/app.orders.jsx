import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

// Loader function to authenticate user
export const loader = async ({ request }) => {
    await authenticate.admin(request);
    return null;
};

// Action function to fetch and return orders in JSON format
export const action = async ({ request }) => {
    const { admin } = await authenticate.admin(request);

    // Fetch orders from Shopify Admin API
    const response = await admin.graphql(
        `#graphql
        query getOrders($first: Int!) {
            orders(first: $first) {
                edges {
                    node {
                        id
                        name
                        email
                        totalPrice
                        lineItems(first: 5) {
                            edges {
                                node {
                                    title
                                    quantity
                                    price
                                }
                            }
                        }
                        createdAt
                    }
                }
            }
        }`,
        {
            variables: { first: 5 }, // Adjust 'first' to control the number of orders retrieved
        },
    );

    const responseJson = await response.json();

    // Return the orders as JSON response
    return json({
        orders: responseJson.data.orders.edges.map(edge => edge.node),
    });
};
