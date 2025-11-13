/**
 * @openapi
 * /auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with basic information (first name, last name, email, password).
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssw0rd123
 *     responses:
 *       200:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /auth/sign-in:
 *   post:
 *     summary: User login
 *     description: Authenticates a user using email and password. Returns access and refresh tokens along with user profile data.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: P@ssw0rd123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userRole:
 *                   type: string
 *                   example: user
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: User successfully loged-in
 *       400:
 *         description: Invalid credentials or missing fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Incorrect password
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /companies:
 *   get:
 *     summary: Get all companies of the authenticated user
 *     description: Returns a paginated list of companies created by the current user. Supports sorting and filtering by date, capital, and service.
 *     tags:
 *       - Companies (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by (company_name or service)
 *         schema:
 *           type: string
 *           enum: [company_name, service]
 *       - name: sortOrder
 *         in: query
 *         description: Sort order (ascending or descending)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: minCapital
 *         in: query
 *         description: Minimum company capital
 *         schema:
 *           type: number
 *       - name: maxCapital
 *         in: query
 *         description: Maximum company capital
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Filter companies created after this date (ISO format)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Filter companies created before this date (ISO format)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved user companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       service:
 *                         type: string
 *                       capital:
 *                         type: number
 *                         example: 50000
 *       403:
 *         description: Unauthorized or forbidden access
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /companies/{id}:
 *   get:
 *     summary: Get a specific company by ID
 *     description: Returns detailed information about a single company belonging to the authenticated user.
 *     tags:
 *       - Companies (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     name: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *                     capital: { type: number }
 *                     address: { type: string }
 *                     service: { type: string }
 *                     logoPath: { type: string }
 *       404:
 *         description: Company not found
 *       403:
 *         description: Forbidden access
 */

/**
 * @openapi
 * /companies:
 *   post:
 *     summary: Create a new company
 *     description: Creates a new company record for the authenticated user. Supports optional company logo upload.
 *     tags:
 *       - Companies (User)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - createdAt
 *               - capital
 *               - service
 *               - country
 *               - city
 *               - street
 *               - streetNumber
 *             properties:
 *               companyName:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date
 *               capital:
 *                 type: number
 *               service:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               streetNumber:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Company successfully created
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Unauthorized or forbidden access
 */

/**
 * @openapi
 * /companies/{id}:
 *   put:
 *     summary: Update company information
 *     description: Updates the basic company details such as name, capital, service, and address fields.
 *     tags:
 *       - Companies (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - createdAt
 *               - capital
 *               - service
 *               - country
 *               - city
 *               - street
 *               - streetNumber
 *             properties:
 *               companyName: { type: string }
 *               createdAt: { type: string, format: date }
 *               capital: { type: number }
 *               service: { type: string }
 *               country: { type: string }
 *               city: { type: string }
 *               street: { type: string }
 *               streetNumber: { type: string }
 *     responses:
 *       200:
 *         description: Company successfully updated
 *       404:
 *         description: Company not found
 *       403:
 *         description: Unauthorized or forbidden access
 */

/**
 * @openapi
 * /companies/{id}:
 *   patch:
 *     summary: Update or delete company logo
 *     description: >
 *       Allows a user to upload a new company logo or delete the existing one.
 *       If `deleteLogo=true` is provided, the current logo will be removed and replaced with a fallback image.
 *     tags:
 *       - Companies (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *           example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               deleteLogo:
 *                 type: boolean
 *                 description: Set to `true` to delete the current logo instead of uploading a new one
 *                 example: false
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: New logo image file (optional)
 *     responses:
 *       200:
 *         description: Logo updated or deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar updated
 *                 logoPath:
 *                   type: string
 *                   example: https://api.example.com/uploads/logotypes/company123.png
 *       400:
 *         description: Missing or invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request
 *       403:
 *         description: Unauthorized or forbidden
 *       404:
 *         description: Company not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /companies/{id}:
 *   delete:
 *     summary: Delete a company
 *     description: Permanently deletes a company owned by the authenticated user.
 *     tags:
 *       - Companies (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company successfully deleted
 *       404:
 *         description: Company not found
 *       403:
 *         description: Unauthorized or forbidden access
 */

/**
 * @openapi
 * /companies/admin:
 *   get:
 *     summary: Get all companies (admin)
 *     description: Returns a paginated list of all companies in the system
 *     tags:
 *       - Companies (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by (company_name or service)
 *         schema:
 *           type: string
 *           enum: [company_name, service]
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: minCapital
 *         in: query
 *         description: Minimum company capital
 *         schema:
 *           type: number
 *       - name: maxCapital
 *         in: query
 *         description: Maximum company capital
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Filter companies created after this date (ISO format)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Filter companies created before this date (ISO format)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved all companies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       name: { type: string }
 *                       service: { type: string }
 *       403:
 *         description: Forbidden access (only admin or superadmin allowed)
 *       500:
 *         description: Internal server error
 *
 * /companies/superadmin:
 *   get:
 *     summary: Get all companies (superadmin)
 *     description: Returns a paginated list of all companies in the system. Identical to the admin endpoint, but also accessible to superadmin.
 *     tags:
 *       - Companies (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by (company_name or service)
 *         schema:
 *           type: string
 *           enum: [company_name, service]
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: minCapital
 *         in: query
 *         description: Minimum company capital
 *         schema:
 *           type: number
 *       - name: maxCapital
 *         in: query
 *         description: Maximum company capital
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Filter companies created after this date (ISO format)
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Filter companies created before this date (ISO format)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved all companies
 *       403:
 *         description: Forbidden access (only admin or superadmin allowed)
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /companies/admin/{id}:
 *   get:
 *     summary: Get detailed company info (admin or superadmin only)
 *     description: Returns detailed information about a specific company, including the owner's name and logo URL.
 *     tags:
 *       - Companies (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 company:
 *                   type: object
 *                   properties:
 *                     id: { type: integer }
 *                     name: { type: string }
 *                     createdAt: { type: string, format: date-time }
 *                     capital: { type: number }
 *                     address: { type: string }
 *                     service: { type: string }
 *                     logoPath: { type: string }
 *                     owner:
 *                       type: object
 *                       properties:
 *                         firstName: { type: string }
 *                         lastName: { type: string }
 *       404:
 *         description: Company not found
 *       403:
 *         description: Forbidden access (only admin or superadmin allowed)
 *
 * /app/companies/superadmin/{id}:
 *   get:
 *     summary: Get detailed company info (superadmin)
 *     description: Identical to the admin route, but also accessible to superadmin.
 *     tags:
 *       - Companies (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Company ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Company details retrieved successfully
 *       404:
 *         description: Company not found
 *       403:
 *         description: Forbidden access (only admin or superadmin allowed)
 */

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     description: Returns total number of user’s companies, total capital, and a paginated list of their companies. Requires user role.
 *     tags:
 *       - Dashboard (User)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         schema:
 *           type: string
 *           enum: [company_name, service]
 *           example: company_name
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *       - name: minCapital
 *         in: query
 *         description: Minimum company capital
 *         schema:
 *           type: number
 *           example: 10000
 *       - name: maxCapital
 *         in: query
 *         description: Maximum company capital
 *         schema:
 *           type: number
 *           example: 1000000
 *       - name: startDate
 *         in: query
 *         description: Filter by creation date (from)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - name: endDate
 *         in: query
 *         description: Filter by creation date (to)
 *         schema:
 *           type: string
 *           format: date
 *           example: "2025-01-01"
 *     responses:
 *       200:
 *         description: Successfully retrieved user dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companiesNumber:
 *                   type: integer
 *                   example: 5
 *                 totalCapital:
 *                   type: number
 *                   example: 250000
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Acme Corp"
 *                       service:
 *                         type: string
 *                         example: "IT Services"
 *                       capital:
 *                         type: number
 *                         example: 50000
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/admin/users:
 *   get:
 *     summary: Get paginated list of users (admin or superadmin only)
 *     description: Returns total count and a paginated list of all users with role "user".
 *     tags:
 *       - Dashboard (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sortBy
 *         in: query
 *         description: Sort by first or last name
 *         schema:
 *           type: string
 *           enum: [firstname, lastname]
 *           example: firstname
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *     responses:
 *       200:
 *         description: Successfully retrieved user list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usersTotal:
 *                   type: integer
 *                   example: 123
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       firstName:
 *                         type: string
 *                         example: "Alice"
 *                       lastName:
 *                         type: string
 *                         example: "Johnson"
 *       403:
 *         description: Forbidden — only admin or superadmin can access
 *       500:
 *         description: Internal server error
 *
 * /dashboard/superadmin/users:
 *   get:
 *     summary: Get paginated list of users (superadmin)
 *     description: Same as admin endpoint, accessible to superadmin role as well.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sortBy
 *         in: query
 *         description: Sort by first or last name
 *         schema:
 *           type: string
 *           enum: [firstname, lastname]
 *           example: firstname
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *     responses:
 *       200:
 *         description: Successfully retrieved user list
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/admin/companies:
 *   get:
 *     summary: Get paginated list of all companies (admin or superadmin)
 *     description: Returns total number of companies and a paginated list of all companies in the system.
 *     tags:
 *       - Dashboard (Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         schema:
 *           type: string
 *           enum: [company_name, service]
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: minCapital
 *         in: query
 *         description: Minimum company capital
 *         schema:
 *           type: number
 *       - name: maxCapital
 *         in: query
 *         description: Maximum company capital
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Filter companies created after this date
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Filter companies created before this date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved companies data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companiesNumber:
 *                   type: integer
 *                   example: 50
 *                 companies:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, example: 5 }
 *                       name: { type: string, example: "Tech Innovations" }
 *                       service: { type: string, example: "Consulting" }
 *       403:
 *         description: Forbidden — only admin or superadmin allowed
 *       500:
 *         description: Internal server error
 *
 * /dashboard/superadmin/companies:
 *   get:
 *     summary: Get paginated list of all companies (superadmin)
 *     description: Same as the admin companies endpoint, but also accessible to superadmin.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *       - name: sortBy
 *         in: query
 *         description: Field to sort by
 *         schema:
 *           type: string
 *           enum: [company_name, service]
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - name: minCapital
 *         in: query
 *         description: Minimum company capital
 *         schema:
 *           type: number
 *       - name: maxCapital
 *         in: query
 *         description: Maximum company capital
 *         schema:
 *           type: number
 *       - name: startDate
 *         in: query
 *         description: Filter companies created after this date
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: Filter companies created before this date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Successfully retrieved companies data
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/superadmin/admins:
 *   get:
 *     summary: Get paginated list of all admins (superadmin only)
 *     description: Returns total number of admins and a paginated list of admin accounts in the system.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number (default is 1)
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page (default is 10)
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: sortBy
 *         in: query
 *         description: Sort by first or last name
 *         schema:
 *           type: string
 *           enum: [firstname, lastname]
 *           example: firstname
 *       - name: sortOrder
 *         in: query
 *         description: Sort order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           example: asc
 *     responses:
 *       200:
 *         description: Successfully retrieved list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 adminsTotal:
 *                   type: integer
 *                   example: 12
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 4
 *                       firstName:
 *                         type: string
 *                         example: "Michael"
 *                       lastName:
 *                         type: string
 *                         example: "Smith"
 *       403:
 *         description: Forbidden — only superadmin allowed
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/superadmin/admins:
 *   post:
 *     summary: Create a new admin (superadmin only)
 *     description: Creates a new admin account. All fields are required.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Alice"
 *               lastName:
 *                 type: string
 *                 example: "Johnson"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alice.johnson@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongP@ssword1
 *     responses:
 *       200:
 *         description: Admin successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin created successfully
 *       400:
 *         description: Missing or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       403:
 *         description: Forbidden — only superadmin allowed
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/superadmin/admins/{id}:
 *   get:
 *     summary: Get detailed admin info (superadmin only)
 *     description: Returns profile information about a specific admin, including avatar and contact details.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Successfully retrieved admin details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 5
 *                     firstName:
 *                       type: string
 *                       example: "Sarah"
 *                     lastName:
 *                       type: string
 *                       example: "Williams"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: sarah.williams@example.com
 *                     avatar:
 *                       type: string
 *                       example: https://api.example.com/uploads/avatars/sarah.png
 *       404:
 *         description: Admin not found
 *       403:
 *         description: Forbidden — only superadmin allowed
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/superadmin/admins/{id}:
 *   put:
 *     summary: Update admin information (superadmin only)
 *     description: Updates the specified admin’s profile fields such as first name and last name. Requires superadmin privileges.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Admin ID to update
 *         schema:
 *           type: integer
 *           example: 7
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "David"
 *               lastName:
 *                 type: string
 *                 example: "Taylor"
 *     responses:
 *       200:
 *         description: Admin information successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin updated
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 7
 *                     firstName:
 *                       type: string
 *                       example: "David"
 *                     lastName:
 *                       type: string
 *                       example: "Taylor"
 *       400:
 *         description: Invalid or missing request data
 *       403:
 *         description: Forbidden — only superadmin allowed
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /dashboard/superadmin/admins/{id}:
 *   delete:
 *     summary: Delete admin (superadmin only)
 *     description: Permanently deletes an admin account. This action can only be performed by a superadmin.
 *     tags:
 *       - Dashboard (Superadmin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Admin ID to delete
 *         schema:
 *           type: integer
 *           example: 7
 *     responses:
 *       200:
 *         description: Admin successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin deleted
 *       403:
 *         description: Forbidden — only superadmin allowed
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Returns the authenticated user's profile information including name, avatar, and role.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     avatar:
 *                       type: string
 *                       example: "https://api.example.com/uploads/avatars/john.png"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /profile:
 *   put:
 *     summary: Update user profile data
 *     description: Updates the user's first and last name. Requires authentication.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Michael"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *     responses:
 *       200:
 *         description: Successfully updated user profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User data updated
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     firstName:
 *                       type: string
 *                       example: "Michael"
 *                     lastName:
 *                       type: string
 *                       example: "Smith"
 *       400:
 *         description: Missing or invalid fields
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /profile:
 *   patch:
 *     summary: Update or delete user avatar
 *     description: Uploads a new avatar image or deletes the existing one if `deleteAvatar=true` is provided.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               deleteAvatar:
 *                 type: boolean
 *                 description: Set true to delete the current avatar
 *                 example: false
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: New avatar image file
 *     responses:
 *       200:
 *         description: Avatar updated or deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Avatar updated
 *                 avatar:
 *                   type: string
 *                   example: "https://api.example.com/uploads/avatars/new-avatar.png"
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /profile/password-change:
 *   put:
 *     summary: Change user password
 *     description: Allows an authenticated user to change their password by providing the current and new password.
 *     tags:
 *       - Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *                 example: OldPass123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 example: NewStrongPass456
 *     responses:
 *       200:
 *         description: Password successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated
 *       400:
 *         description: Missing or invalid fields
 *       403:
 *         description: Unauthorized or forbidden
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /refresh:
 *   get:
 *     summary: Refresh access token
 *     description: Verifies a valid refresh token and returns a new access token.
 *       The refresh token must be provided in the `Authorization` header as a Bearer token.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully generated new access token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access token refreshed
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       403:
 *         description: Missing or invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Verification error
 *       500:
 *         description: Internal server error
 */
