import React from "react";

export const LogoLink: React.FC = () => {
  return (
    <a
        href={window.location.origin}
        target="_self"
        itemProp="url"
    >
      <img
        loading="lazy"
        decoding="async"
        className="fl-photo-img wp-image-108755 size-custom-small"
        src="https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-350x79.png"
        alt="Realtycandy Logo 2025"
        itemProp="image"
        height={39.5}
        width={175}
        data-no-lazy="1"
        srcSet="
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-350x79.png 350w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-300x68.png 300w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-1024x231.png 1024w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-150x34.png 150w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-768x174.png 768w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-1536x347.png 1536w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-2048x463.png 2048w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-640x145.png 640w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-200x45.png 200w,
          https://realtycandy.com/wp-content/uploads/2025/06/RealtyCandy-Logo-2025-520x118.png 520w
        "
        sizes="auto, (max-width: 350px) 100vw, 350px"
        title="Realtycandy Logo 2025"
      />
    </a>
  );
};

