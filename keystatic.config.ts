import { collection, config, fields } from "@keystatic/core";

// ── Shared product schema + collection factory ────────────────────────────────
// One function → zero repetition. Adding a brand = one line in the config below.
function brandCollection(label: string, folder: string) {
  return collection({
    label,
    slugField: "title",

    // e.g. src/content/products/casio/royale-ae1200.json
    path: `src/content/products/${folder}/*`,
    format: { data: "json" },

    columns: ["title", "category", "price", "stock", "createdAt"],

    schema: {
      // ── Identity ────────────────────────────────────────────────────────────
      title: fields.slug({
        name: {
          label: "Product Name",
        },
        slug: {
          generate: (name) =>
            name
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
        },
      }),

      category: fields.text({ label: "Category" }),
      sku: fields.text({ label: "SKU" }),

      // ── Details ─────────────────────────────────────────────────────────────
      description: fields.text({ label: "Description", multiline: true }),
      display: fields.text({ label: "Display Type" }),

      gender: fields.select({
        label: "Gender",
        options: [
          { label: "Men", value: "Men" },
          { label: "Women", value: "Women" },
          { label: "Unisex", value: "Unisex" },
        ],
        defaultValue: "Men",
      }),

      // ── Pricing & inventory ──────────────────────────────────────────────────
      price: fields.number({
        label: "Price",
        validation: { isRequired: true },
      }),
      stock: fields.number({
        label: "Stock",
        validation: { isRequired: true },
      }),

      // ── Flags ────────────────────────────────────────────────────────────────
      isNewArrival: fields.checkbox({
        label: "New Arrival",
        defaultValue: false,
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

      images: fields.array(fields.text({ label: "Image URL" }), {
        label: "Images",
        itemLabel: (p) => p.value || "New Image",
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
  storage: { kind: "local" },
  collections: {
    // To add a new brand: one line here + the folder is created automatically
    casio: brandCollection("Casio", "casio"),
    rolex: brandCollection("Rolex", "rolex"),
    seiko: brandCollection("Seiko", "seiko"),
    citizen: brandCollection("Citizen", "citizen"),
    omega: brandCollection("Omega", "omega"),
    tagHeuer: brandCollection("TAG Heuer", "tag-heuer"),
  },
});
