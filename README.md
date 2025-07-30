# CAP PostgreSQL Sample

This project demonstrates a simple [SAP Cloud Application Programming Model](https://cap.cloud.sap/) service using a PostgreSQL database. Metadata from external OData services is fetched during entity creation and stored in the database.

## Project Setup

1. Install dependencies
   ```bash
   npm install
   ```
   This project uses **@cap-js/postgres** for database connectivity and
   requires Node.js 20 or higher.
2. Create configuration files in the project root:
   - **`pg-db-config.json`** – PostgreSQL connection details
   - **`settings.json`** – Credentials for fetching OData metadata
3. Deploy the database schema (run once)
   ```bash
   npx cds deploy --model-only
   ```
   This creates the `cds_model` table and avoids errors like
   "Didn't find deployed model for PostgreSQL" on first deployment.
   Repeat `npx cds deploy` when the model changes.
4. Start in development mode
   ```bash
   npm run watch
   ```
5. Start in production
   ```bash
   npm start
   ```

## Configuration Files

### `pg-db-config.json`
Example:
```json
{
  "host": "xyz.db.sap.com",
  "port": 5432,
  "user": "admin",
  "password": "mypassword",
  "database": "mydb",
  "ssl": true
}
```

### `settings.json`
Example:
```json
{
  "username": "odatauser",
  "password": "odatapass"
}
```

Both files are ignored via `.gitignore` and must be provided per environment.

## Usage

The service exposes `CatalogService/ODataServices`.

Example payload for **POST /odata/v4/CatalogService/ODataServices**:
```json
{
  "ID": "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
  "base_url": "https://services.odata.org/v2",
  "service_name": "OData/OData.svc",
  "description": "OData sample",
  "active": true
}
```
On creation, the handler will fetch `${base_url}/${service_name}/$metadata` using basic authentication from `settings.json`. The raw metadata XML/JSON is stored in the `metadata_raw` column.

## Metadata Fetching Logic

The custom `CREATE` handler in `srv/service.js` retrieves the metadata via HTTP using `axios`. If the request fails (for example, invalid credentials or unavailable service) the create is rejected with an error message. Credentials are read once during service startup. Missing configuration files result in warnings and default behavior.

## Security Best Practices

- Do **not** commit `pg-db-config.json` or `settings.json` – both files are listed in `.gitignore`.
- Use environment-specific credentials and rotate them regularly.
- Ensure network traffic to the OData service is secured via HTTPS.

## Fiori Elements

The exposed OData service can be consumed by Fiori Elements applications. When deploying to SAP BTP, Fiori tools can generate a UI bound to the `ODataServices` entity for maintaining entries.

## License

See [LICENSE](LICENSE) for details.
