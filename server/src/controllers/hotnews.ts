import { createRouter, catchError } from '../public/framework';
import { list } from '../services/hotnews';
import app from '../app';

const router = createRouter();
router.get(
  '/list',
  catchError(async (req, res) => {
    const data = await list();
    res.json(data);
  })
);
router.get(
  '/revert',
  catchError(async (req, res) => {
    const { appUrl } = req.query;
    console.log('==========appurl', appUrl);
    res.redirect(decodeURIComponent(appUrl));
  })
);

module.exports = router;
