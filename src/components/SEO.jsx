import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title,
  description,
  url = "/",
  noIndex = false,
}) => {
  const siteUrl = "https://schoolflourishindex.in";
  const canonicalUrl = `${siteUrl}${url}`;
  const imageUrl = `${siteUrl}/og-image.png`;

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title}</title>

      <meta
        name="description"
        content={description}
      />
    {noIndex && (
  <meta
    name="robots"
    content="noindex, nofollow"
  />
)}
      <link
        rel="canonical"
        href={canonicalUrl}
      />

      {/* Open Graph */}
      <meta
        property="og:type"
        content="website"
      />

      <meta
        property="og:site_name"
        content="School Flourish Index"
      />

      <meta
        property="og:title"
        content={title}
      />

      <meta
        property="og:description"
        content={description}
      />

      <meta
        property="og:url"
        content={canonicalUrl}
      />

      <meta
        property="og:image"
        content={imageUrl}
      />

      <meta
        property="og:image:width"
        content="1200"
      />

      <meta
        property="og:image:height"
        content="630"
      />

      <meta
        property="og:image:alt"
        content="School Flourish Index"
      />

      {/* X / Twitter */}
      <meta
        name="twitter:card"
        content="summary_large_image"
      />

      <meta
        name="twitter:title"
        content={title}
      />

      <meta
        name="twitter:description"
        content={description}
      />

      <meta
        name="twitter:image"
        content={imageUrl}
      />
    </Helmet>
  );
};

export default SEO;