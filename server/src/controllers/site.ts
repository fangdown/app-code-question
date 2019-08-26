import {
  createRouter,
  catchError,
  session,
  express,
} from '../public/framework';
const router = createRouter();

router.get('/', (req, res) => {
  res.status(200).send('hello,api');
});

module.exports = router;
