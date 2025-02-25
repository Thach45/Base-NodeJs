import { Request, Response } from 'express';
export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            status: 'success',
            message: 'Welcome to the API'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error fetching'
        });
    }
}