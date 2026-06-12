import { Router, type IRouter } from "express";
import healthRouter from "./health";
import calculatorsRouter from "./calculators";
import historyRouter from "./history";
import favoritesRouter from "./favorites";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(calculatorsRouter);
router.use(historyRouter);
router.use(favoritesRouter);
router.use(statsRouter);

export default router;
