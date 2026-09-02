# Features

Code-derived inventory of what this repo implements. Bullets and key file paths —
the mechanism lives in `docs/how-it-works.md`, the walkthrough in `docs/demo-script.md`.

_Last generated: 2026-09-02 by feature-doc._

Built from scratch (no starter fork base) — a commercetools Connect connector for
configurable product bundles, deployed as four `connect.yaml` applications: a Merchant
Center Custom Application (`mc-app`) for authoring bundles, a Merchant Center Custom
View (`bundle-viewer`) for inspecting a bundle from the product detail page, a backend
service (`bundle-api`) that resolves and adds bundles to cart, and a dependency-free web
component (`assets`) that any storefront can embed to let a shopper configure a bundle.

## Bundle schema authoring (mc-app)

- Schema builder for reusable bundle templates: define an arbitrary tree of attributes
  with types String, LocalizedString, Number, Boolean, Money, LocalizedMoney, Date,
  Time, DateTime, Enum, LocalizedEnum, Object (nested), and Reference, each markable as
  required and/or a "set" (array) (`mc-app/src/components/organisms/schema-attribute/attribute.tsx`,
  `mc-app/src/utils/contants.ts`)
- Array attributes pick their own selection UI (dropdown, checkbox, radio, or "all"),
  and first-level array/object attributes can be flagged to render as their own tab
  (`mc-app/src/components/organisms/schema-attribute/attribute.tsx`)
- Reference-type attributes can point at almost any commercetools resource — product,
  category, cart, cart-discount, channel, customer, customer-group, discount-code,
  key-value-document, order, payment, product-discount, product-price, product-type,
  shipping-method, shopping-list, state, store, tax-category, type — each with its own
  typeahead search component
  (`mc-app/src/components/organisms/reference-input/search-components/*`)
- A schema targets one or more product types and names the single product attribute
  that will carry the bundle link on a product of that type
  (`mc-app/src/components/molecules/target-product-types/index.tsx`)
- Bundle UI settings on a schema choose a configuration "shape" (component-selection,
  preset-configs, base-with-addons, mix-and-match, tiered-selection, package-deals,
  subscription-bundle, dynamic-bundle) and a display mode (wizard, accordion, tabs,
  grid, sidebar, carousel, comparison, tree, modal-sequence, matrix, timeline,
  floating-panels, split-view, stepper), plus progress-bar and skip-step toggles
  (`mc-app/src/components/molecules/bundle-ui-attributes/index.tsx`). Only
  `component-selection`/default and `base-with-addons` are actually recognized by the
  backend validator, and only `wizard`, `accordion`, `carousel`, and `grid` are
  implemented as storefront display components — the rest of the enum is authorable but
  not yet renderable (see Known gaps below)
- Two bundle authoring flows, toggled by the `BUNDLE_FEATURE_FLAGS` env var
  (`custom-object-bundle`, `product-attribute-bundle`); when only one flag is enabled
  the type-selection step is skipped and defaulted automatically
  (`mc-app/src/hooks/use-feature-flags.ts`,
  `mc-app/src/components/organisms/new-bundle/steps/select-bundle-type-step.tsx`)
  - **Custom object bundle**: the bundle configuration is written to its own custom
    object, and the product is updated with a `key-value-document` reference attribute
    pointing at it (`mc-app/src/hooks/use-configurable-bundles/index.ts`)
  - **Product attribute bundle**: the selected values are written directly onto the
    main product's own attributes, using the target product type's attribute
    definitions to coerce types (`mc-app/src/utils/attributes.ts`,
    `mc-app/src/hooks/use-configurable-bundles/index.ts`)
- New Bundle wizard: a multi-step drawer (select type → pick product → configure the
  schema-driven fields, including nested/array attributes → review), with an
  unsaved-changes confirmation guard on close and auto-scroll to a newly added
  included-product row (`mc-app/src/components/organisms/new-bundle/*`,
  `mc-app/src/hooks/use-close-modal-confirmation.tsx`)
- Bundle list and detail pages: sortable table of bundles with delete-with-confirmation
  and list reload after create/delete, and a detail view that renders the resolved
  custom-object configuration read back from commercetools
  (`mc-app/src/components/organisms/bundles-table/index.tsx`,
  `mc-app/src/components/pages/bundle-list-page.tsx`,
  `mc-app/src/components/organisms/bundle-configuratiom-details/*`)
- Product creation form for authoring a bundle's target product directly from the app,
  deriving slug/key/SKU from the localized name as it's typed
  (`mc-app/src/components/molecules/product-form/create-product-form.tsx`)
- English and German UI translations (`mc-app/src/i18n/data/en.json`, `de.json`)

## Bundle inspection in Merchant Center (bundle-viewer)

- Custom View surfaced on the product-variant detail page in Merchant Center; parses
  the product and variant id out of the host page's URL
  (`bundle-viewer/src/components/bundle-configuration/index.tsx`)
- Renders a bundle's resolved configuration as an expandable tree of every referenced
  product/category/nested object, each node linking out to that resource's own
  Merchant Center detail page
  (`bundle-viewer/src/components/bundle-configuration/tree-node.tsx`,
  `product-reference-tree.tsx`)

## Bundle resolution and cart API (bundle-api)

- `GET /bundle-api/product-by-sku`: looks up a product by SKU, matches it to a cached
  bundle schema by product type, follows the schema's linking attribute to the bundle's
  custom object, and recursively resolves every Reference/Object attribute in the
  schema (product and category references, including nested arrays) into live product
  and price data, honoring `priceCountry`/`priceCurrency`/`priceCustomerGroup`/
  `priceChannel`/`storeProjection` query params
  (`bundle-api/src/controllers/product.controller.ts`,
  `bundle-api/src/utils/bundle.utils.ts`)
- `POST /bundle-api/add-to-cart`: validates a shopper's component selections against
  the bundle's schema-defined rules — mandatory/max quantity and an allowed-product
  list for the default `components_and_parts` shape, or a match against one of the
  schema's predefined `bundleVariants` for the `base-with-addons` shape — then adds the
  base product and each selected component as cart line items, optionally linking
  component line items back to the parent via a custom line-item type field when
  `addToCartConfiguration.type` is `add-with-parent-link`
  (`bundle-api/src/utils/bundle-validation.utils.ts`,
  `bundle-api/src/services/cart.service.ts`)
- In-memory caching of bundle schemas and product-type attribute definitions, primed on
  boot and refreshed on a 5-minute TTL (`bundle-api/src/cache/schema.ts`,
  `bundle-api/src/cache/product-types.ts`)
- CORS origin allow-list restricted to the domains listed in `CORS_ALLOWED_ORIGINS`,
  matched against the request's registrable domain (`bundle-api/src/app.ts`)
- Only the custom-object-bundle authoring path is actually readable by the storefront:
  `getAttributeFromProduct` requires the product's linking attribute to be a
  `key-value-document` reference, so bundles authored via the `product-attribute-bundle`
  flag cannot be resolved through `product-by-sku` or `add-to-cart`
  (`bundle-api/src/utils/product.utils.ts`)

## Embeddable configurator (assets)

- Framework-agnostic `<product-card>` web component (Shadow DOM, no runtime
  dependencies) that any storefront can embed with a single `<script>` tag; reads
  `sku`/`baseurl`/`cartid`/`locale` plus optional price-selection attributes, fetches
  the resolved bundle from `bundle-api`, and drives add-to-cart
  (`assets/src/product-card.ts`)
- Four working display modes matching a schema's `bundleUISettings.displayMode`: wizard
  (step-by-step with a running selections total), accordion, carousel, and grid
  (`assets/src/components/display-modes/wizard-display.ts`, `accordion-display.ts`,
  `carousel-display.ts`, `grid-display.ts`) — note the top-level `README.md` calls grid
  and carousel "not implemented yet"; that is stale, both exist and are wired up
- Shared component-selector element for choosing a bundle component's product and
  quantity, itself configurable per attribute as a card grid or list
  (`assets/src/components/component-selector.ts`)
- Styling is themed entirely through CSS custom properties
  (`--configurator-primary-color`, `--secondary-color`, `--background-color`, etc.) so
  a host site can reskin the widget without touching its internals
  (`assets/src/product-card.ts`)

## Connect Cloud deployment

- `connect.yaml` deploys all four applications together: `mc-app`
  (merchant-center-custom-application), `bundle-viewer` (merchant-center-custom-view),
  `bundle-api` (service, mounted at `/bundle-api`), and `assets` (static assets)
  (`connect.yaml`)
- Post-deploy/pre-undeploy lifecycle scripts register and remove an HTTP cart-Update
  API Extension pointed at the deployed `bundle-api` URL, and create/remove a
  cart-discount custom type
  (`bundle-api/src/connector/post-deploy.ts`, `pre-undeploy.ts`, `actions.ts`)

## Known gaps

- The cart-Update extension registered by `post-deploy` is unmodified commercetools
  Connect starter boilerplate (key names `myconnector-cartUpdateExtension` /
  `myconnector-cartDiscountType`, a generic "Custom type to store a string" type) —
  `bundle-api`'s Express app only defines routes under `/bundle-api`
  (`bundle-api/src/app.ts`), so nothing handles a callback from the extension it
  registers. It creates real commercetools resources on deploy but has no working
  purpose in this connector yet.
- Most `bundleUISettings.configurationType` and `displayMode` enum values are
  authorable in the mc-app schema builder but have no matching implementation in
  `bundle-api`'s validator or in the `assets` web component (see above) — treat them as
  reserved for future bundle shapes, not working today.
