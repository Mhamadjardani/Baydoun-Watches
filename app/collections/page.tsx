import ProductsCollection, {
  type CollectionFilterState,
} from "@/components/collections/ProductsCollection";

const filterKeys = [
  "brand",
  "category",
  "subCategory",
  "gender",
  "display",
] as const;

const normalizeParam = (value: string | string[] | undefined) => {
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value].filter(Boolean);
};

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const initialFilters = filterKeys.reduce<CollectionFilterState>(
    (filters, key) => ({
      ...filters,
      [key]: normalizeParam(params[key]),
    }),
    {
      brand: [],
      category: [],
      subCategory: [],
      gender: [],
      display: [],
    },
  );

  return <ProductsCollection initialFilters={initialFilters} />;
}
