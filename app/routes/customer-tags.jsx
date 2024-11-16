import shopify, { authenticate, unauthenticated, getAllSessionData, apiVersion } from '../shopify.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { IndexTable, ButtonGroup, Button } from '@shopify/polaris';
import { useState } from 'react';

export async function loader({ request }) {
    const { sessionToken } = await authenticate.public.checkout(request);
    const { admin } = await unauthenticated.admin(sessionToken.dest);
    // return json(sessionToken);
    const response = await admin.graphql(
        `#graphql
        query getCustomers {
          customers (first: 10) {
            edges {
              node {
                id
                tags
              }
            }
          }
        }`
    );

    const data = await response.json();
    return json(data);

};
