# Configurable Bundles

A comprehensive solution for managing and viewing configurable bundles in commercetools, consisting of multiple applications working together to provide a complete bundle management experience.

## Project Structure

The project consists of the following applications:

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
- `CUSTOM_APPLICATION_ID`: The ID of the custom application
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

### 4. Assets

Static assets used across the applications.

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
