import { api } from '../public/framework';
export async function list() {
  const uri = `https://data.wxb.com/rank/article?baidu_cat=%E6%90%9E%E7%AC%91&baidu_tag=&page=1&pageSize=50&type=2&order=`;
  try {
    const data = await api.get(
      uri,
      {},
      {
        parse: false,
      }
    );
    return data;
  } catch (err) {
    throw err;
  }
}
