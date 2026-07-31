export type EntityStatus = "ACTIVE" | "INACTIVE";
export type PublicationStatus = "DRAFT" | "ACTIVE" | "INACTIVE";
export type TrackingType = "QUANTITY" | "SERIALIZED";
export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Category = {
  id: string;
  parent_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  status: EntityStatus;
  sort_order: number;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  status: EntityStatus;
};

export type Product = {
  id: string;
  category_id: string;
  brand_id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  view_count: number;
  sold_count: number;
  publication_status: PublicationStatus;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string;
  variant_name: string;
  color: string;
  ram: string;
  storage: string;
  tracking_type: TrackingType;
  list_price: string;
  sale_price: string | null;
  warranty_months: number;
  status: EntityStatus;
};

export type ProductImage = {
  id: string;
  product_variant_id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
  /** Vị trí trong sprite ảnh demo; API thật không cần trường này. */
  mock_sprite_index?: number;
};

export type ProductSpecification = {
  id: string;
  product_id: string;
  group_name: string;
  spec_name: string;
  spec_value: string;
  sort_order: number;
};

export type ProductAttribute = {
  id: string;
  product_id: string;
  attribute_name: string;
  attribute_value: string;
};

export type WarehouseInventory = {
  warehouse_id: string;
  product_variant_id: string;
  on_hand_quantity: number;
  reserved_quantity: number;
  available_quantity: number;
};

export type Review = {
  id: string;
  customer_id: string;
  product_id: string;
  order_item_id: string | null;
  customer_name: string;
  rating: number;
  title: string | null;
  comment: string;
  status: ReviewStatus;
  created_at: string;
};

export type RelatedProduct = {
  product_id: string;
  related_product_id: string;
  sort_order: number;
};

export type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  position: string;
  sort_order: number;
  starts_at: string | null;
  ends_at: string | null;
  status: EntityStatus;
};

export type CatalogMockDatabase = {
  categories: Category[];
  brands: Brand[];
  products: Product[];
  productVariants: ProductVariant[];
  productImages: ProductImage[];
  productSpecifications: ProductSpecification[];
  productAttributes: ProductAttribute[];
  warehouseInventories: WarehouseInventory[];
  reviews: Review[];
  relatedProducts: RelatedProduct[];
  banners: Banner[];
};
