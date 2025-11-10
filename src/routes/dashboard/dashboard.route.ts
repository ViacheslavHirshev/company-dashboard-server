import { Router } from "express";
import { jwtAuthMiddleware } from "../../middleware/jwtAuthMiddleware";
import {
  getDashboardCompanies,
  getDashboardUsers,
  getDashboardAdmins,
  postDashboardAdmin,
  putDashboardAdmin,
  getDashboard,
  getDashboardAdmin,
  deleteDashboardAdmin,
} from "./dashboard.controller";
import { roleAccessMiddlware } from "../../middleware/roleAccessMiddleware";

const dashboardRouter = Router();

dashboardRouter.use(jwtAuthMiddleware);

dashboardRouter.get("/", roleAccessMiddlware("user"), getDashboard);

dashboardRouter.get(
  ["/admin/users", "/superadmin/users"],
  roleAccessMiddlware("admin", "superadmin"),
  getDashboardUsers
);

dashboardRouter.get(
  ["/admin/companies", "/superadmin/companies"],
  roleAccessMiddlware("admin", "superadmin"),
  getDashboardCompanies
);

dashboardRouter.get(
  "/superadmin/admins",
  roleAccessMiddlware("superadmin"),
  getDashboardAdmins
);

dashboardRouter.post(
  "/superadmin/admins",
  roleAccessMiddlware("superadmin"),
  postDashboardAdmin
);

dashboardRouter.get(
  "/superadmin/admins/:id",
  roleAccessMiddlware("superadmin"),
  getDashboardAdmin
);

dashboardRouter.put(
  "/superadmin/admins/:id",
  roleAccessMiddlware("superadmin"),
  putDashboardAdmin
);

dashboardRouter.delete(
  "/superadmin/admins/:id",
  roleAccessMiddlware("superadmin"),
  deleteDashboardAdmin
);

export default dashboardRouter;

/**
 * @openapi
 * /app/dashboard:
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
 * /app/dashboard/admin/users:
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
 * /app/dashboard/superadmin/users:
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
 * /app/dashboard/admin/companies:
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
 * /app/dashboard/superadmin/companies:
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
 * /app/dashboard/superadmin/admins:
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
 * /app/dashboard/superadmin/admins:
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
 * /app/dashboard/superadmin/admins/{id}:
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
 * /app/dashboard/superadmin/admins/{id}:
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
 * /app/dashboard/superadmin/admins/{id}:
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
