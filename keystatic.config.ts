import { collection, config, fields } from "@keystatic/core";

// ── Shared product schema + collection factory ────────────────────────────────
// One function → zero repetition. Adding a brand = one line in the config below.
function brandCollection(
  label: string,
  folder: string,
  subcategories?: string[],
  // Accessories (watch boxes…) have no display type or gender, and default to
  // their first subcategory instead of "General".
  options: { watch?: boolean; defaultSubCategory?: string } = {},
) {
  const { watch = true, defaultSubCategory = "general" } = options;
  const toSlug = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
  return collection({
    label,
    // Watches are identified by their SKU. Accessories often have none, so their
    // product name gives the file name and web address, and the SKU is optional.
    slugField: watch ? "sku" : "title",

    // e.g. src/content/products/casio/royale-ae1200.json
    path: `src/content/products/${folder}/*`,
    format: { data: "json" },

    columns: [
      "title",
      // "category",
      "subCategory",
      "price",
      "createdAt",
    ],

    schema: {
      // ── Identity ────────────────────────────────────────────────────────────
      title: watch
        ? fields.text({ label: "Product Name" })
        : fields.slug({
            name: { label: "Product Name" },
            slug: { label: "Web address", generate: toSlug },
          }),

      // category: fields.text({ label: "Category" }),

      sku: watch
        ? fields.slug({
            name: { label: "SKU" },
            slug: { generate: toSlug },
          })
        : fields.text({
            label: "Reference / SKU (optional)",
            description: "Leave empty if the item has no code.",
          }),

      subCategory: subcategories
        ? fields.select({
            label: "subCategory",
            options: [
              { label: "General", value: "general" },
              ...subcategories.map((s) => ({
                label: s,
                value: s.toLowerCase().replace(/\s+/g, "-"),
              })),
            ],
            defaultValue: defaultSubCategory,
          })
        : fields.empty(),

      // ── Details ─────────────────────────────────────────────────────────────
      description: fields.text({ label: "Description", multiline: true }),
      display: watch
        ? fields.select({
            label: "Display Type",
            options: [
              { label: "Analog", value: "Analog" },
              { label: "Digital", value: "Digital" },
              { label: "Ana/Dig", value: "Ana/Dig" },
            ],
            defaultValue: "Analog",
          })
        : fields.empty(),

      gender: watch
        ? fields.select({
            label: "Gender",
            options: [
              { label: "Men", value: "Men" },
              { label: "Women", value: "Women" },
              { label: "Kids", value: "Kids" },
              { label: "Unisex", value: "Unisex" },
            ],
            defaultValue: "Men",
          })
        : fields.empty(),

      // ── Pricing & inventory ──────────────────────────────────────────────────
      price: fields.number({
        label: "Price",
        validation: { isRequired: true },
      }),
      discount: fields.number({
        label: "Discount %",
        validation: { isRequired: false },
      }),
      isOutOfStock: fields.checkbox({
        label: "Out of stock",
        description:
          "Keeps the product listed but disables ordering. Untick when it is back.",
        defaultValue: false,
      }),

      // ── Flags ────────────────────────────────────────────────────────────────
      isNewArrival: fields.checkbox({
        label: "New Arrival",
        defaultValue: false,
      }),
      isVisible: fields.checkbox({
        label: "Visible",
        // default true so items are visible unless explicitly hidden
        defaultValue: true,
      }),
      isFeatured: fields.checkbox({ label: "Featured", defaultValue: false }),
      isLimitedEdition: fields.checkbox({
        label: "Limited Edition",
        defaultValue: false,
      }),

      // ── Rich content ─────────────────────────────────────────────────────────
      specifications: fields.array(
        fields.object({
          label: fields.text({ label: "Spec Name" }),
          value: fields.text({ label: "Value" }),
        }),
        {
          label: "Specifications",
          itemLabel: (p) =>
            p.fields.label.value && p.fields.value.value
              ? `${p.fields.label.value}: ${p.fields.value.value}`
              : p.fields.label.value || "New Spec",
        },
      ),

      features: fields.array(fields.text({ label: "Feature" }), {
        label: "Key Features",
        itemLabel: (p) => p.value || "New Feature",
      }),

      // images: fields.array(fields.text({ label: "Image URL" }), {
      //   label: "Images",
      //   itemLabel: (p) => p.value || "New Image",
      // }),

      imageCount: fields.number({
        label: "Image Count",
        defaultValue: 1,
        validation: {
          isRequired: true,
          min: 1,
        },
      }),

      arrivalDate: fields.date({
        label: "Arrival Date",
        defaultValue: { kind: "today" },
      }),

      createdAt: fields.date({
        label: "Created At",
        defaultValue: { kind: "today" },
      }),

      // updatedAt → set programmatically on save, not exposed to the client
    },
  });
}

// ── Config ────────────────────────────────────────────────────────────────────
export default config({
  storage: {
    kind: "github",
    repo: {
      owner: "Mhamadjardani",
      name: "Baydoun-Watches",
    },
  },
  collections: {
    // To add a new brand: one line here + the folder is created automatically
    calvinKlein: brandCollection("Calvin Klein", "calvin-klein"),
    casio: brandCollection("Casio", "casio", [
      "G-Shock",
      "Edifice",
      "Vintage",
      "Baby-G",
      "Pro Trek",
      "Wall Clock",
    ]),
    // dkny: brandCollection("DKNY", "dkny"),
    lacoste: brandCollection("Lacoste", "lacoste"),
    omorfia: brandCollection("Omorfia", "omorfia", ["Omorfia Club"]),
    rovina: brandCollection("Rovina", "rovina"),
    tommyHilfiger: brandCollection("Tommy Hilfiger", "tommy-hilfiger"),
    accessories: brandCollection("Accessories", "accessories", ["Watch Box"], {
      watch: false,
      defaultSubCategory: "watch-box",
    }),
  },
});
