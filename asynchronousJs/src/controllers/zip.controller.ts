import ZipService from "../services/zip.service.js";
import { Request, Response } from "express";

export default class ZipController {
  static scope = "scoped";
  zipService: ZipService;
  constructor(zipService: ZipService) {
    this.zipService = zipService;
  }

  upload = async (req: Request, res: Response) => res
      .status(201)
      .json(
        await this.zipService.process(
          req.file ? `${req.file.path}` : req.body,
          Array.isArray(req.headers["x-request-id"])
            ? req.headers["x-request-id"][0]
            : req.headers["x-request-id"] || "",
        ),
      );
}