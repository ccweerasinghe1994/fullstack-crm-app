import { Router } from "express";
import type { CustomerController } from "../controllers/customer.controller";

export function createCustomerRoutes(controller: CustomerController): Router {
  const router = Router();

  // GET /api/customers - Get all customers
  router.get("/", (req, res, next) => {
    controller.getAllCustomers(req, res).catch(next);
  });

  // GET /api/customers/count - Get customer count
  router.get("/count", (req, res, next) => {
    controller.getCustomerCount(req, res).catch(next);
  });

  // GET /api/customers/:id - Get customer by ID
  router.get("/:id", (req, res, next) => {
    controller.getCustomerById(req, res).catch(next);
  });

  // POST /api/customers - Create new customer
  router.post("/", (req, res, next) => {
    controller.createCustomer(req, res).catch(next);
  });

  // PUT /api/customers/:id - Update customer
  router.put("/:id", (req, res, next) => {
    controller.updateCustomer(req, res).catch(next);
  });

  // DELETE /api/customers/:id - Delete customer
  router.delete("/:id", (req, res, next) => {
    controller.deleteCustomer(req, res).catch(next);
  });

  return router;
}
