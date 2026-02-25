export interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    image: any;
    description: string;
    rating: number;
}

export const Categories = [
    'All',
    'Lips',
    'Face',
    'Makeup Tools',
    'Sponges',
    'Bags',
    'Skin Care'
];

// ── Lips ──────────────────────────────────────────────────────────────────────
export const LIPS_PRODUCTS: Product[] = [
    { id: 'lip-1', name: 'MTF Lip Balm', category: 'Lips', price: 'Coming Soon', image: require('../assets/images/products/lips/MTF Lip Balm.png'), description: 'Experience pure hydration with Moh Tee Flair. This ultra-nourishing balm locks in moisture, leaving your lips cushiony-soft with a delicate, plump finish.', rating: 5.0 },
    { id: 'lip-2', name: 'MTF Lip Gloss', category: 'Lips', price: 'Coming Soon', image: require('../assets/images/products/lips/MTF Lip Gloss.png'), description: 'Elevate your shine with Moh Tee Flair. Our non-sticky, Vitamin E infused formula glides effortlessly for a luscious, high-impact glow that lasts.', rating: 4.8 },
    { id: 'lip-3', name: 'MTF Lipstick', category: 'Lips', price: 'Coming Soon', image: require('../assets/images/products/lips/MTF Lipstick.png'), description: 'The hallmark of Moh Tee Flair elegance. A rich, highly-pigmented formula that delivers full opacity in one stroke with a sophisticated silky-matte texture.', rating: 4.9 },
    { id: 'lip-4', name: 'MTF Liquid Lipstick', category: 'Lips', price: 'Coming Soon', image: require('../assets/images/products/lips/MTF Liquid Lipstick.png'), description: 'State-of-the-art wear from Moh Tee Flair. This weightless liquid formula dries to a flawless, transfer-proof matte finish without compromising on comfort.', rating: 5.0 },
    { id: 'lip-5', name: 'MTF Liquid Lipstick II', category: 'Lips', price: 'Coming Soon', image: require('../assets/images/products/lips/MTF Liquid Lipstick II.png'), description: 'Modern velvet by Moh Tee Flair. A refined take on our classic liquid lip, providing a soft-focus blurred effect and unparalleled all-day hydration.', rating: 4.7 },
];

// ── Face ──────────────────────────────────────────────────────────────────────
export const FACE_PRODUCTS: Product[] = [
    { id: 'face-1', name: 'MTF Foundation', category: 'Face', price: 'Coming Soon', image: require('../assets/images/products/face/MTF Foundation.png'), description: 'The perfect canvas by Moh Tee Flair. A full-coverage, lightweight foundation that conceals imperfections while reacting to your skin for a natural, luminous finish.', rating: 5.0 },
    { id: 'face-2', name: 'MTF Hydration Cream', category: 'Face', price: 'Coming Soon', image: require('../assets/images/products/face/MTF Hydration Cream.png'), description: 'Moh Tee Flair’s secret to radiance. Deeply quench your skin with this rich, botanical-infused cream designed to strengthen the skin barrier and leave a stunning glow.', rating: 4.9 },
    { id: 'face-3', name: 'MTF Primer', category: 'Face', price: 'Coming Soon', image: require('../assets/images/products/face/MTF Primer.png'), description: 'Blur the lines with Moh Tee Flair. This smoothing, semi-matte primer creates the ultimate base for flawles application and extended makeup longevity.', rating: 4.8 },
    { id: 'face-4', name: 'MTF Setting Spray', category: 'Face', price: 'Coming Soon', image: require('../assets/images/products/face/MTF Setting Spray.png'), description: 'The final touch of Moh Tee Flair. Lock in your masterpiece with a fine, refreshing mist that prevents fading and keeps your skin looking freshly applied all day.', rating: 5.0 },
    { id: 'face-5', name: 'MTF Toner', category: 'Face', price: 'Coming Soon', image: require('../assets/images/products/face/MTF Toner.png'), description: 'Balance and brighten with Moh Tee Flair. A gentle, pH-equilibrating toner that refines pores and refreshes your complexion for a clear, healthy-looking skin.', rating: 4.7 },
];

// ── Makeup Tools ──────────────────────────────────────────────────────────────
export const TOOLS_PRODUCTS: Product[] = [
    { id: 'tool-1', name: 'MTF Eyeshadow', category: 'Makeup Tools', price: 'Coming Soon', image: require('../assets/images/products/tools/MTF Eyeshadow.png'), description: 'Theatrical flair for your eyes. This Moh Tee Flair palette offers high-definition pigments and effortless blendability for both subtle and bold expressions.', rating: 5.0 },
    { id: 'tool-2', name: 'MTF Liquid Felt-Tip Eyeliner Pen', category: 'Makeup Tools', price: 'Coming Soon', image: require('../assets/images/products/tools/MTF Liquid Felt-Tip Eyeliner Pen.png'), description: 'Precision craft by Moh Tee Flair. Our sharp felt-tip pen delivers a rich, waterproof black line for the perfect sculpted flare in just one stroke.', rating: 4.8 },
    { id: 'tool-3', name: 'MTF Makeup Brush', category: 'Makeup Tools', price: 'Coming Soon', image: require('../assets/images/products/tools/MTF Makeup Brush.png'), description: 'Professional grade by Moh Tee Flair. Feather-soft, high-density bristles designed for seamless blending and precision application of your favorite cosmetics.', rating: 4.9 },
    { id: 'tool-4', name: 'MTF Mascara', category: 'Makeup Tools', price: 'Coming Soon', image: require('../assets/images/products/tools/MTF Mascara.png'), description: 'Extreme length and definition. Moh Tee Flair’s specialty brush separates and flares every lash for a dramatic, clum-pfree, volumized look.', rating: 5.0 },
    { id: 'tool-5', name: 'MTF Pressed Powder', category: 'Makeup Tools', price: 'Coming Soon', image: require('../assets/images/products/tools/MTF Pressed Powder.png'), description: 'Set your look with Moh Tee Flair. A finely milled, weightless pressed powder that controls shine and provides a blurred, matte finish for hours.', rating: 4.7 },
];

// ── Sponges ───────────────────────────────────────────────────────────────────
export const SPONGES_PRODUCTS: Product[] = [
    { id: 'sp-1', name: 'MTF Makeup Blending Sponge', category: 'Sponges', price: 'Coming Soon', image: require('../assets/images/products/sponges/MTF Makeup Blending Sponge  1.png'), description: 'The ultimate Moh Tee Flair blender. Ultra-soft and expansive, it ensures a seamless, streak-free application for all your liquid and cream products.', rating: 5.0 },
    { id: 'sp-2', name: 'MTF Blending Sponge I', category: 'Sponges', price: 'Coming Soon', image: require('../assets/images/products/sponges/MTF Makeup Blending Sponge 2.png'), description: 'Moh Tee Flair precision. This uniquely shaped sponge is designed to reach every inner corner for a truly flawless complexion.', rating: 4.9 },
    { id: 'sp-3', name: 'MTF Blending Sponge II', category: 'Sponges', price: 'Coming Soon', image: require('../assets/images/products/sponges/MTF Makeup Blending Sponge 3.png'), description: 'Multi-use versatility by Moh Tee Flair. A durable, professional-grade blender that maintains its feather-soft texture after every wash.', rating: 4.8 },
    { id: 'sp-4', name: 'MTF Blending Sponge III', category: 'Sponges', price: 'Coming Soon', image: require('../assets/images/products/sponges/MTF Makeup Blending Sponge 4.png'), description: 'Contour with confidence safely with Moh Tee Flair. This flat-edge sponge is perfect for baking and defining your facial features with precision.', rating: 4.7 },
    { id: 'sp-5', name: 'MTF Blending Sponge IV', category: 'Sponges', price: 'Coming Soon', image: require('../assets/images/products/sponges/MTF Makeup Blending Sponge 5.png'), description: 'Teardrop perfection from Moh Tee Flair. Specially designed for smooth under-eye concealer application without settling into lines.', rating: 4.8 },
    { id: 'sp-6', name: 'MTF Blending Sponge V', category: 'Sponges', price: 'Coming Soon', image: require('../assets/images/products/sponges/MTF Makeup Blending Sponge 6.png'), description: 'Full face coverage by Moh Tee Flair. The expansive flat side handles large areas quickly, delivering a polished and even finish.', rating: 4.9 },
];

// ── Bags ──────────────────────────────────────────────────────────────────────
export const BAGS_PRODUCTS: Product[] = [
    { id: 'bag-1', name: 'MTF Makeup Bag', category: 'Bags', price: 'Coming Soon', image: require('../assets/images/products/bags/MTF Makeup Bag 1.png'), description: 'Theatrical flair for your essentials. A stylish, Moh Tee Flair branded organizer that keeps your beauty tools safe and accessible with craft and confidence.', rating: 5.0 },
    { id: 'bag-2', name: 'MTF Makeup Bag I', category: 'Bags', price: 'Coming Soon', image: require('../assets/images/products/bags/MTF Makeup Bag 2.png'), description: 'Travel in style with Moh Tee Flair. This compact and durable bag is perfect for on-the-go glam, featuring the signature premium aesthetic.', rating: 4.8 },
    { id: 'bag-3', name: 'MTF Makeup Bag II', category: 'Bags', price: 'Coming Soon', image: require('../assets/images/products/bags/MTF Makeup Bag 3.png'), description: 'Uncompromising capacity by Moh Tee Flair. A large, sophisticated beauty bag with multiple compartments to house your entire collection.', rating: 4.9 },
];

// ── Skin Care ─────────────────────────────────────────────────────────────────
export const SKINCARE_PRODUCTS: Product[] = [
    { id: 'sk-1', name: 'MTF Body Oil', category: 'Skin Care', price: 'Coming Soon', image: require('../assets/images/products/skincare/MTF Body Oil.png'), description: 'Liquid radiance from Moh Tee Flair. This luxurious, nourishing oil absorbs quickly to leave your skin feeling silky-smooth and looking healthier than ever.', rating: 5.0 },
    { id: 'sk-2', name: 'MTF Serums', category: 'Skin Care', price: 'Coming Soon', image: require('../assets/images/products/skincare/MTF Serums.png'), description: 'Targeted skin health by Moh Tee Flair. A potent formulation designed to brighten, even tone, and hydrate for a glow that comes from within.', rating: 4.9 },
    { id: 'sk-3', name: 'MTF Shower Gel', category: 'Skin Care', price: 'Coming Soon', image: require('../assets/images/products/skincare/MTF Shower Gel.png'), description: 'Sensory indulgence from Moh Tee Flair. A sophisticated shower gel that cleanses gently while enveloping you in our signature subtle fragrance.', rating: 4.8 },
    { id: 'sk-4', name: 'MTF Soap', category: 'Skin Care', price: 'Coming Soon', image: require('../assets/images/products/skincare/MTF Soap.png'), description: 'Pure and gentle by Moh Tee Flair. Our artisanal soap provides a refreshing and calming cleanse, suitable for even the most sensitive skin types.', rating: 4.7 },
];

// ── Combined gallery (all 28 products) ───────────────────────────────────────
export const GALLERY_PRODUCTS: Product[] = [
    ...LIPS_PRODUCTS,
    ...FACE_PRODUCTS,
    ...TOOLS_PRODUCTS,
    ...SPONGES_PRODUCTS,
    ...BAGS_PRODUCTS,
    ...SKINCARE_PRODUCTS,
];

export const ALL_PRODUCTS: Product[] = GALLERY_PRODUCTS;
