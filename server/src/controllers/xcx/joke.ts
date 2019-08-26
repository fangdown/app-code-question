import { createRouter, catchError } from '../../public/framework';
import { list } from '../../services/xcx/joke';

const router = createRouter();
router.get(
  '/list',
  catchError(async (req, res) => {
    const { page } = req.query;
    const data = await list(+page);
    res.json(data);
  })
);

module.exports = router;
