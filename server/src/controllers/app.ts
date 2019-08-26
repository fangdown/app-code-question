import { createRouter, catchError } from '../public/framework';
import { getUserName } from '../services/app';

const router = createRouter();
router.get(
  '/',
  catchError(async (req, res) => {
    const data = await getUserName();
    res.json(data);
  })
);

module.exports = router;
