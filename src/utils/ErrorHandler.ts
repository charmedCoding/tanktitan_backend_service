import { ValidateError } from "tsoa"
import { Response, Request, NextFunction } from "express"

export class ExtendedError extends Error {
	errorType: string
}

export class BadRequestError extends ExtendedError {}
export class UnauthorizedError extends ExtendedError {}
export class NotFoundError extends ExtendedError {}
export class ConflictError extends ExtendedError {}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response | void {
	switch (err.constructor) {
		case BadRequestError:
			return res.status(400).json({
				errorType: "BadRequestError",
				message: err.message,
			})
		case SyntaxError:
			return res.status(400).json({
				errorType: "SyntaxError",
				message: err.message,
			})
		case UnauthorizedError:
			return res.status(401).json({
				errorType: "UnauthorizedError",
				message: "Wrong Credentials",
			})
		case NotFoundError:
			return res.status(404).json({
				errorType: "NotFoundError",
				message: "Not Found",
			})
		case ConflictError:
			return res.status(409).json({
				errorType: "ConflictError",
				message: err.message,
			})
		case Error:
			return res.status(500).json({
				errorType: "InternalServerError",
				message: err.message,
			})
	}

	if (err instanceof ValidateError) {
		return res.status(422).json({
			errorType: "ValidationError",
			message: err.fields,
		})
	}

	next()
}
