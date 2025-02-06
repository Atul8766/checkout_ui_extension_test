import {
  BlockStack,
  reactExtension,
  TextBlock, 
  Banner,
  useApi,
  useTranslate,
} from "@shopify/ui-extensions-react/customer-account";
import { useState, useEffect } from 'react';
export default reactExtension(
  "customer-account.order-status.block.render",
  () => <PromotionBanner />,
);

function PromotionBanner() {
  const { i18n } = useApi();
  const translate = useTranslate();
  const { extension, sessionToken } = useApi();
  

  // Make sure APP_URL is set correctly
  const apiUrl = `${process.env.APP_URL}/app/additional`;
  console.log("API URL:", apiUrl);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await sessionToken.get();
        console.log("Session Token:", token);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data fetched:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, [apiUrl, sessionToken]);
  return (
    <Banner>
      <BlockStack inlineAlignment="center">
        <TextBlock>{i18n.translate("earnPoints")}</TextBlock>
      </BlockStack>
    </Banner>
  );
}
