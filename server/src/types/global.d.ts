// Extend the Express Request interface
namespace Express {
  interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    date_of_birth: Date;
    loyalty_points: number;
    loyalty_points_redeemed: number;
    created_at: Date;
    updated_at: Date;
    is_admin: boolean;
    is_guest: boolean;
  }

  interface Request {
    user?: User;
    cookies?: {
      accessToken?: string;
      refreshToken?: string;
    };
  }
}
