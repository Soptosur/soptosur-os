import express, { Express, Request, Response, NextFunction } from 'express';
import { authRouter } from './routes/auth.routes.js';
import { requisitionRouter } from './routes/requisition.routes.js';
import { creativeRouter } from './routes/creative.routes.js';
import { whistleblowerRouter } from './routes/whistleblower.routes.js';
import { resignationRouter } from './routes/resignation.routes.js';

export function createApp(): Express {
  const app: Express = express();

  app.use(express.json());

  // Health probe
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      system: 'Shaptasur Governance OS',
      phase: 'Phase 2: Authentication, Hierarchical RBAC & Anti-Bypass Guards',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/requisitions', requisitionRouter);
  app.use('/api/creative', creativeRouter);
  app.use('/api/whistleblower', whistleblowerRouter);
  app.use('/api/resignation', resignationRouter);

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}

export const app = createApp();
export default app;
