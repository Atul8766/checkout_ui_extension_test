import { useLoaderData } from "@remix-run/react";
import {
  authenticate,
  apiVersion,
  getAccessTokenForShop,
} from "../shopify.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  const accessToken = getAccessTokenForShop(shop);
  const query = `
    {
        orders(first: 10) {
            edges {
                node {
                    id
                }
            }
        }
    }
    `;

  try {
    const response = await fetch(
      `https://${shop}/admin/api/${apiVersion}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/graphql",
          "X-Shopify-Access-Token": accessToken,
        },
        body: query,
      },
    );

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Response("Failed to fetch orders", { status: 500 });
  }
};

// React component to display data
export default function Orders() {
  const data = useLoaderData();

  return (
    <div>
      <h1>Order IDs</h1>
      <ul>
        {data.orders.edges.map((order) => (
          <li key={order.node.id}>{order.node.id}</li>
        ))}
      </ul>
    </div>
  );
}
