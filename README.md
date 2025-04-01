***NOTE***: This is NOT an official commercetools code and NOT production ready. Use it at your own risk

# Configurable Bundles

A comprehensive solution for managing and viewing configurable bundles in commercetools, consisting of multiple applications working together to provide a complete bundle management experience.

## Project Structure

The project consists of the following applications:

- `assets/`: Web component for bundle configuration
- `bundle-api/`: Backend API service
- `bundle-viewer/`: Merchant Center custom view to display bundle information
- `mc-app/`: Merchant Center custom application


### 1. Merchant Center Application (mc-app)

A custom Merchant Center application for managing configurable bundles.

**Features:**
- Bundle configuration management
- Product attribute bundles
- Custom object bundles
- Feature flag support for different bundle types

**Configuration:**
- `CUSTOM_APPLICATION_ID`: The ID of the custom application
- `ENTRY_POINT_URI_PATH`: The entry point URI path
- `CLOUD_IDENTIFIER`: The cloud identifier
- `APPLICATION_URL`: Application URL
- `BUNDLE_FEATURE_FLAGS`: Comma-separated list of feature flags (default: "custom-object-bundle") available: "custom-object-bundle", "product-attribute-bundle"

### 2. MC custom view (bundle-viewer)

A custom Merchant Center view for displaying and interacting with bundles.

**Features:**
- Bundle visualization
- Interactive bundle configuration
- Integration with Merchant Center

**Configuration:**
- `CUSTOM_VIEW_ID`: The ID of the custom view application
- `ENTRY_POINT_URI_PATH`: The entry point URI path
- `CLOUD_IDENTIFIER`: The cloud identifier
- `API_ENDPOINT`: The entry point URI path of Bundle API

### 3. Bundle API (bundle-api)

A service application that handles the backend logic for bundle management.

**Features:**
- Product reference handling
- Category reference processing
- Bundle configuration resolution
- Error handling and logging

**Configuration:**
- `CTP_REGION`: commercetools API region (default: "us-central1.gcp")
- `CTP_PROJECT_KEY`: commercetools project key
- `CTP_CLIENT_ID`: commercetools client ID
- `CTP_SCOPE`: commercetools client scope
- `CTP_CLIENT_SECRET`: commercetools client secret (secured)

**API Endpoints:**

1. **Get Product by SKU**
   - **Endpoint:** `GET /bundle-api/product-by-sku`
   - **Query Parameters:**
     - `sku` (string): Product SKU
     - `limit` (number, optional): Limit for paginated results
     - `offset` (number, optional): Offset for paginated results
   - **Response:** Returns the product with resolved bundle configuration and schema

2. **Add to Cart**
   - **Endpoint:** `POST /bundle-api/add-to-cart`
   - **Request Body:**
     ```json
     {
       "cartId": "string",
       "productId": "string",
       "selections": {
         "componentTitle": {
           "quantity": number
         }
       }
     }
     ```
   - **Response:** Returns the updated cart with added bundle items


### 4. Assets - Web Component

A customizable web component for configuring product bundles with various display modes and pricing options.

**Installation**

```html
<script src="path/to/configurable-bundles.js"></script>
```

**Usage**

```html
<product-card
  sku="your-product-sku"
  baseurl="https://your-api-url"
  cartid="your-cart-id"
  locale="en-US">
</product-card>
```

**Properties**

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `sku` | string | Yes | - | The SKU of the product bundle to configure |
| `baseurl` | string | Yes | - | Base URL for the API endpoints |
| `cartid` | string | Yes | - | The ID of the shopping cart |
| `locale` | string | No | 'en-US' | Locale for formatting prices and text |
| `pricecountry` | string | No | - | Country code for price calculation |
| `pricecurrency` | string | No | - | Currency code for price display |
| `pricecustomergroup` | string | No | - | Customer group for price calculation |
| `pricechannel` | string | No | - | Sales channel for price calculation |
| `storeprojection` | string | No | - | Store projection for product data |

**CSS Custom Properties**

The component can be styled using CSS custom properties:

```css
product-card {
  --configurator-primary-color: #2563eb;
  --configurator-secondary-color: #1d4ed8;
  --configurator-background-color: white;
  --configurator-text-color: #1f2937;
  --configurator-border-color: #e5e7eb;
  --configurator-error-color: #dc2626;
  --configurator-success-color: #059669;
}
```

**Events**

| Event Name | Detail | Description |
|------------|--------|-------------|
| `configuration-complete` | `{ selections: Object }` | Fired when configuration is complete |
| `selection-change` | `{ componentTitle: string, productId: string, checked: boolean }` | Fired when a component selection changes |
| `quantity-change` | `{ componentTitle: string, quantity: number }` | Fired when a component quantity changes |

**Example**

```html
<product-card
  sku="BUNDLE-123"
  baseurl="https://api.example.com"
  cartid="cart-456"
  locale="en-US"
  pricecountry="US"
  pricecurrency="USD"
  pricecustomergroup="VIP"
  pricechannel="web"
  storeprojection="main">
</product-card>

<script>
  const productCard = document.querySelector('product-card');
  
  productCard.addEventListener('configuration-complete', (e) => {
    console.log('Configuration complete:', e.detail.selections);
  });

  productCard.addEventListener('selection-change', (e) => {
    console.log('Selection changed:', e.detail);
  });

  productCard.addEventListener('quantity-change', (e) => {
    console.log('Quantity changed:', e.detail);
  });
</script>
```

**Display Modes**

The component supports multiple display modes that can be configured through the product bundle schema:

- Wizard: Step-by-step configuration
- Accordion: Expandable sections
- Grid: All components visible at once (not implemented yet)
- Carousel: Sliding component selection (not implemented yet)

The display mode is determined by the `bundleSchema.bundleUISettings.displayMode` property in the product data.

## Getting Started

1. Clone the repository
2. Configure the environment variables for each application according to their requirements
3. Install dependencies for each application
4. Start the development servers

## Development

Each application can be developed independently:

- **mc-app**: Merchant Center custom application
- **bundle-viewer**: Bundle visualization application
- **bundle-api**: Backend service
- **assets**: Static assets

## Deployment

The project uses Netlify for deployment, configured via `netlify.toml`. The Connect Cloud configuration is managed through `connect.yaml`.

### Connect Cloud Configuration

The project is configured to deploy multiple applications:
- Merchant Center custom applications (mc-app, bundle-viewer)
- Backend service (bundle-api)
- Static assets

## Security

Sensitive configuration values are handled securely through the Connect Cloud secured configuration system.

## Feature Flags

The system supports feature flags for different bundle types:
- custom-object-bundle
- product-attribute-bundle

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
