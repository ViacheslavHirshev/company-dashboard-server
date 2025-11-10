import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  adminGetCompanies,
  adminGetCompany,
  userAddNewCompany,
  userDeleteCompany,
  userGetCompanies,
  userGetCompany,
  userUpdateCompanyInfo,
  userUpdateCompanyLogo,
} from "./companies.controller";
import { uploadLogo } from "../../config/multer";
import { roleAccessMiddlware } from "../../middleware/roleAccessMiddleware";

const companiesRouter = Router();

companiesRouter.use(jwtAuthMiddleware);

companiesRouter.get("/", roleAccessMiddlware("user"), userGetCompanies);

companiesRouter.get(
  ["/admin", "/superadmin"],
  roleAccessMiddlware("admin", "superadmin"),
  adminGetCompanies
);

companiesRouter.post(
  "/",
  roleAccessMiddlware("user"),
  uploadLogo.single("logo"),
  userAddNewCompany
);

companiesRouter.get(
  ["/admin/:id", "/superadmin/:id"],
  roleAccessMiddlware("admin", "superadmin"),
  adminGetCompany
);

companiesRouter.get("/:id", roleAccessMiddlware("user"), userGetCompany);

companiesRouter.put("/:id", roleAccessMiddlware("user"), userUpdateCompanyInfo);

companiesRouter.patch(
  "/:id",
  roleAccessMiddlware("user"),
  uploadLogo.single("logo"),
  userUpdateCompanyLogo
);
companiesRouter.delete("/:id", roleAccessMiddlware("user"), userDeleteCompany);

export default companiesRouter;

/**
 * @openapi
 * /app/companies:
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
 *       403:
 *         description: Unauthorized or forbidden access
 *       500:
 *         description: Internal server error
 */

/**
 * @openapi
 * /app/companies/{id}:
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
 * /app/companies:
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
 * /app/companies/{id}:
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
 * /app/companies/{id}:
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
 * /app/companies/{id}:
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
 * /app/companies/admin:
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
 * /app/companies/superadmin:
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
 * /app/companies/admin/{id}:
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
