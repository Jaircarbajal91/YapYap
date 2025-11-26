# Heroku Deployment Guide for YapYap

This guide explains how to deploy YapYap to Heroku with automated deployments via GitHub Actions.

## Overview

YapYap is configured for automated deployment to Heroku. When you merge code to the `main` branch, GitHub Actions automatically deploys the application to Heroku.

## Prerequisites

1. A Heroku account (sign up at [heroku.com](https://www.heroku.com))
2. Heroku CLI installed locally (optional, for manual operations)
3. A Heroku app created for this project
4. GitHub repository with Actions enabled

## Quick Command-Line Setup

Complete setup in one go - copy and paste these commands (replace values as needed):

```bash
# 1. Login to Heroku (if not already logged in)
heroku login

# 2. Create Heroku app (replace 'your-app-name' with your desired name)
heroku create your-app-name

# 3. Add Postgres database
heroku addons:create heroku-postgresql:essential-0

# 4. Generate and set JWT secret
heroku config:set JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")

# 5. Set other required environment variables
heroku config:set JWT_EXPIRES_IN=604800
heroku config:set S3_BUCKET=your_bucket_name
heroku config:set S3_REGION=us-east-1
heroku config:set S3_KEY=your_aws_access_key_id
heroku config:set S3_SECRET=your_aws_secret_access_key

# 6. Get Heroku API key for GitHub Actions
echo "Your Heroku API Key:"
heroku auth:token

# 7. Show your app name (for GitHub secrets)
heroku apps:info --app your-app-name | grep "Name:"
```

### Setting GitHub Secrets via Command Line

Install GitHub CLI (`gh`) if you haven't already, then set secrets:

```bash
# Login to GitHub CLI
gh auth login

# Set Heroku API key (get it from step 6 above)
gh secret set HEROKU_API_KEY --body "$(heroku auth:token)"

# Set Heroku app name (replace with your actual app name)
gh secret set HEROKU_APP_NAME --body "your-app-name"
```

Or manually add via GitHub web interface using the values from steps 6-7 above.

---

## Initial Setup (Detailed)

### 1. Create Heroku App

```bash
heroku create your-app-name
```

### 2. Add Postgres Database

```bash
heroku addons:create heroku-postgresql:essential-0
```

Or use the default plan:
```bash
heroku addons:create heroku-postgresql
```

**Note:** The `mini` plan has reached end-of-life. The current entry-level plan is `essential-0` ($5/month).

This automatically sets the `DATABASE_URL` environment variable.

View all available plans:
```bash
heroku addons:plans heroku-postgresql
```

### 3. Configure GitHub Secrets

**Option A: Using GitHub CLI (`gh`)**

```bash
# Install GitHub CLI if needed: brew install gh (macOS) or apt install gh (Linux)
gh auth login

# Set secrets
gh secret set HEROKU_API_KEY --body "$(heroku auth:token)"
gh secret set HEROKU_APP_NAME --body "$(heroku apps:info | grep 'Name:' | awk '{print $2}')"
```

**Option B: Manual setup via command line**

Get the values you need:
```bash
# Get Heroku API key
heroku auth:token

# Get your app name
heroku apps:info | grep "Name:"
```

Then add them manually at: GitHub repository → Settings → Secrets and variables → Actions

### 4. Configure Heroku Environment Variables

**Generate JWT Secret:**
```bash
heroku config:set JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_hex(32))")
```

**Or using OpenSSL:**
```bash
heroku config:set JWT_SECRET=$(openssl rand -hex 32)
```

**Set all environment variables:**
```bash
heroku config:set JWT_EXPIRES_IN=604800
heroku config:set S3_BUCKET=your_bucket_name
heroku config:set S3_REGION=us-east-1
heroku config:set S3_KEY=your_aws_access_key_id
heroku config:set S3_SECRET=your_aws_secret_access_key
```

**Verify all config vars are set:**
```bash
heroku config
```

**Note:** `DATABASE_URL` is automatically set when you add the Postgres addon. `NODE_ENV` is automatically set to `production` by Heroku.

## Deployment Process

### Automated Deployment

The deployment process is fully automated:

1. **Push to Main**: When you merge a pull request or push directly to the `main` branch, GitHub Actions triggers automatically.

2. **Build Process**:
   - Checks out the code
   - Sets up Node.js environment
   - Installs Heroku CLI
   - Pushes code to Heroku

3. **Heroku Build**:
   - Runs `heroku-postbuild` script to build the frontend
   - Installs backend and frontend dependencies
   - Runs database migrations via the `release` command in `Procfile`

4. **Deployment Complete**: Your app is live at `https://your-app-name.herokuapp.com`

### Manual Deployment (Alternative)

If you need to deploy manually:

```bash
git push heroku main
```

Or if your main branch is called `main`:

```bash
git push heroku HEAD:main
```

## Project Structure

The deployment uses a monorepo structure:

```
YapYap/
├── backend/          # Express.js backend
├── frontend/         # React + Vite frontend
├── Procfile          # Heroku process definitions
└── package.json      # Root package.json with heroku-postbuild
```

### Key Files for Deployment

- **`Procfile`**: Defines how to run the app and run migrations
  - `web`: Starts the backend server
  - `release`: Runs database migrations before deployment

- **`.github/workflows/deploy.yml`**: GitHub Actions workflow for automated deployment

- **`package.json`** (root):
  - `heroku-postbuild`: Builds the frontend during deployment
  - `start`: Starts the backend server

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Auto-set by Heroku Postgres addon |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `JWT_EXPIRES_IN` | JWT token expiration time | `604800` (7 days in seconds) |
| `S3_BUCKET` | AWS S3 bucket name for file uploads | `yapyap-uploads` |
| `S3_REGION` | AWS region | `us-east-1` |
| `S3_KEY` | AWS access key ID | Your AWS access key |
| `S3_SECRET` | AWS secret access key | Your AWS secret key |
| `NODE_ENV` | Environment mode | `production` (auto-set) |

### Optional Frontend Variables

You can optionally set these if you need to override the default socket.io URL:

- `REACT_APP_SOCKET_IO_URL`: Custom Socket.IO server URL (defaults to `window.location.origin` in production)

## Database Migrations

Database migrations run automatically during deployment via the `release` command in `Procfile`:

```
release: npm run --prefix backend sequelize db:migrate
```

This ensures your database schema is always up to date before the new version of your app goes live.

## Troubleshooting

### Deployment Fails on GitHub Actions

1. **Check GitHub Secrets**: Ensure `HEROKU_API_KEY` and `HEROKU_APP_NAME` are set correctly
2. **Check Heroku App Name**: Verify the app name matches your actual Heroku app
3. **View Logs**: Check GitHub Actions logs for specific error messages

### App Crashes After Deployment

1. **Check Heroku Logs**:
   ```bash
   heroku logs --tail
   ```

2. **Verify Environment Variables**: Ensure all required environment variables are set
   ```bash
   heroku config
   ```

3. **Check Database Connection**: Verify Postgres addon is added and `DATABASE_URL` is set

### Frontend Not Loading

1. **Check Build Process**: Ensure `heroku-postbuild` completes successfully
2. **Verify Static File Paths**: Check that frontend build folder is being served correctly
3. **Check Routes**: Ensure the catch-all route in `backend/routes/index.js` is working

### Socket.IO Connection Issues

1. **Verify CORS Settings**: Production CORS is configured in `backend/bin/www`
2. **Check Environment Variables**: Socket.IO URL defaults to `window.location.origin` in production
3. **Verify SSL**: Ensure your Heroku app is using HTTPS (default for *.herokuapp.com)

### Database Migration Failures

1. **Run Migrations Manually**:
   ```bash
   heroku run npm run --prefix backend sequelize db:migrate
   ```

2. **Check Migration Files**: Verify migration files are valid and in the correct directory

3. **Rollback if Needed**:
   ```bash
   heroku run npm run --prefix backend sequelize db:migrate:undo
   ```

## Local Development vs Production

### Development
- Uses SQLite database (`backend/db/dev.db`)
- Frontend runs on `localhost:3000`
- Backend runs on `localhost:8000`
- CORS enabled for local development

### Production
- Uses PostgreSQL (Heroku Postgres)
- Frontend and backend served from same origin
- CORS disabled (same-origin connections)
- Environment variables from Heroku config

## Useful Heroku Commands

### Viewing Information

```bash
# View all config vars
heroku config

# View a specific config var
heroku config:get JWT_SECRET

# View app info
heroku apps:info

# View logs (live tail)
heroku logs --tail

# View recent logs
heroku logs -n 100

# Check app status and dynos
heroku ps

# Check database status
heroku pg:info

# Check database connection
heroku pg:credentials:url
```

### Running Commands

```bash
# Open app in browser
heroku open

# Run a one-off command (e.g., migrations)
heroku run npm run --prefix backend sequelize db:migrate

# Run a bash shell in dyno
heroku run bash

# Run Node.js console
heroku run node

# Execute a specific command
heroku run "npm run --prefix backend sequelize db:seed:all"
```

### Managing the App

```bash
# Restart app
heroku restart

# Restart specific dyno
heroku restart web.1

# Scale dynos
heroku ps:scale web=1

# Stop app
heroku ps:scale web=0

# View app maintenance mode
heroku maintenance

# Enable maintenance mode
heroku maintenance:on

# Disable maintenance mode
heroku maintenance:off
```

### Managing Environment Variables

```bash
# Set a config var
heroku config:set KEY=value

# Get a config var
heroku config:get KEY

# Remove a config var
heroku config:unset KEY

# Set multiple config vars at once
heroku config:set KEY1=value1 KEY2=value2 KEY3=value3
```

### Database Operations

```bash
# Connect to database via psql
heroku pg:psql

# Create database backup
heroku pg:backups:capture

# List backups
heroku pg:backups

# Download latest backup
heroku pg:backups:download

# Restore from backup
heroku pg:backups:restore BACKUP_URL

# Schedule automatic backups
heroku pg:backups:schedule DATABASE_URL --at '02:00 UTC'

# Run migrations
heroku run npm run --prefix backend sequelize db:migrate

# Rollback last migration
heroku run npm run --prefix backend sequelize db:migrate:undo

# Check migration status
heroku run npm run --prefix backend sequelize db:migrate:status
```

## Monitoring and Maintenance

### Logs

Monitor your app logs:
```bash
heroku logs --tail
```

Or view logs in the Heroku Dashboard.

### Database Backups

Enable automatic backups:
```bash
heroku pg:backups:schedule DATABASE_URL --at '02:00 UTC'
```

Create manual backup:
```bash
heroku pg:backups:capture
```

### Scaling

Your app runs on a free dyno by default. To scale:

```bash
heroku ps:scale web=1
```

For production workloads, consider upgrading to paid dynos for better performance.

## Security Considerations

1. **Never commit secrets**: All sensitive data should be in Heroku config vars or GitHub secrets
2. **Use strong JWT secrets**: Generate a secure random string for `JWT_SECRET`
3. **Rotate keys regularly**: Periodically update AWS keys and JWT secrets
4. **Enable SSL**: Heroku provides SSL by default for *.herokuapp.com domains
5. **Review dependencies**: Regularly update npm packages for security patches

## Support

For issues with:
- **Heroku**: Check [Heroku Dev Center](https://devcenter.heroku.com/)
- **GitHub Actions**: Check [GitHub Actions Documentation](https://docs.github.com/en/actions)
- **This Project**: Check the main README.md or open an issue in the repository

