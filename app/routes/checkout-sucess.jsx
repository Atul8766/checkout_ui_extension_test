import shopify, { authenticate, unauthenticated, getAllSessionData, apiVersion } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { IndexTable, ButtonGroup, Button } from '@shopify/polaris';
import { useState } from 'react';

export async function loader({ request }) {
  const accessToken = await getAllSessionData();
  const shop = accessToken.shop;
  const maintoken = accessToken.accessToken;
  if (!maintoken) {
    return json({ error: "Access token not found" }, { status: 403 });
  }

  const query = `
  {
      customers(first: 10) {
          edges {
              node {
                  id
                  tags
              }
          }
      }
  }
  `;

  try {
    const response = await fetch(`https://${shop}/admin/api/${apiVersion}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Access-Token": maintoken
      },
      body: query,
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw new Response("Failed to fetch orders", { status: 500 });
  }
};
