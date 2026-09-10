declare global {
  namespace Express {
    interface Request {
      userId: string
      userEmail: string
      userRole: string
    }
  }
}

export {}