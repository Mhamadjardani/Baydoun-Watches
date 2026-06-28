import { collection, config, fields } from "@keystatic/core";

// ── Shared product schema + collection factory ────────────────────────────────
// One function → zero repetition. Adding a brand = one line in the config below.
function brandCollection(
  label: string,
  folder: string,
  subcategories?: string[],
) {
  return collection({
    label,
    slugField: "sku",

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
      title: fields.text({
        label: "Product Name",
      }),

      // category: fields.text({ label: "Category" }),

      sku: fields.slug({
        name: { label: "SKU" },
        slug: {
          generate: (name) =>
            name
              .trim()
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
        },
      }),

      subCategory: subcategories
        ? fields.select({
            label: "subCategory",
            options: subcategories.map((s) => ({
              label: s,
              value: s.toLowerCase().replace(/\s+/g, "-"),
            })),
            defaultValue: subcategories[0].toLowerCase().replace(/\s+/g, "-"),
          })
        : fields.empty(),

      // ── Details ─────────────────────────────────────────────────────────────
      description: fields.text({ label: "Description", multiline: true }),
      display: fields.text({
        label: "Display Type",
        description: "Analog /Digital",
      }),

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
      discount: fields.number({
        label: "Discount %",
        validation: { isRequired: false },
      }),
      // stock: fields.number({
      //   label: "Stock",
      //   validation: { isRequired: true },
      // }),

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
    ]),
    cityTime: brandCollection("City Time", "city-time"),
    curren: brandCollection("Curren", "curren"),
    dkny: brandCollection("DKNY", "dkny"),
    gadgets: brandCollection("Gadgets", "gadgets"),
    lacoste: brandCollection("Lacoste", "lacoste"),
    nano: brandCollection("Nano", "nano"),
    omorfia: brandCollection("Omorfia", "omorfia"),
    polit: brandCollection("Polit", "polit"),
    qq: brandCollection("Q&Q", "q-q"),
    rovina: brandCollection("Rovina", "rovina"),
    tommyHilfiger: brandCollection("Tommy Hilfiger", "tommy-hilfiger"),
  },
});
